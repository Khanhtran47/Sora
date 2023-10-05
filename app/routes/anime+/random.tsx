import { redirect, type LoaderFunctionArgs } from '@remix-run/node';

import { getAnimeRandom } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { redirectWithToast } from '~/utils/server/toast-session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate(request, undefined, true);

  const randomAnime = await getAnimeRandom();
  if (randomAnime) {
    return redirect(`/anime/${randomAnime.id}/`);
  }
  return redirectWithToast(request, '/anime/popular', {
    type: 'error',
    title: 'Error',
    description: 'Could not find a random anime',
  });
};
