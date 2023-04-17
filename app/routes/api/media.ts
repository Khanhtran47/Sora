import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';

import i18next from '~/i18n/i18next.server';
import { authenticate } from '~/services/supabase';
import { getImages, getVideos } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  const id = Number(url.searchParams.get('id'));
  if (!id) throw new Response('Not Found', { status: 404 });

  const type = url.searchParams.get('type') as 'movie' | 'tv';
  if (!type) throw new Response('Not Found', { status: 404 });

  const isFetchVideos = url.searchParams.get('video') === 'true';

  const [images, videos] = await Promise.all([
    getImages(type, id, locale),
    isFetchVideos ? getVideos(type, id) : undefined,
  ]);

  return json(
    { images, videos },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.default,
      },
    },
  );
};
