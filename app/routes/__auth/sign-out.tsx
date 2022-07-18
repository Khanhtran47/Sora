/* eslint-disable import/prefer-default-export */
import { redirect } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';

import { getSession, destroySession } from '~/services/sessions.server';

export const loader: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  return redirect(request.referrer ?? '/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};
