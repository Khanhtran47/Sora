import { json, type LoaderArgs } from '@remix-run/node';

import { i18next } from '~/services/i18n';
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
  const isFetchImages = url.searchParams.get('image') === 'true';

  const [images, videos] = await Promise.all([
    isFetchImages ? getImages(type, id, locale) : undefined,
    isFetchVideos ? getVideos(type, id) : undefined,
  ]);

  return json(
    {
      ...(images && { images }),
      ...(videos && { videos }),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.default,
      },
    },
  );
};
