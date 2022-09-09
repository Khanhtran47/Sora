/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Text, Row } from '@nextui-org/react';
import { getVideos } from '~/services/tmdb/tmdb.server';

type LoaderData = {
  videos: Awaited<ReturnType<typeof getVideos>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { movieId } = params;
  const mid = Number(movieId);

  if (!mid) throw new Response('Not Found', { status: 404 });
  const videos = await getVideos('movie', mid);

  if (!videos) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ videos });
};

const VideosPage = () => {
  const { videos } = useLoaderData<LoaderData>();
  console.log('🚀 ~ file: videos.tsx ~ line 25 ~ VideosPage ~ videos', videos);

  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: '0 0.75rem',
        '@xs': {
          padding: '0 3vw',
        },
        '@sm': {
          padding: '0 6vw',
        },
        '@md': {
          padding: '0 12vw',
        },
      }}
    >
      <Text b h4 css={{ paddingLeft: '88px' }}>
        {' '}
        In development
      </Text>
    </Row>
  );
};

export default VideosPage;
