import supabase from './supabase.server';

export const signUp = async (email: string, password: string) =>
  supabase.auth.signUp({
    email,
    password,
  });

export const signIn = async (email: string, password: string) =>
  supabase.auth.signIn({
    email,
    password,
  });

export const getUser = async (token: string) => supabase.auth.api.getUser(token);
