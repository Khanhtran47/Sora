import supabase from './client.server';

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

export const getAuthSession = async () => supabase.auth.getSession();
