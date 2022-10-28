import supabase from './client.server';
import { getSessionFromCookie } from './cookie.server';

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

export const getUser = async (token: string) => supabase.auth.getUser(token);

export const getUserFromCookie = async (cookie: string) => {
  const authCookie = await getSessionFromCookie(cookie);
  if (authCookie.has('auth_token')) {
    const authToken = authCookie.get('auth_token');
    const user = (await getUser(authToken.access_token)).data.user || undefined;

    return user;
  }
};
