/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { Button, Card, Col, Row, Spacer, Text, Loading } from '@nextui-org/react';
import { Link, useFetcher } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Image, { MimeType } from 'remix-image';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { ClientOnly } from 'remix-utils';
import { useInView } from 'react-intersection-observer';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import useLocalStorage from '~/hooks/useLocalStorage';
import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import VolumeUp from '~/src/assets/icons/VolumeUpIcon.js';
import VolumeOff from '~/src/assets/icons/VolumeOffIcon.js';

const BannerItemDesktop = ({
  item,
  genresMovie,
  genresTv,
  active,
}: {
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  active?: boolean;
}) => {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { backdropPath, overview, posterPath, title, id, mediaType } = item;
  const [player, setPlayer] = React.useState<ReturnType<YouTube['getInternalPlayer']>>();
  const [isPlayed, setIsPlayed] = React.useState<boolean>(false);
  const [showTrailer, setShowTrailer] = React.useState<boolean>(false);
  const [trailerBanner, setTrailerBanner] = React.useState<Trailer>({});
  const { colorDarkenLighten } = useColorDarkenLighten(posterPath);
  const isSm = useMediaQuery(650, 'max');
  const isMd = useMediaQuery(960, 'max');
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [isMuted, setIsMuted] = useLocalStorage('muteTrailer', true);
  const [isPlayTrailer] = useLocalStorage('playTrailer', false);
  const [isCardPlaying] = useLocalStorage('cardPlaying', false);

  React.useEffect(() => {
    if (active === true && isPlayTrailer === true) {
      fetcher.load(`/${item.mediaType === 'movie' ? 'movies' : 'tv-shows'}/${item.id}/videos`);
    } else {
      setTrailerBanner({});
    }
  }, [active, isPlayTrailer]);

  React.useEffect(() => {
    if (!isPlayTrailer === true) {
      setShowTrailer(false);
    }
  }, [isPlayTrailer]);

  React.useEffect(() => {
    if (active === true && fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailerBanner(officialTrailer);
    }
  }, [fetcher.data]);

  const mute = React.useCallback(() => {
    if (!player) return;

    player.mute();

    setIsMuted(true);
  }, [player]);

  const unMute = React.useCallback(() => {
    if (!player) return;

    player.unMute();

    setIsMuted(false);
  }, [player]);

  const play = React.useCallback(() => {
    if (!player) return;

    player.playVideo();

    setIsPlayed(true);
  }, [player]);

  const pause = React.useCallback(() => {
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

  React.useEffect(() => {
    const watchScroll = () => {
      window.addEventListener('scroll', pauseVideoOnOutOfView);
    };
    watchScroll();
    return () => {
      window.removeEventListener('scroll', pauseVideoOnOutOfView);
    };
  });

  const handleVisibility = () => {
    if (!document.hidden && inView && !isPlayed) {
      play();
    } else if (document.hidden && isPlayed) {
      pause();
    }
  };

  React.useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [handleVisibility]);

  const pauseVideoOnCardPlaying = () => {
    if (player) {
      if (isCardPlaying && isPlayed) {
        pause();
      } else if (!isCardPlaying && !isPlayed) {
        play();
      }
    }
  };

  React.useEffect(() => {
    pauseVideoOnCardPlaying();
  }, [isCardPlaying]);

  return (
    <Card ref={ref} variant="flat" css={{ w: '100%', h: '672px', borderWidth: 0 }} role="figure">
      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
        <Row>
          <Col
            css={{
              marginTop: '10vh',
              marginLeft: '5vw',
              marginRight: '5vw',
              '@sm': {
                marginLeft: '10vw',
              },
            }}
          >
            <Text
              size={28}
              weight="bold"
              className="!line-clamp-2"
              color={colorDarkenLighten || undefined}
              css={{
                transition: 'color 0.25s ease 0s',
                margin: 0,
                lineHeight: 'var(--nextui-lineHeights-base)',
                '@xs': {
                  fontSize: '38px',
                },
                '@sm': {
                  fontSize: '48px',
                },
                '@md': {
                  fontSize: '58px',
                },
              }}
            >
              {title}
            </Text>
            <Row css={{ marginTop: '1.25rem' }} align="center">
              <Text
                weight="bold"
                size="$xs"
                css={{
                  backgroundColor: '#3ec2c2',
                  borderRadius: '$xs',
                  padding: '0 0.25rem 0 0.25rem',
                  marginRight: '0.5rem',
                }}
              >
                TMDb
              </Text>
              <Text size="$sm" weight="bold">
                {item?.voteAverage?.toFixed(1)}
              </Text>
              <Spacer x={1.5} />
              <Text
                h3
                size={12}
                css={{
                  display: 'flex',
                  flexDirection: 'row',
                  margin: 0,
                  '@xs': {
                    fontSize: '14px',
                  },
                  '@sm': {
                    fontSize: '16px',
                  },
                  '@md': {
                    fontSize: '18px',
                  },
                }}
              >
                {item?.genreIds?.slice(0, 2).map((genreId) => {
                  if (mediaType === 'movie') {
                    return (
                      <>
                        {genresMovie?.[genreId]}
                        <Spacer x={0.5} />
                      </>
                    );
                  }
                  return (
                    <>
                      {genresTv?.[genreId]}
                      <Spacer x={0.5} />
                    </>
                  );
                })}
              </Text>
            </Row>
            <Text
              size={12}
              weight="bold"
              className="!line-clamp-5"
              css={{
                margin: '1.25rem 0 0 0',
                textAlign: 'justify',
                '@xs': {
                  fontSize: '16px',
                },
                '@sm': {
                  fontSize: '18px',
                },
              }}
            >
              {overview}
            </Text>
            <Row wrap="wrap">
              <Button
                auto
                shadow
                rounded
                css={{
                  marginTop: '1.25rem',
                }}
              >
                <Link to={`/${mediaType === 'movie' ? 'movies/' : 'tv-shows/'}${id}`}>
                  <Text
                    size={12}
                    weight="bold"
                    transform="uppercase"
                    css={{
                      '@xs': {
                        fontSize: '18px',
                      },
                      '@sm': {
                        fontSize: '20px',
                      },
                    }}
                  >
                    {t('watchNow')}
                  </Text>
                </Link>
              </Button>
            </Row>
          </Col>
          {!isSm && (
            <Col>
              <Card.Image
                // @ts-ignore
                as={Image}
                src={posterPath || ''}
                alt={title}
                title={title}
                objectFit="cover"
                width={isMd ? '60%' : '40%'}
                css={{
                  minWidth: 'auto !important',
                  marginTop: '10vh',
                  borderRadius: '24px',
                }}
                loading="eager"
                loaderUrl="/api/image"
                placeholder="blur"
                responsive={[
                  {
                    size: {
                      width: 225,
                      height: 338,
                    },
                    maxWidth: 860,
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
                src={backdropPath || ''}
                loading="eager"
                width="100%"
                height="auto"
                css={{
                  minHeight: '672px !important',
                  top: 0,
                  left: 0,
                  objectFit: 'cover',
                  opacity: 0.3,
                }}
                alt={title}
                title={title}
                loaderUrl="/api/image"
                placeholder="blur"
                responsive={[
                  {
                    size: {
                      width: 375,
                      height: 605,
                    },
                    maxWidth: 375,
                  },
                  {
                    size: {
                      width: 650,
                      height: 605,
                    },
                    maxWidth: 650,
                  },
                  {
                    size: {
                      width: 960,
                      height: 605,
                    },
                    maxWidth: 960,
                  },
                  {
                    size: {
                      width: 1280,
                      height: 720,
                    },
                    maxWidth: 1280,
                  },
                  {
                    size: {
                      width: 1400,
                      height: 787,
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
            if (trailerBanner?.key && !isSm && isPlayTrailer)
              return (
                <YouTube
                  videoId={active ? trailerBanner.key : ''}
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
                      ? 'relative !w-full overflow-hidden !h-[300%] !-top-[100%] opacity-30'
                      : 'hidden'
                  }
                />
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
            }}
            aria-label="Toggle Mute"
            onClick={isMuted ? unMute : mute}
          />
        </motion.div>
      )}
    </Card>
  );
};

export default BannerItemDesktop;
