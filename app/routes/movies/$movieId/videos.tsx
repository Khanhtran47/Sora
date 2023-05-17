import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Badge } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useFetcher, useLoaderData, type RouteMatch } from '@remix-run/react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { MimeType } from 'remix-image';

import { authenticate } from '~/services/supabase';
import { getVideos } from '~/services/tmdb/tmdb.server';
import type { Item } from '~/services/youtube/youtube.types';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import Image from '~/components/elements/Image';
import WatchTrailerModal, { type Trailer } from '~/components/elements/dialog/WatchTrailerModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/elements/tab/Tabs';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const { movieId } = params;
  const mid = Number(movieId);

  if (!mid) throw new Response('Not Found', { status: 404 });
  const videos = await getVideos('movie', mid);

  return json({ videos }, { headers: { 'Cache-Control': CACHE_CONTROL.detail } });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/videos`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink to={`/movies/${match.params.movieId}/videos`} aria-label="Videos">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Videos
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: (_match: RouteMatch, parentMatch: RouteMatch) => ({
    title: parentMatch.data?.detail?.title,
    subtitle: 'Videos',
    showImage: parentMatch.data?.detail?.poster_path !== undefined,
    imageUrl: TMDB?.posterUrl(parentMatch.data?.detail?.poster_path || '', 'w92'),
  }),
};

const MovieVideosPage = () => {
  const { videos } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const [activeType, setActiveType] = useState('trailer');
  const [activeTypeVideos, setActiveTypeVideos] = useState<Item[] | []>([]);
  const [visible, setVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const underlineRef = useRef<HTMLDivElement>(null);

  const closeHandler = () => {
    setVisible(false);
    setTrailer({});
  };
  const typesVideo = [
    {
      id: 'trailer',
      activeVideo: 'Trailer',
    },
    {
      id: 'teaser',
      activeVideo: 'Teaser',
    },
    {
      id: 'clip',
      activeVideo: 'Clip',
    },
    {
      id: 'behind_the_scenes',
      activeVideo: 'Behind the Scenes',
    },
    {
      id: 'bloopers',
      activeVideo: 'Bloopers',
    },
    {
      id: 'featurette',
      activeVideo: 'Featurette',
    },
  ];
  useEffect(() => {
    if (videos) {
      let activeVideo = [];
      const activeTypeVideo = typesVideo.find((item) => item.id === activeType);
      activeVideo = videos.results?.filter((video) => video.type === activeTypeVideo?.activeVideo);
      const keyVideo = activeVideo.map((item) => item.key).join(',');
      if (keyVideo) fetcher.load(`/api/youtube-video?id=${keyVideo}`);
      else setActiveTypeVideos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType, videos]);
  useEffect(() => {
    if (fetcher.data && fetcher.data.youtubeVideo) {
      setActiveTypeVideos(fetcher.data.youtubeVideo);
    }
  }, [fetcher.data]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragEnd = (event: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
    const currentTab = typesVideo.find((type) => type.id === activeType);
    if (info.offset?.x > 100) {
      // swipe right
      if (currentTab?.id === 'trailer') {
        setActiveType('featurette');
      } else {
        const index = typesVideo.findIndex((type) => type.id === activeType);
        setActiveType(typesVideo[index - 1].id);
      }
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      // swipe left
      if (currentTab?.id === 'featurette') {
        setActiveType('trailer');
      } else {
        const index = typesVideo.findIndex((type) => type.id === activeType);
        setActiveType(typesVideo[index + 1].id);
      }
    }
  };

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-x-0 gap-y-4 px-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-x-4 sm:gap-y-0 sm:px-3.5 xl:px-4 2xl:px-5">
      <Tabs
        defaultValue={activeType}
        value={activeType}
        orientation={isSm ? 'horizontal' : 'vertical'}
        onValueChange={(value) => setActiveType(value)}
        className="w-full"
      >
        <TabsList>
          {typesVideo.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="relative">
              <h6 className="!m-0">{type.activeVideo}</h6>
              {activeType === type.id ? (
                <motion.div
                  className="absolute overflow-hidden rounded-md bg-neutral-foreground data-[orientation=horizontal]:bottom-0 data-[orientation=vertical]:left-0 data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-1/2 data-[orientation=horizontal]:w-1/2 data-[orientation=vertical]:w-1"
                  layoutId="video-underline"
                  data-orientation={isSm ? 'horizontal' : 'vertical'}
                  ref={underlineRef}
                />
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        <AnimatePresence exitBeforeEnter>
          <TabsContent value={activeType}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
              drag={isMobile ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
              dragDirectionLock
            >
              <div className="grid w-full grid-cols-1 justify-items-center gap-4 lg:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4">
                {activeTypeVideos
                  ? activeTypeVideos.map((video) => (
                      <Card
                        key={video?.id}
                        isPressable
                        isHoverable
                        role="figure"
                        className="w-[320px] hover:shadow-[0_0_0_1px] hover:shadow-primary-200"
                        onPress={() => {
                          const videoPlay = videos?.results?.find((item) => item.key === video.id);
                          if (videoPlay) {
                            setVisible(true);
                            setTrailer(videoPlay);
                          }
                        }}
                      >
                        <CardBody className="shrink-0 grow-0 overflow-hidden p-0">
                          <Image
                            src={video?.snippet?.thumbnails?.medium?.url}
                            width={320}
                            height={180}
                            alt={video?.snippet?.title}
                            loading="lazy"
                            title={video?.snippet?.title}
                            placeholder="empty"
                            loaderUrl="/api/image"
                            options={{ contentType: MimeType.WEBP }}
                            responsive={[{ size: { width: 320, height: 180 } }]}
                          />
                        </CardBody>
                        <CardFooter className="flex flex-col items-start justify-start">
                          <h6 className="!m-0 text-left font-semibold">{video?.snippet?.title}</h6>
                          <p className="opacity-70">{video?.snippet?.channelTitle}</p>
                        </CardFooter>
                      </Card>
                    ))
                  : null}
              </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
      <WatchTrailerModal trailer={trailer} visible={visible} closeHandler={closeHandler} />
    </div>
  );
};

export default MovieVideosPage;
