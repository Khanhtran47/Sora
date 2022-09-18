/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { getYoutubeVideo } from '~/services/youtube/youtube.server';

type LoaderData = {
  youtubeVideo: Awaited<ReturnType<typeof getYoutubeVideo>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) throw new Response('No id', { status: 400 });
  const youtubeVideo = await getYoutubeVideo(id, true, true);
  if (!youtubeVideo) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ youtubeVideo });
};
