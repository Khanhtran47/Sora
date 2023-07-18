/* eslint-disable import/prefer-default-export */
import { redirect, type ActionArgs } from '@remix-run/node';

import { destroyAuthCookie, getSessionFromCookie } from '~/services/supabase';

export const loader = async ({ request }: ActionArgs) => {
  const { searchParams } = new URL(request.url);
  const session = await getSessionFromCookie(request.headers.get('Cookie'));
  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  return redirect(ref, {
    headers: {
      'Set-Cookie': await destroyAuthCookie(session),
    },
  });
};
