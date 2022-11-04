import { createCookieSessionStorage } from '@remix-run/node'; // or "@remix-run/cloudflare"
import { Session } from '@supabase/supabase-js';
import { env } from 'process';
import supabase from './client.server';

const {
  getSession: getSessionFromCookie,
  commitSession: commitAuthCookie,
  destroySession: destroyAuthCookie,
} = createCookieSessionStorage({
  cookie: {
    name: 'remix-movie-auth',
    httpOnly: true,
    maxAge: env.NODE_ENV === 'production' ? 3600 * 24 * 30 : 3600 * 2, // about 1 month
    path: '/',
    sameSite: 'lax',
    secrets: [env.SESSION_KEY || 's3cret1'],
    secure: env.NODE_ENV === 'production',
  },
});

export { getSessionFromCookie, commitAuthCookie, destroyAuthCookie };

export async function authSessionHandler(cookie: string | null) {
  const session = await getSessionFromCookie(cookie);

  if (session.has('auth_token')) {
    const authToken = session.get('auth_token');

    if (authToken.expires_at < Date.now()) {
      // get new session with refresh_token
      const { data, error } = await supabase.auth.setSession(authToken as Session);

      if (data.session) {
        // rotate all tokens
        session.set('auth_token', {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: Date.now() + (data.session.expires_in - 10) * 1000,
        });

        return { session, user: data.session.user };
      }

      console.error(error);
    } else {
      const res = await supabase.auth.getUser(authToken.access_token);
      if (res.data.user) {
        return { session: null, user: res.data.user };
      }
    }
  }

  return { session: null, user: null };
}

export async function requestPayload(req: Request) {
  if (!process.env.REQ_ENCODE_ATTRS) {
    console.error('Please make sure you have REQ_ENCODE_ATTRS in your .env');
    process.exit();
  }

  const payloadAttrs = process.env.REQ_ENCODE_ATTRS.split('.');
  return payloadAttrs.map((attr) => req.headers.get(attr)).join('');
}

export async function verifyReqPayload(req: Request) {
  const payload = await requestPayload(req);
  const session = await getSessionFromCookie(req.headers.get('Cookie'));

  if (session.has('auth_token')) {
    const authToken = session.get('auth_token');
    if (authToken?.req_payload) {
      return payload === authToken?.req_payload;
    }
  }

  return false;
}
