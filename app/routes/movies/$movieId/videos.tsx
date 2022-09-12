/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Text, Row, Col, Button } from '@nextui-org/react';
import { getVideos } from '~/services/tmdb/tmdb.server';
import useMediaQuery from '~/hooks/useMediaQuery';

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
  const fetcher = useFetcher();
  const isSm = useMediaQuery(650, 'max');
  const [activeType, setActiveType] = React.useState<number>(0);
  const typeVideo = [
    {
      activeType: 0,
      activeVideo: 'Trailer',
    },
    {
      activeType: 1,
      activeVideo: 'Teaser',
    },
    {
      activeType: 2,
      activeVideo: 'Clip',
    },
    {
      activeType: 3,
      activeVideo: 'Behind the Scenes',
    },
    {
      activeType: 4,
      activeVideo: 'Bloopers',
    },
    {
      activeType: 5,
      activeVideo: 'Featurette',
    },
  ];
  React.useEffect(() => {
    if (videos) {
      let activeVideo = [];
      const activeTypeVideo = typeVideo.find((item) => item.activeType === activeType);
      activeVideo = videos.results?.filter((video) => video.type === activeTypeVideo?.activeVideo);
      console.log('🚀 ~ file: videos.tsx ~ line 61 ~ React.useEffect ~ activeVideo', activeVideo);
      const keyVideo = activeVideo.map((item) => item.key).join(',');
      fetcher.load(`/api/youtube-video?id=${keyVideo}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType, videos]);
  React.useEffect(() => {
    if (fetcher.data) {
      console.log('🚀 ~ file: videos.tsx ~ line 70 ~ React.useEffect ~ fetcher.data', fetcher.data);
    }
  }, [fetcher.data]);

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
      <Col span={4} offset={0.125} css={{ display: 'flex', justifyContent: 'center' }}>
        <Button.Group vertical css={{ width: '50%' }}>
          <Button
            type="button"
            onClick={() => setActiveType(0)}
            {...(activeType === 0 ? {} : { ghost: true })}
          >
            Trailers
          </Button>
          <Button
            type="button"
            onClick={() => setActiveType(1)}
            {...(activeType === 1 ? {} : { ghost: true })}
          >
            Teasers
          </Button>
          <Button
            type="button"
            onClick={() => setActiveType(2)}
            {...(activeType === 2 ? {} : { ghost: true })}
          >
            Clips
          </Button>
          <Button
            type="button"
            onClick={() => setActiveType(3)}
            {...(activeType === 3 ? {} : { ghost: true })}
          >
            Behind the Scenes
          </Button>
          <Button
            type="button"
            onClick={() => setActiveType(4)}
            {...(activeType === 4 ? {} : { ghost: true })}
          >
            Bloopers
          </Button>
          <Button
            type="button"
            onClick={() => setActiveType(5)}
            {...(activeType === 5 ? {} : { ghost: true })}
          >
            Featurettes
          </Button>
        </Button.Group>
      </Col>
      <Col span={isSm ? 12 : 8}>
        <Text b h4>
          {' '}
          In development
        </Text>
      </Col>
    </Row>
  );
};

export default VideosPage;
