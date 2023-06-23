/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { useIntersectionObserver, useMeasure, useMediaQuery } from '@react-hookz/web';
import { useFetcher, useNavigate } from '@remix-run/react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import { MimeType, Image as RemixImage } from 'remix-image';
import { useSwiper } from 'swiper/react';

import type { Title } from '~/types/media';
import type { ITrailer } from '~/services/consumet/anilist/anilist.types';
import type { IImage } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useCardHoverStore from '~/store/card/useCardHoverStore';
import { useLayout } from '~/store/layout/useLayout';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import AspectRatio from '~/components/elements/AspectRatio';
import type { Trailer } from '~/components/elements/dialog/WatchTrailerDialog';
import Image from '~/components/elements/Image';
import Rating from '~/components/elements/shared/Rating';
import VolumeOff from '~/assets/icons/VolumeOffIcon';
import VolumeUp from '~/assets/icons/VolumeUpIcon';

const variants = {
  inView: { opacity: 1, x: 0 },
  outView: { opacity: 0, x: 40 },
  showTrailer: { opacity: 1, scale: 0.75 },
};

interface IBannerItemDesktopProps {
  active?: boolean;
  backdropPath: string;
  genreIds: number[];
  genresAnime: string[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  id: number;
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
  overview: string;
  posterPath: string;
  title: string | Title;
  trailer?: ITrailer;
  voteAverage: number;
}

const BannerItemDesktop = (props: IBannerItemDesktopProps) => {
  const {
    active,
    backdropPath,
    genreIds,
    genresAnime,
    genresMovie,
    genresTv,
    id,
    mediaType,
    overview,
    posterPath,
    title,
    trailer,
    voteAverage,
  } = props;
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [logo, setLogo] = useState<IImage>();
  const [player, setPlayer] = useState<ReturnType<YouTube['getInternalPlayer']>>();
  const [isPlayed, setIsPlayed] = useState<boolean>(false);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const [trailerBanner, setTrailerBanner] = useState<Trailer>({});
  const swiper = useSwiper();
  const cardRef = useRef<HTMLDivElement>(null);
  const { viewportRef } = useLayout((state) => state);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isMd = useMediaQuery('(max-width: 960px)', { initializeWithValue: false });
  const isLg = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const bannerIntersection = useIntersectionObserver(cardRef, { root: viewportRef });
  const [size, bannerRef] = useMeasure<HTMLDivElement>();
  const isCardPlaying = useCardHoverStore((state) => state.isCardPlaying);
  const { isMutedTrailer, isPlayTrailer, isFetchLogo, isShowSpotlight } = useSoraSettings();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseRadius = useMotionValue(0);
  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;

  const mute = () => {
    if (!player) return;
    player.mute();
    isMutedTrailer.set(true);
  };

  const unMute = () => {
    if (!player) return;
    player.unMute();
    isMutedTrailer.set(false);
  };

  const play = () => {
    if (!player) return;
    player.playVideo();
    setIsPlayed(true);
  };

  const pause = () => {
    if (!player) return;
    player.pauseVideo();
    setIsPlayed(false);
  };

  useEffect(() => {
    if (!isPlayTrailer.value === true) {
      setShowTrailer(false);
    }
    if (isPlayTrailer.value && swiper.autoplay.running) {
      swiper.autoplay.stop();
    }
  }, [isPlayTrailer.value]);

  useEffect(() => {
    if (!player) return;
    if (
      bannerIntersection?.isIntersecting &&
      active &&
      !isPlayed &&
      !isCardPlaying &&
      !document.hidden
    ) {
      play();
    } else if (!bannerIntersection?.isIntersecting && active && isPlayed) {
      pause();
    } else if (active && isCardPlaying && isPlayed) {
      pause();
    }
  }, [bannerIntersection?.isIntersecting, isPlayed, player, active, isCardPlaying]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && bannerIntersection?.isIntersecting && active && !isPlayed) {
        play();
      } else if (document.hidden && isPlayed && active) {
        pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [active, isPlayed]);

  useEffect(() => {
    // fetch logo and youtube trailer key from tmdb
    if (active === true && mediaType !== 'anime') {
      fetcher.load(
        `/api/media?id=${id}&type=${mediaType}${isPlayTrailer.value ? '&video=true' : ''}${
          isFetchLogo.value ? '&image=true' : ''
        }`,
      );
      if (!isPlayTrailer.value) {
        setTrailerBanner({});
      }
    }
  }, [active, isPlayTrailer.value, isFetchLogo.value]);

  useEffect(() => {
    if (
      active === true &&
      fetcher.data &&
      fetcher.data.videos &&
      bannerIntersection?.isIntersecting &&
      mediaType !== 'anime'
    ) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailerBanner(officialTrailer);
    }
    if (
      active === true &&
      fetcher.data &&
      fetcher.data.images &&
      bannerIntersection?.isIntersecting &&
      mediaType !== 'anime'
    ) {
      const { logos } = fetcher.data.images;
      if (logos && logos.length > 0) setLogo(logos[0]);
    }
  }, [fetcher.data]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { currentTarget, clientX, clientY } = e;
    const { top, left } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    mouseRadius.set(size?.width ? (size?.width * 2) / 3 : 1000);
  };

