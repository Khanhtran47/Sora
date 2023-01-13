/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';

import { getYoutubeVideo } from '~/services/youtube/youtube.server';
import { CACHE_CONTROL } from '~/utils/server/http';

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) throw new Response('No id', { status: 400 });
  const youtubeVideo = await getYoutubeVideo(id, true, true);
  if (!youtubeVideo) throw new Response('Not Found', { status: 404 });

  return json({ youtubeVideo }, {
    headers: {
      'Cache-Control': CACHE_CONTROL.default,
    }
  });
};
