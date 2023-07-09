/* eslint-disable import/prefer-default-export */
import { redirect, type LoaderArgs } from '@remix-run/node';

import { getAnimeRandom } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const randomAnime = await getAnimeRandom();
  if (randomAnime) {
    return redirect(`/anime/${randomAnime.id}/`);
  }
  return redirect('/anime/popular');
};
