/* eslint-disable import/prefer-default-export */
import { redirect } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';

import { getSessionFromCookie, destroyAuthCookie } from '~/services/supabase';

export const loader: ActionFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const session = await getSessionFromCookie(request.headers.get('Cookie'));

  return redirect(searchParams.get('ref') || '/', {
    headers: {
      'Set-Cookie': await destroyAuthCookie(session),
    },
  });
};
