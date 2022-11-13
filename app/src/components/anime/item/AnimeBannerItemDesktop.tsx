/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Button, Card, Col, Row, Spacer, Loading, Text } from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Image, { MimeType } from 'remix-image';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { ClientOnly } from 'remix-utils';
import { useInView } from 'react-intersection-observer';

import useLocalStorage from '~/hooks/useLocalStorage';
import useMediaQuery from '~/hooks/useMediaQuery';
import useSize from '~/hooks/useSize';
import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';

import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import { H5, H6 } from '~/src/components/styles/Text.styles';

import VolumeUp from '~/src/assets/icons/VolumeUpIcon.js';
import VolumeOff from '~/src/assets/icons/VolumeOffIcon.js';
import AnilistStatIcon from '~/src/assets/icons/AnilistStatIcon.js';

const variants = {
  inView: { opacity: 1, x: 0 },
  outView: { opacity: 0, x: 40 },
  showTrailer: { opacity: 1, scale: 0.75 },
};

const AnimeBannerItemDesktop = ({ item, active }: { item: IAnimeResult; active?: boolean }) => {
  const { t } = useTranslation();
  const { id, cover, description, image, title, trailer, rating, genres } = item;
  const navigate = useNavigate();
  const [player, setPlayer] = useState<ReturnType<YouTube['getInternalPlayer']>>();
  const [isPlayed, setIsPlayed] = useState<boolean>(false);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  const isSm = useMediaQuery('(max-width: 650px)');
  const isMd = useMediaQuery('(max-width: 960px)');
  const isLg = useMediaQuery('(max-width: 1280px)');
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const bannerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useSize(bannerRef);

  const [isMuted, setIsMuted] = useLocalStorage('muteTrailer', true);
  const [isPlayTrailer] = useLocalStorage('playTrailer', false);
  const [isCardPlaying] = useLocalStorage('cardPlaying', false);

  const mute = useCallback(() => {
    if (!player) return;

    player.mute();

    setIsMuted(true);
  }, [player]);

  const unMute = useCallback(() => {
    if (!player) return;

    player.unMute();

    setIsMuted(false);
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
    if (inView && !isPlayed && isPlayTrailer) {
      play();
    } else if (!inView && isPlayed) {
      pause();
    }
  };

  const handleVisibility = () => {
    if (!document.hidden && inView && !isPlayed && isPlayTrailer) {
      play();
    } else if (document.hidden && isPlayed) {
      pause();
    }
  };

  const pauseVideoOnCardPlaying = () => {
    if (player) {
      if (isCardPlaying && isPlayed) {
        pause();
      } else if (!isCardPlaying && !isPlayed) {
        play();
      }
    }
  };

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
        <Card.Header css={{ position: 'absolute', zIndex: 1, h: height }}>
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
                {title?.userPreferred || title?.english || title?.romaji || title?.native}
              </Text>
              <AnimatePresence>
                {!showTrailer ? (
                  <Row
                    // @ts-ignore
                    as={motion.div}
                    css={{ marginTop: '1.25rem' }}
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
                    {rating && (
                      <>
                        {Number(rating) > 75 ? (
                          <AnilistStatIcon stat="good" />
                        ) : Number(rating) > 60 ? (
                          <AnilistStatIcon stat="average" />
                        ) : (
                          <AnilistStatIcon stat="bad" />
                        )}
                        <Spacer x={0.25} />
                        <H5 weight="bold">{rating}%</H5>
                        <Spacer x={1.5} />
                      </>
                    )}
                    <H5 h5 weight="bold" css={{ display: 'flex', flexDirection: 'row' }}>
                      {genres?.slice(0, 2).map((genre) => (
                        <>
                          {genre}
                          <Spacer x={0.5} />
                        </>
                      ))}
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
                    dangerouslySetInnerHTML={{ __html: description || '' }}
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
                  auto
                  shadow
                  css={{
                    marginTop: '1.25rem',
                  }}
                  onClick={() =>
                    navigate(`/anime/${id}/overview`, {
                      state: { currentTime: player ? player.playerInfo.currentTime : 0 },
                    })
                  }
                >
                  <H6 h6 weight="bold" transform="uppercase">
                    {t('watchNow')}
                  </H6>
                </Button>
              </Row>
            </Col>
            {!isLg && (
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
                  src={image || ''}
                  alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  title={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  objectFit="cover"
                  width="100%"
                  containerCss={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  css={{
                    minWidth: 'auto !important',
                    minHeight: 'auto !important',
                    maxWidth: '270px',
                    maxHeight: '390px',
                    borderRadius: '24px',
                    '@lg': {
                      maxWidth: '318px',
                      maxHeight: '477px',
                    },
                  }}
                  loading="eager"
                  loaderUrl="/api/image"
                  placeholder="blur"
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
            )}
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
            },
          }}
        >
          <AnimatePresence>
            {!showTrailer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={cover || ''}
                  loading="eager"
                  width="100%"
                  height="auto"
                  css={{
                    top: 0,
                    left: 0,
                    objectFit: 'cover',
                    opacity: 0.3,
                  }}
                  alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  title={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  loaderUrl="/api/image"
                  placeholder="blur"
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
            )}
          </AnimatePresence>
          <ClientOnly fallback={<Loading type="default" />}>
            {() => {
              if (trailer?.id && trailer?.site === 'youtube' && isPlayTrailer && !isSm)
                return (
                  <Suspense fallback={<Loading type="default" />}>
                    <YouTube
                      videoId={active ? trailer?.id : ''}
                      opts={{
                        height: '100%',
                        width: '100%',
                        playerVars: {
                          // https://developers.google.com/youtube/player_parameters
                          autoplay: 1,
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
                          origin: 'https://localhost:3000',
                        },
                      }}
                      onReady={({ target }) => {
                        setPlayer(target);
                        if (!isMuted) target.unMute();
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
                  </Suspense>
                );
            }}
          </ClientOnly>
        </Card.Body>
        {!isSm && showTrailer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button
              auto
              color="primary"
              rounded
              ghost
              icon={isMuted ? <VolumeOff fill="currentColor" /> : <VolumeUp fill="currentColor" />}
              css={{
                width: '42px',
                height: '42px',
                cursor: 'pointer',
                position: 'absolute',
                bottom: '80px',
                right: '85px',
                zIndex: '90',
                '&:hover': {
                  opacity: '0.8',
                },
              }}
              aria-label="Toggle Mute"
              onClick={isMuted ? unMute : mute}
            />
          </motion.div>
        )}
      </Card>
    </AspectRatio.Root>
  );
};

export default AnimeBannerItemDesktop;
