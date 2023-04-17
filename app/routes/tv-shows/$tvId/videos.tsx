/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { useEffect, useState } from 'react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { Row, Col, Button, Grid, Card } from '@nextui-org/react';

import { authenticate } from '~/services/supabase';
import { getVideos } from '~/services/tmdb/tmdb.server';
import type { Item } from '~/services/youtube/youtube.types';
import { CACHE_CONTROL } from '~/utils/server/http';

import { useMediaQuery } from '@react-hookz/web';

import WatchTrailerModal, { type Trailer } from '~/components/elements/modal/WatchTrailerModal';
import { H5, H6 } from '~/components/styles/Text.styles';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const { tvId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not Found', { status: 404 });
  const videos = await getVideos('tv', tid);

  return json(
    { videos },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/videos`,
});

const TvVideosPage = () => {
  const { videos } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const [activeType, setActiveType] = useState<number>(0);
  const [activeTypeVideos, setActiveTypeVideos] = useState<Item[] | []>([]);
  const [visible, setVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});

  const closeHandler = () => {
    setVisible(false);
    setTrailer({});
  };
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
    {
      activeType: 6,
      activeVideo: 'Opening Credits',
    },
  ];
  useEffect(() => {
    if (videos) {
      let activeVideo = [];
      const activeTypeVideo = typeVideo.find((item) => item.activeType === activeType);
      activeVideo = videos.results?.filter((video) => video.type === activeTypeVideo?.activeVideo);
      const keyVideo = activeVideo.map((item) => item.key).join(',');
      keyVideo ? fetcher.load(`/api/youtube-video?id=${keyVideo}`) : setActiveTypeVideos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType, videos]);
  useEffect(() => {
    if (fetcher.data && fetcher.data.youtubeVideo) {
      setActiveTypeVideos(fetcher.data.youtubeVideo);
    }
  }, [fetcher.data]);

  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        maxWidth: '1920px',
        flexDirection: 'column',
        px: '0.75rem',
        '@xs': {
          flexDirection: 'row',
          px: '3vw',
        },
        '@sm': {
          px: '6vw',
        },
        '@md': {
          px: '12vw',
        },
        '@lg': {
          px: 'calc(0.75rem + 20px)',
        },
      }}
    >
      <Col
        css={{
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          '@xs': {
            justifyContent: 'center',
            width: '33.3333%',
          },
        }}
      >
        <Button.Group
          {...(isSm ? { vertical: false } : { vertical: true })}
          css={{
            '@xsMax': {
              width: '100%',
              overflowX: 'auto',
              flexFlow: 'row nowrap',
            },
          }}
        >
          {typeVideo.map((item, index) => (
            <Button
              key={`button-item-${item.activeVideo}`}
              type="button"
              onPress={() => setActiveType(index)}
              {...(activeType === item.activeType ? {} : { ghost: true })}
              css={{
                '@xsMax': {
                  flexGrow: '1',
                  flexShrink: '0',
                  dflex: 'center',
                },
              }}
            >
              {item.activeVideo}
            </Button>
          ))}
        </Button.Group>
      </Col>
      <Col css={{ width: '100%', '@xs': { width: '66.6667%' } }}>
        <Grid.Container gap={1} justify="flex-start">
          {activeTypeVideos &&
            activeTypeVideos.map((video) => (
              <Grid xs={12} sm={6} key={video.id}>
                <Card
                  as="div"
                  isPressable
                  isHoverable
                  role="figure"
                  css={{ borderWidth: 0 }}
                  onPress={() => {
                    const videoPlay = videos?.results?.find((item) => item.key === video.id);
                    if (videoPlay) {
                      setVisible(true);
                      setTrailer(videoPlay);
                    }
                  }}
                >
                  <Card.Body css={{ p: 0 }}>
                    <Card.Image
                      src={video?.snippet?.thumbnails?.medium?.url}
                      objectFit="cover"
                      width="100%"
                      height="auto"
                      alt={video?.snippet?.title}
                      showSkeleton
                      maxDelay={10000}
                      loading="lazy"
                      title={video?.snippet?.title}
                    />
                  </Card.Body>
                  <Card.Footer
                    css={{
                      justifyItems: 'flex-start',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <H5 h5 weight="bold">
                      {video?.snippet?.title}
                    </H5>
                    <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold', fontSize: '$sm' }}>
                      {video?.snippet?.channelTitle}
                    </H6>
                  </Card.Footer>
                </Card>
              </Grid>
            ))}
        </Grid.Container>
      </Col>
      <WatchTrailerModal trailer={trailer} visible={visible} closeHandler={closeHandler} />
    </Row>
  );
};

export default TvVideosPage;
