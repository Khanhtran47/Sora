import { json, type LoaderArgs } from '@remix-run/node';

import { getSubtitlesSearch } from '~/services/open-subtitles/open-subtitles.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);
  const url = new URL(request.url);
  const tmdb_id = url.searchParams.get('tmdb_id');
  const parent_tmdb_id = url.searchParams.get('parent_tmdb_id');
  const season_number = url.searchParams.get('season_number');
  const episode_number = url.searchParams.get('episode_number');
  const query = url.searchParams.get('query');
  const language = url.searchParams.get('language');
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;
  const subtitlesSearch = await getSubtitlesSearch(
    undefined,
    undefined,
    tmdb_id ? Number(tmdb_id) : undefined,
    undefined,
    undefined,
    parent_tmdb_id ? Number(parent_tmdb_id) : undefined,
    query ? query : undefined,
    undefined,
    episode_number ? Number(episode_number) : undefined,
    undefined,
    undefined,
    language ? language : undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    page,
    season_number ? Number(season_number) : undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  );

  return json(
    { subtitlesSearch },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.default,
      },
    },
  );
};
