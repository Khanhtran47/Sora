/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Text } from '@nextui-org/react';
import { getVideos } from '~/services/tmdb/tmdb.server';

type LoaderData = {
  videos: Awaited<ReturnType<typeof getVideos>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const mid = Number(id);

  if (!mid) throw new Response('Not Found', { status: 404 });
  const videos = await getVideos('tv', mid);

  if (!videos) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ videos });
};

const VideosPage = () => {
  const { videos } = useLoaderData<LoaderData>();
  console.log('🚀 ~ file: videos.tsx ~ line 25 ~ VideosPage ~ videos', videos);

  return (
    <Text b h4 css={{ paddingLeft: '88px' }}>
      {' '}
      In development
    </Text>
  );
};

export default VideosPage;
