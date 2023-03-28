/* eslint-disable import/prefer-default-export */
import { redirect } from '@remix-run/node';
import type { ActionArgs } from '@remix-run/node';

import { getSessionFromCookie, destroyAuthCookie } from '~/services/supabase';
import { commitSession, getSession, setSuccessMessage } from '~/services/message.server';

export const loader = async ({ request }: ActionArgs) => {
  const { searchParams } = new URL(request.url);
  const session = await getSessionFromCookie(request.headers.get('Cookie'));
  const messageSession = await getSession(request.headers.get('cookie'));

  setSuccessMessage(messageSession, 'You have been signed out!');
  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  const headers = new Headers();
  headers.set('Set-Cookie', await commitSession(messageSession));
  headers.set('Set-Cookie', await destroyAuthCookie(session));
  return redirect(ref, { headers });
};
