/* eslint-disable import/prefer-default-export */
import { redirect } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';

import { getSessionFromCookie, destroyAuthCookie } from '~/services/supabase';

export const loader: ActionFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const session = await getSessionFromCookie(request.headers.get('Cookie'));
  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  return redirect(ref, {
    headers: {
      'Set-Cookie': await destroyAuthCookie(session),
    },
  });
};
