import { env } from 'process';
import { createClient } from '@supabase/supabase-js';

import type { Database } from './table.server';

let supabaseUrl;
let supabaseKey;

if (env.NODE_ENV === 'production') {
  if (!env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is required');
  }
  supabaseUrl = env.SUPABASE_URL;

  if (!env.SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_SERVICE_KEY is required');
  }
  supabaseKey = env.SUPABASE_SERVICE_KEY;
} else {
  if (!env.SUPABASE_DEV_URL) {
    throw new Error('SUPABASE_DEV_URL is required');
  }
  supabaseUrl = env.SUPABASE_DEV_URL;

  if (!env.SUPABASE_DEV_KEY) {
    throw new Error('SUPABASE_DEV_KEY is required');
  }
  supabaseKey = env.SUPABASE_DEV_KEY;
}

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-my-custom-header': env.NODE_ENV === 'production' ? 'remix-movie' : 'remix-movie-dev',
    },
  },
};

const supabase = createClient<Database>(supabaseUrl, supabaseKey, options);

export default supabase;
