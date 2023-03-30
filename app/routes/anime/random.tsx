/* eslint-disable import/prefer-default-export */
import { redirect, type LoaderArgs } from '@remix-run/node';

import { authenticate } from '~/services/supabase';
import { getAnimeRandom } from '~/services/consumet/anilist/anilist.server';

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const randomAnime = await getAnimeRandom();
  if (randomAnime) {
    return redirect(`/anime/${randomAnime.id}/overview`);
  }
  return redirect('/anime/popular');
};