  return (
    <AspectRatio ratio={16 / 8} ref={bannerRef}>
      <Card
        radius="none"
        className="h-full w-full border-0"
        ref={cardRef}
        role="figure"
        onMouseMove={isShowSpotlight.value ? handleMouseMove : undefined}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                ${mouseRadius}px circle at ${mouseX}px ${mouseY}px,
                hsl(var(--colors-default-400) / 15),
                transparent 80%
              )
            `,
          }}
        />
        <CardHeader className="absolute z-10 flex h-full flex-row items-center justify-start gap-5 md:gap-7 lg:gap-9 xl:justify-center 2xl:h-[calc(100%_-_160px)]">
          <div className="flex w-5/6 flex-col items-start justify-center gap-4 px-10 md:w-3/4 lg:w-2/3">
            <AnimatePresence mode="popLayout">
              {logo ? (
                <motion.div
                  key="logo"
                  layout
                  animate={
                    active && !showTrailer
                      ? 'inView'
                      : active && showTrailer
                      ? 'showTrailer'
                      : 'outView'
                  }
                  transition={
                    active && !showTrailer
                      ? { duration: 0.5 }
                      : active && showTrailer
                      ? { duration: 0.5, delay: 0.5 }
                      : { duration: 0.5 }
                  }
                  variants={variants}
                  style={{ originX: 0 }}
                >
                  <Image
                    src={TMDB.logoUrl(logo.file_path, isMd ? 'w185' : 'w300')}
                    alt={titleItem}
                    title={titleItem}
                    radius="none"
                    classNames={{
                      img: 'w-logo object-contain nextui-sm:w-logo-sm',
                    }}
                    loading="eager"
                    disableSkeleton={false}
                    style={{
                      aspectRatio: logo.aspect_ratio,
                      mixBlendMode: 'color-burn',
                      // @ts-ignore
                      '--movie-logo-width':
                        logo?.aspect_ratio && 185 / logo.aspect_ratio > 85
                          ? 85 * Number(logo.aspect_ratio)
                          : 185,
                      '--movie-logo-width-sm':
                        logo?.aspect_ratio && 300 / logo.aspect_ratio > 100
                          ? 100 * Number(logo.aspect_ratio)
                          : 300,
                    }}
                    placeholder="empty"
                    options={{ contentType: MimeType.WEBP }}
                  />
                </motion.div>
              ) : (
                <motion.h1
                  key="title"
                  layout
                  className="!line-clamp-2"
                  animate={active ? 'inView' : 'outView'}
                  transition={{ duration: 0.5 }}
                  variants={variants}
                >
                  {titleItem}
                </motion.h1>
              )}
              {!showTrailer ? (
                <motion.div
                  key="info"
                  layout
                  className="flex flex-row items-center gap-x-4"
                  initial={{ opacity: 0, x: 40 }}
                  animate={
                    active && !showTrailer
                      ? 'inView'
                      : active && showTrailer
                      ? 'outView'
                      : 'outView'
                  }
                  exit={{ opacity: 0, x: 40 }}
                  transition={
                    active && !showTrailer
                      ? { duration: 0.5, delay: 0.15 }
                      : active && showTrailer
                      ? { duration: 0.5 }
                      : { duration: 0.5, delay: 0.15 }
                  }
                  variants={variants}
                >
                  <Rating
                    rating={mediaType === 'anime' ? voteAverage : Number(voteAverage.toFixed(1))}
                    ratingType={mediaType}
                  />
                  <div className="flex flex-row gap-x-2">
                    {mediaType === 'anime'
                      ? genresAnime?.slice(0, 3).map((genre) => (
                          <Chip key={genre} variant="flat" color="default" radius="full">
                            {genre}
                          </Chip>
                        ))
                      : genreIds?.slice(0, 3).map((genreId) => {
                          if (mediaType === 'movie') {
                            return (
                              <Chip
                                key={genresMovie?.[genreId]}
                                variant="flat"
                                color="default"
                                radius="full"
                              >
                                {genresMovie?.[genreId]}
                              </Chip>
                            );
                          }
                          return (
                            <Chip
                              key={genresTv?.[genreId]}
                              variant="flat"
                              color="default"
                              radius="full"
                            >
                              {genresTv?.[genreId]}
                            </Chip>
                          );
                        })}
                  </div>
                </motion.div>
              ) : null}
              {!isMd && !showTrailer ? (
                <motion.p
                  key="overview"
                  layout
                  className="!line-clamp-6 text-justify"
                  initial={{ opacity: 0, x: 40 }}
                  animate={
                    active && !showTrailer
                      ? 'inView'
                      : active && showTrailer
                      ? 'outView'
                      : 'outView'
                  }
                  exit={{ opacity: 0, x: 40 }}
                  transition={
                    active && !showTrailer
                      ? { duration: 0.5, delay: 0.3 }
                      : active && showTrailer
                      ? { duration: 0.5 }
                      : { duration: 0.5, delay: 0.3 }
                  }
                  variants={variants}
                  dangerouslySetInnerHTML={{ __html: overview || '' }}
                />
              ) : null}
              <motion.div
                key="buttons"
                layout
                animate={active ? 'inView' : 'outView'}
                transition={{ duration: 0.5, delay: 0.45 }}
                variants={variants}
              >
                <Button
                  type="button"
                  color="primary"
                  className="font-bold"
                  onPress={() =>
                    navigate(
                      `/${
                        mediaType === 'movie'
                          ? 'movies/'
                          : mediaType === 'tv'
                          ? 'tv-shows/'
                          : 'anime/'
                      }${id}/`,
                      {
                        state: { currentTime: player ? player.playerInfo.currentTime : 0 },
                      },
                    )
                  }
                >
                  {t('moreDetails')}
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
          {!isLg ? (
            <motion.div
              animate={
                active && !showTrailer ? 'inView' : active && showTrailer ? 'outView' : 'outView'
              }
              transition={{ duration: 1, ease: 'easeInOut' }}
              variants={{
                inView: { opacity: 1, scale: 1, x: 0 },
                outView: { opacity: 0, scale: 0, x: 0 },
              }}
              className="flex w-1/3 justify-center"
            >
              <Image
                src={posterPath || ''}
                alt={titleItem}
                title={titleItem}
                width="100%"
                disableSkeleton={false}
                classNames={{
                  wrapper:
                    'rounded-xl shadow-xl shadow-default aspect-[2/3] w-full h-auto min-h-[auto] min-w-[auto] !max-h-[390px] !max-w-[270px] 2xl:!max-h-[477px] 2xl:!max-w-[318px]',
                  img: 'h-full object-cover',
                }}
                loading="eager"
                placeholder="empty"
                responsive={[
                  {
                    size: {
                      width: 270,
                      height: 390,
                    },
                    maxWidth: 1400,
                  },
                  {
                    size: {
                      width: 318,
                      height: 477,
                    },
                  },
                ]}
                options={{
                  contentType: MimeType.WEBP,
                }}
              />
            </motion.div>
          ) : null}
        </CardHeader>
        <CardBody className="after:to-background m-0 overflow-hidden p-0 after:absolute after:bottom-0 after:left-0 after:h-[100px] after:w-full after:bg-gradient-to-b after:from-transparent after:content-[''] after:2xl:h-[250px]">
          <AnimatePresence>
            {!showTrailer && size ? (
              <motion.div
                initial={{ opacity: 0, scale: 1.2, y: 40 }}
                animate={
                  active ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.3, scale: 1.2, y: 40 }
                }
                exit={{ opacity: 0, scale: 1.2, y: 40 }}
                transition={{ duration: 1, ease: 'easeIn' }}
                style={{ overflow: 'hidden' }}
              >
                <RemixImage
                  src={backdropPath || ''}
                  width="100%"
                  height="auto"
                  className="left-0 top-0 aspect-[2/1] object-cover opacity-30"
                  decoding={active ? 'auto' : 'async'}
                  loading="lazy"
                  alt={titleItem}
                  title={titleItem}
                  placeholder="empty"
                  responsive={[
                    {
                      size: {
                        width: size?.width,
                        height: size?.height,
                      },
                    },
                  ]}
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
          {trailerBanner?.key && !isSm && isPlayTrailer.value && active ? (
            <YouTube
              videoId={trailerBanner.key}
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  // https://developers.google.com/youtube/player_parameters
                  autoplay: 0,
                  modestbranding: 1,
                  controls: 0,
                  disablekb: 1,
                  showinfo: 0,
                  branding: 0,
                  rel: 0,
                  autohide: 0,
                  iv_load_policy: 3,
                  cc_load_policy: 0,
                  playsinline: 1,
                  mute: 1,
                  origin: 'https://sora-anime.vercel.app',
                },
              }}
              onReady={({ target }) => {
                if (active && bannerIntersection?.isIntersecting) target.playVideo();
                setPlayer(target);
                if (!isMutedTrailer.value) target.unMute();
              }}
              onPlay={() => {
                setIsPlayed(true);
                if (active && bannerIntersection?.isIntersecting) setShowTrailer(true);
              }}
              onPause={() => {
                setShowTrailer(false);
              }}
              onEnd={() => {
                setShowTrailer(false);
                swiper.slideNext();
              }}
              onError={() => {
                setShowTrailer(false);
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              className={
                showTrailer
                  ? 'relative !-top-[100%] !h-[300%] !w-full overflow-hidden opacity-80'
                  : 'hidden'
              }
            />
          ) : null}
          {trailer?.id && trailer?.site === 'youtube' && isPlayTrailer.value && !isSm && active ? (
            <YouTube
              videoId={trailer?.id}
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  // https://developers.google.com/youtube/player_parameters
                  autoplay: 0,
                  modestbranding: 1,
                  controls: 0,
                  disablekb: 1,
                  showinfo: 0,
                  branding: 0,
                  rel: 0,
                  autohide: 0,
                  iv_load_policy: 3,
                  cc_load_policy: 0,
                  playsinline: 1,
                  mute: 1,
                  origin: 'https://sora-anime.vercel.app',
                },
              }}
              onReady={({ target }) => {
                if (active && bannerIntersection?.isIntersecting) target.playVideo();
                setPlayer(target);
                if (!isMutedTrailer.value) target.unMute();
              }}
              onPlay={() => {
                setIsPlayed(true);
                setShowTrailer(true);
              }}
              onPause={() => {
                setShowTrailer(false);
              }}
              onEnd={() => {
                setShowTrailer(false);
              }}
              onError={() => {
                setShowTrailer(false);
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              className={
                showTrailer
                  ? 'relative !-top-[100%] !h-[300%] !w-full overflow-hidden opacity-80'
                  : 'hidden'
              }
            />
          ) : null}
        </CardBody>
        {!isSm && showTrailer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button
              type="button"
              color="default"
              radius="full"
              variant="ghost"
              isIconOnly
              className="absolute bottom-20 right-[85px] z-[90] h-11 w-11 cursor-pointer hover:opacity-80 2xl:bottom-[200px]"
              aria-label="Toggle Mute"
              onPress={isMutedTrailer.value ? unMute : mute}
            >
              {isMutedTrailer.value ? (
                <VolumeOff fill="currentColor" />
              ) : (
                <VolumeUp fill="currentColor" />
              )}
            </Button>
          </motion.div>
        )}
      </Card>
    </AspectRatio>
  );
};

export default BannerItemDesktop;
