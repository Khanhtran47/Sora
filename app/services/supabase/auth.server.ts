/* eslint-disable @typescript-eslint/no-throw-literal */
import { Session } from '@supabase/supabase-js';
import { redirect } from '@remix-run/node';
import isbot from 'isbot';

import sgConfigs from '../configs.server';
import supabase from './client.server';
import { commitAuthCookie, getSessionFromCookie } from './cookie.server';

export const signUp = async (email: string, password: string) =>
  supabase.auth.signUp({
    email,
    password,
  });

export const signInWithPassword = async (email: string, password: string) =>
  supabase.auth.signInWithPassword({
    email,
    password,
  });

export const getUserFromCookie = async (cookie: string) => {
  const authCookie = await getSessionFromCookie(cookie);
  if (authCookie.has('auth_token')) {
    const authToken = authCookie.get('auth_token');
    const user = (await supabase.auth.getUser(authToken.access_token)).data.user || undefined;

    return user;
  }
};

export async function requestPayload(req: Request) {
  if (!process.env.REQ_ENCODE_ATTRS) {
    console.error('Please make sure you have REQ_ENCODE_ATTRS in your .env');
    process.exit();
  }

  const payloadAttrs = process.env.REQ_ENCODE_ATTRS.split('.');
  return payloadAttrs.map((attr) => req.headers.get(attr)).join('');
}

export async function authenticate(
  request: Request,
  customAuthRequired?: boolean,
  botcheckRequired?: boolean,
  headers = new Headers(),
) {
  // try to get the session (from cookie) and payload from request
  const [session, payload, botcheck] = await Promise.all([
    getSessionFromCookie(request.headers.get('Cookie')),
    requestPayload(request),
    isbot(request.headers.get('User-Agent')),
  ]);

  if (botcheck && botcheckRequired) {
    throw new Response(null, { status: 500 });
  } else if (!session.has('auth_token')) {
    // there is no token, no signed-in or expired cookie
    if (sgConfigs.__globalAuthRequired || customAuthRequired) {
      // if global auth is required, redirect to /sign-in
      const url = new URL(request.url);
      const ref = (url.pathname + url.search).replace('?', '_0x3F_').replace('&', '_0x26');
      throw redirect(`/sign-in?ref=${ref}`);
    }
  } else {
    // there is some access token in cookie session
    const authToken = session.get('auth_token');

    if (payload !== authToken?.req_payload) {
      // the access token and the agent does not come from same agent
      throw new Response(null, { status: 200 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(authToken.access_token);

    // if (getUserError) throw getUserError;

    if (!user || authToken.expires_at < Date.now()) {
      // invalid token or access_token has been expired
      // refresh the session
      const { data } = await supabase.auth.setSession(authToken as Session);

      // if (setSessionError) throw setSessionError;

      if (data.session) {
        session.set('auth_token', {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: Date.now() + (data.session.expires_in - 10) * 1000,
          req_payload: await requestPayload(request),
        });

        headers.append('Set-Cookie', await commitAuthCookie(session));

        if (request.method === 'GET') {
          // redirect to the same url if loader (GET)
          throw redirect(request.url, { headers });
        }
      }
    } else {
      // if there is a valid user, return user
      return user;
    }
  }
}
