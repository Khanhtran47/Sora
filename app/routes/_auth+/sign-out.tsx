import { type ActionArgs } from '@remix-run/node';

import { destroyAuthCookie, getSessionFromCookie } from '~/services/supabase';
import { redirectWithToast } from '~/utils/server/toast-session.server';

export const loader = async ({ request }: ActionArgs) => {
  const { searchParams } = new URL(request.url);
  const session = await getSessionFromCookie(request.headers.get('Cookie'));
  const ref = (searchParams.get('ref') || '/').replace('_0x3F_', '?').replace('_0x26', '&');

  return redirectWithToast(
    request,
    ref,
    {
      type: 'success',
      title: 'Logged out',
      description: 'You have been logged out.',
    },
    { headers: { 'Set-Cookie': await destroyAuthCookie(session) } },
  );
};
