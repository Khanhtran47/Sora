/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import { Button, Card, Col, Row, Spacer, Text, Loading } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Image, { MimeType } from 'remix-image';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube'; // { YouTubeProps }
import { ClientOnly } from 'remix-utils';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';

type BannerItemProps = {
  item: IMedia;
  handler?: (id: number, type: 'movie' | 'tv') => void;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  showTrailer?: boolean;
  setShowTrailer?: React.Dispatch<React.SetStateAction<boolean>>;
  trailer?: Trailer;
};

const BannerItem = ({
  item,
  handler,
  genresMovie,
  genresTv,
  showTrailer,
  setShowTrailer,
  trailer,
}: BannerItemProps) => {
  const { t } = useTranslation();
  const { backdropPath, overview, posterPath, title, id, mediaType } = item;
  // const [player, setPlayer] = React.useState<ReturnType<YouTube['getInternalPlayer']>>();
  const { colorDarkenLighten } = useColorDarkenLighten(posterPath);
  const isSm = useMediaQuery(650, 'max');
  const isMd = useMediaQuery(960, 'max');

  return (
    <Card variant="flat" css={{ w: '100%', h: '672px', borderWidth: 0 }} role="figure">
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
              {overview && overview.length > 400 ? `${overview?.substring(0, 400)}...` : overview}
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
              <Spacer y={1} />
              <Button
                auto
                shadow
                rounded
                bordered
                onClick={() => handler && handler(Number(id), mediaType)}
                css={{
                  marginTop: '1.25rem',
                }}
              >
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
                  {t('watchTrailer')}
                </Text>
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
                css={{
                  width: '100%',
                  minHeight: '672px !important',
                  height: 'auto',
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
            if (trailer?.key)
              return (
                <YouTube
                  videoId={trailer.key}
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
                    },
                  }}
                  onReady={({ target }) => {
                    // setPlayer(target);
                    target.mute();
                  }}
                  onPlay={() => {
                    if (setShowTrailer) {
                      setShowTrailer(true);
                    }
                  }}
                  onPause={() => {
                    if (setShowTrailer) {
                      setShowTrailer(false);
                    }
                  }}
                  onEnd={() => {
                    if (setShowTrailer) {
                      setShowTrailer(false);
                    }
                  }}
                  onError={() => {
                    if (setShowTrailer) {
                      setShowTrailer(false);
                    }
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
                      ? 'relative !w-full overflow-hidden aspect-w-16 aspect-h-9 !h-[300%] !-top-[100%] opacity-30'
                      : 'hidden'
                  }
                  loading="eager"
                />
              );
          }}
        </ClientOnly>
      </Card.Body>
    </Card>
  );
};

export default BannerItem;
