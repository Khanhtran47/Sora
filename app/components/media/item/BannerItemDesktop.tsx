/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useEffect, useState, useCallback } from 'react';
import { Button, Card, Col, Row, Spacer, Text, Badge, Image as NextImage } from '@nextui-org/react';
import { useFetcher, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Image, { MimeType } from 'remix-image';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { useInView } from 'react-intersection-observer';

import useCardHoverStore from '~/store/card/useCardHoverStore';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import useMediaQuery from '~/hooks/useMediaQuery';
import useSize from '~/hooks/useSize';
import { IImage } from '~/services/tmdb/tmdb.types';
import { ITrailer } from '~/services/consumet/anilist/anilist.types';
import { Title } from '~/types/media';
import TMDB from '~/utils/media';

import AspectRatio from '~/components/elements/aspect-ratio/AspectRatio';
import { Trailer } from '~/components/elements/modal/WatchTrailerModal';
import Rating from '~/components/elements/shared/Rating';
import { H5, H6 } from '~/components/styles/Text.styles';

import VolumeUp from '~/assets/icons/VolumeUpIcon';
import VolumeOff from '~/assets/icons/VolumeOffIcon';

const variants = {
  inView: { opacity: 1, x: 0 },
  outView: { opacity: 0, x: 40 },
  showTrailer: { opacity: 1, scale: 0.75, x: -40 },
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
  const isSm = useMediaQuery('(max-width: 650px)');
  const isMd = useMediaQuery('(max-width: 960px)');
  const isLg = useMediaQuery('(max-width: 1280px)');
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const bannerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useSize(bannerRef);

  const isCardPlaying = useCardHoverStore((state) => state.isCardPlaying);

  const { isMutedTrailer, setIsMutedTrailer, isPlayTrailer } = useSoraSettings();
  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;

  const mute = useCallback(() => {
    if (!player) return;
    player.mute();
    setIsMutedTrailer(true);
  }, [player]);

  const unMute = useCallback(() => {
    if (!player) return;
    player.unMute();
    setIsMutedTrailer(false);
  }, [player]);

  const play = useCallback(() => {
    if (!player) return;
    player.playVideo();
    setIsPlayed(true);
  }, [player]);

  const pause = useCallback(() => {
    if (!player) return;
    player.pauseVideo();
    setIsPlayed(false);
  }, [player]);

  const pauseVideoOnOutOfView = () => {
    if (!player) return;
    if (inView && !isPlayed) {
      play();
    } else if (!inView && isPlayed) {
      pause();
    }
  };

  const handleVisibility = () => {
    if (!document.hidden && inView && !isPlayed) {
      play();
    } else if (document.hidden && isPlayed) {
      pause();
    }
  };

  const pauseVideoOnCardPlaying = () => {
    if (player) {
      if (isCardPlaying && isPlayed) {
        pause();
      }
    }
  };

  useEffect(() => {
    // fetch logo and youtube trailer key from tmdb
    if (active === true && mediaType !== 'anime') {
      if (isPlayTrailer === true) {
        fetcher.load(`/api/media?id=${id}&type=${mediaType}&video=true`);
      } else {
        fetcher.load(`/api/media?id=${id}&type=${mediaType}`);
        setTrailerBanner({});
      }
    }
  }, [active, isPlayTrailer]);

  useEffect(() => {
    if (active === true && fetcher.data && fetcher.data.videos && inView && mediaType !== 'anime') {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailerBanner(officialTrailer);
    }
    if (active === true && fetcher.data && fetcher.data.images && inView && mediaType !== 'anime') {
      const { logos } = fetcher.data.images;
      if (logos && logos.length > 0) setLogo(logos[0]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (!isPlayTrailer === true) {
      setShowTrailer(false);
    }
  }, [isPlayTrailer]);

  useEffect(() => {
    const watchScroll = () => {
      window.addEventListener('scroll', pauseVideoOnOutOfView);
    };
    watchScroll();
    return () => {
      window.removeEventListener('scroll', pauseVideoOnOutOfView);
    };
  });

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [handleVisibility]);

  useEffect(() => {
    pauseVideoOnCardPlaying();
  }, [isCardPlaying]);

  return (
    <AspectRatio.Root ratio={16 / 8} ref={bannerRef}>
      <Card ref={ref} variant="flat" css={{ w: width, h: height, borderWidth: 0 }} role="figure">
        <Card.Header
          css={{ position: 'absolute', zIndex: 1, h: height, '@lgMin': { h: height - 160 } }}
        >
          <Row
            gap={isMd ? 0.5 : 3}
            css={{ h: height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Col
              span={isLg ? 10 : 8}
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                transition: 'all 0.5s ease',
              }}
            >
              {logo ? (
                <motion.div
                  animate={
                    active && !showTrailer
                      ? 'inView'
                      : active && showTrailer
                      ? 'showTrailer'
                      : 'outView'
                  }
                  transition={{ duration: 0.5 }}
                  variants={variants}
                  style={{
                    minWidth: isLg ? '185px' : '300px',
                    minHeight: `${
                      isLg ? 185 / Number(logo.aspect_ratio) : 300 / Number(logo.aspect_ratio)
                    }px`,
                  }}
                >
                  <NextImage
                    // @ts-ignore
                    as={Image}
                    src={TMDB.logoUrl(logo.file_path, isLg ? 'w185' : 'w300')}
                    alt={titleItem}
                    title={titleItem}
                    objectFit="cover"
                    width="100%"
                    height="auto"
                    loading="eager"
                    showSkeleton
                    containerCss={{
                      minWidth: isLg ? '185px !important' : '300px !important',
                      minHeight: `${
                        isLg ? 185 / Number(logo.aspect_ratio) : 300 / Number(logo.aspect_ratio)
                      }px !important`,
                    }}
                    css={{
                      minWidth: 'auto !important',
                      minHeight: 'auto !important',
                      maxWidth: isLg ? '185px' : '300px',
                      maxHeight: `${
                        isLg ? 185 / Number(logo.aspect_ratio) : 300 / Number(logo.aspect_ratio)
                      }px`,
                    }}
                    loaderUrl="/api/image"
                    placeholder="empty"
                    options={{
                      contentType: MimeType.WEBP,
                    }}
                  />
                </motion.div>
              ) : (
                <Text
                  as={motion.h1}
                  weight="bold"
                  className="!line-clamp-2"
                  css={{
                    fontSize: '3.25rem !important',
                    marginBottom: 0,
                    fontWeight: 700,
                    lineHeight: 'var(--nextui-lineHeights-base)',
                  }}
                  // @ts-ignore
                  animate={active ? 'inView' : 'outView'}
                  transition={{ duration: 0.5 }}
                  variants={variants}
                >
                  {titleItem}
                </Text>
              )}
              <AnimatePresence>
                {!showTrailer ? (
                  <Row
                    // @ts-ignore
                    as={motion.div}
                    css={{ marginTop: '1rem' }}
                    align="center"
                    initial={{ opacity: 0, x: 40 }}
                    animate={
                      active && !showTrailer
                        ? 'inView'
                        : active && showTrailer
                        ? 'outView'
                        : 'outView'
                    }
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    variants={variants}
                  >
                    <Rating
                      rating={mediaType === 'anime' ? voteAverage : Number(voteAverage.toFixed(1))}
                      ratingType={mediaType}
                    />
                    <Spacer x={1.5} />
                    <H5
                      h5
                      css={{
                        display: 'flex',
                        flexDirection: 'row',
                        [`& ${Badge}`]: {
                          border: 0,
                        },
                      }}
                    >
                      {mediaType === 'anime'
                        ? genresAnime?.slice(0, 2).map((genre) => (
                            <>
                              <Badge variant="flat" color="primary">
                                {genre}
                              </Badge>
                              <Spacer x={0.5} />
                            </>
                          ))
                        : genreIds?.map((genreId) => {
                            if (mediaType === 'movie') {
                              return (
                                <>
                                  <Badge variant="flat" color="primary">
                                    {genresMovie?.[genreId]}
                                  </Badge>
                                  <Spacer x={0.5} />
                                </>
                              );
                            }
                            return (
                              <>
                                <Badge variant="flat" color="primary">
                                  {genresTv?.[genreId]}
                                </Badge>
                                <Spacer x={0.5} />
                              </>
                            );
                          })}
                    </H5>
                  </Row>
                ) : null}
              </AnimatePresence>
              <AnimatePresence>
                {!isMd && !showTrailer ? (
                  <Text
                    as={motion.p}
                    className="!line-clamp-6"
                    css={{
                      fontSize: '1rem !important',
                      fontWeight: 400,
                      margin: '1.25rem 0 0 0',
                      textAlign: 'justify',
                    }}
                    // @ts-ignore
                    initial={{ opacity: 0, x: 40 }}
                    animate={
                      active && !showTrailer
                        ? 'inView'
                        : active && showTrailer
                        ? 'outView'
                        : 'outView'
                    }
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    variants={variants}
                    dangerouslySetInnerHTML={{ __html: overview || '' }}
                  />
                ) : null}
              </AnimatePresence>
              <Row
                // @ts-ignore
                as={motion.div}
                wrap="wrap"
                animate={active ? 'inView' : 'outView'}
                transition={{ duration: 0.5, delay: 0.75 }}
                variants={variants}
              >
                <Button
                  type="button"
                  auto
                  // shadow
                  css={{
                    marginTop: '1.125rem',
                  }}
                  onPress={() =>
                    navigate(
                      `/${
                        mediaType === 'movie'
                          ? 'movies/'
                          : mediaType === 'tv'
                          ? 'tv-shows/'
                          : 'anime/'
                      }${id}/${mediaType === 'anime' ? 'overview' : ''}`,
                      {
                        state: { currentTime: player ? player.playerInfo.currentTime : 0 },
                      },
                    )
                  }
                >
                  <H6 h6 weight="bold" transform="uppercase">
                    {t('watchNow')}
                  </H6>
                </Button>
              </Row>
            </Col>
            {!isLg ? (
              <Col
                // @ts-ignore
                as={motion.div}
                span={4}
                animate={
                  active && !showTrailer ? 'inView' : active && showTrailer ? 'outView' : 'outView'
                }
                transition={{ duration: 0.75 }}
                variants={{
                  inView: { opacity: 1, scale: 1, x: 0 },
                  outView: { opacity: 0, scale: 0, x: 0 },
                }}
              >
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={posterPath || ''}
                  alt={titleItem}
                  title={titleItem}
                  objectFit="cover"
                  width="100%"
                  containerCss={{
                    display: 'flex',
                    justifyContent: 'center',
                    overflow: 'visible',
                  }}
                  showSkeleton
                  css={{
                    minWidth: 'auto !important',
                    minHeight: 'auto !important',
                    maxWidth: '270px',
                    maxHeight: '390px',
                    borderRadius: '24px',
                    boxShadow: '12px 12px 30px 10px rgb(104 112 118 / 0.18)',
                    '@lg': {
                      maxWidth: '318px',
                      maxHeight: '477px',
                    },
                  }}
                  loading="eager"
                  loaderUrl="/api/image"
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
              </Col>
            ) : null}
          </Row>
        </Card.Header>
        <Card.Body
          css={{
            p: 0,
            overflow: 'hidden',
            margin: 0,
            '&::after': {
              content: '',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100px',
              backgroundImage: 'linear-gradient(0deg, $background, $backgroundTransparent)',
              '@lgMin': {
                height: '250px',
              },
            },
          }}
        >
          <AnimatePresence>
            {!showTrailer && active ? (
              <motion.div
                initial={{ opacity: 0, scale: 1.2, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ overflow: 'hidden' }}
              >
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={backdropPath || ''}
                  loading="eager"
                  width="100%"
                  height="auto"
                  css={{
                    top: 0,
                    left: 0,
                    objectFit: 'cover',
                    opacity: 0.3,
                  }}
                  showSkeleton
                  alt={titleItem}
                  title={titleItem}
                  loaderUrl="/api/image"
                  placeholder="empty"
                  responsive={[
                    {
                      size: {
                        width,
                        height,
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
          {trailerBanner?.key && !isSm && isPlayTrailer && active ? (
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
                if (active && inView) target.playVideo();
                setPlayer(target);
                if (!isMutedTrailer) target.unMute();
              }}
              onPlay={() => {
                setIsPlayed(true);
                if (active && inView) setShowTrailer(true);
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
                  ? 'relative !w-full overflow-hidden !h-[300%] !-top-[100%] opacity-80'
                  : 'hidden'
              }
            />
          ) : null}
          {trailer?.id && trailer?.site === 'youtube' && isPlayTrailer && !isSm && active ? (
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
                if (active && inView) target.playVideo();
                setPlayer(target);
                if (!isMutedTrailer) target.unMute();
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
                  ? 'relative !w-full overflow-hidden !h-[300%] !-top-[100%] opacity-80'
                  : 'hidden'
              }
            />
          ) : null}
        </Card.Body>
        {!isSm && showTrailer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button
              type="button"
              auto
              color="primary"
              rounded
              ghost
              icon={
                isMutedTrailer ? (
                  <VolumeOff fill="currentColor" />
                ) : (
                  <VolumeUp fill="currentColor" />
                )
              }
              css={{
                width: '44px',
                height: '44px',
                cursor: 'pointer',
                position: 'absolute',
                bottom: '80px',
                right: '85px',
                zIndex: '90',
                '&:hover': {
                  opacity: '0.8',
                },
                '@lgMin': { bottom: '200px' },
              }}
              aria-label="Toggle Mute"
              onPress={isMutedTrailer ? unMute : mute}
            />
          </motion.div>
        )}
      </Card>
    </AspectRatio.Root>
  );
};

export default BannerItemDesktop;
