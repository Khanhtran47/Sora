import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { MimeType } from 'remix-image';

import type { Handle } from '~/types/handle';
import type { loader as tvSeasonIdLoader } from '~/routes/tv-shows+/$tvId_.season.$seasonId';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getTvSeasonVideos } from '~/services/tmdb/tmdb.server';
import type { Item } from '~/services/youtube/youtube.types';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import { Dialog, DialogContent, DialogTrigger } from '~/components/elements/Dialog';
import WatchTrailer, { type Trailer } from '~/components/elements/dialog/WatchTrailerDialog';
import Image from '~/components/elements/Image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/elements/tab/Tabs';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId, seasonId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not Found', { status: 404 });
  const videos = await getTvSeasonVideos(tid, Number(seasonId), locale);

  if (!videos) throw new Response('Not Found', { status: 404 });

  return json({ videos }, { headers: { 'Cache-Control': CACHE_CONTROL.detail } });
};

export const meta = mergeMeta<
  null,
  { 'routes/tv-shows+/$tvId_.season.$seasonId': typeof tvSeasonIdLoader }
>(({ params, matches }) => {
  const tvSeasonData = matches.find(
    (match) => match.id === 'routes/tv-shows+/$tvId_.season.$seasonId',
  )?.data;
  if (!tvSeasonData?.seasonDetail) {
    return [
      { title: 'Missing Season' },
      { name: 'description', content: `There is no season with the ID: ${params.seasonId}` },
    ];
  }
  const { detail, seasonDetail } = tvSeasonData;
  const { name } = detail || {};
  return [
    { title: `Sora - ${name} ${seasonDetail?.name || ''} - Videos` },
    {
      property: 'og:url',
      content: `https://sorachill.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/videos`,
    },
    { property: 'og:title', content: `Sora - ${name} ${seasonDetail?.name || ''} - Videos` },
    { name: 'twitter:title', content: `Sora - ${name} ${seasonDetail?.name || ''} - Videos` },
  ];
});

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/videos`}
      key={`tv-shows-${match.params.tvId}-season-${match.params.seasonId}-videos`}
    >
      {t('videos')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ parentMatch, t }) => ({
    title: `${parentMatch?.data?.detail?.name || parentMatch?.data?.detail?.original_name} - ${
      parentMatch?.data?.seasonDetail?.name
    }`,
    subtitle: t('videos'),
    showImage: parentMatch?.data?.seasonDetail?.poster_path !== undefined,
    imageUrl: TMDB.posterUrl(parentMatch?.data?.seasonDetail?.poster_path || '', 'w92'),
  }),
};

const VideosPage = () => {
  const { videos } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { t } = useTranslation();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const [activeType, setActiveType] = useState('trailer');
  const [activeTypeVideos, setActiveTypeVideos] = useState<Item[] | []>([]);
  const [visible, setVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const underlineRef = useRef<HTMLDivElement>(null);

  const typesVideo = [
    {
      id: 'trailer',
      activeVideo: 'trailer',
    },
    {
      id: 'teaser',
      activeVideo: 'teaser',
    },
    {
      id: 'clip',
      activeVideo: 'clip',
    },
    {
      id: 'behind_the_scenes',
      activeVideo: 'behind-the-scenes',
    },
    {
      id: 'bloopers',
      activeVideo: 'bloopers',
    },
    {
      id: 'featurette',
      activeVideo: 'featurette',
    },
    {
      id: 'opening_credits',
      activeVideo: 'opening-credits',
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
        setActiveType('opening_credits');
      } else {
        const index = typesVideo.findIndex((type) => type.id === activeType);
        setActiveType(typesVideo[index - 1].id);
      }
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      // swipe left
      if (currentTab?.id === 'opening_credits') {
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
              <h6 className="!m-0">{t(type.activeVideo)}</h6>
              {activeType === type.id ? (
                <motion.div
                  className="absolute overflow-hidden rounded-small bg-default-foreground data-[orientation=horizontal]:bottom-0 data-[orientation=vertical]:left-0 data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-1/2 data-[orientation=horizontal]:w-1/2 data-[orientation=vertical]:w-1"
                  layoutId="video-underline"
                  data-orientation={isSm ? 'horizontal' : 'vertical'}
                  ref={underlineRef}
                />
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        <Dialog open={visible} onOpenChange={setVisible}>
          <AnimatePresence mode="wait">
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
                        <DialogTrigger asChild key={video?.id}>
                          <Card
                            isPressable
                            isHoverable
                            role="figure"
                            className="w-[320px] data-[hover=true]:ring-2 data-[hover=true]:ring-focus"
                            onPress={() => {
                              const videoPlay = videos?.results?.find(
                                (item) => item.key === video.id,
                              );
                              if (videoPlay) {
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
                                options={{ contentType: MimeType.WEBP }}
                                responsive={[{ size: { width: 320, height: 180 } }]}
                              />
                            </CardBody>
                            <CardFooter className="flex flex-col items-start justify-start">
                              <h6 className="!m-0 text-left font-semibold">
                                {video?.snippet?.title}
                              </h6>
                              <p className="opacity-70">{video?.snippet?.channelTitle}</p>
                            </CardFooter>
                          </Card>
                        </DialogTrigger>
                      ))
                    : null}
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
          <DialogContent className="overflow-hidden !p-0">
            <WatchTrailer trailer={trailer} />
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
};

export default VideosPage;
