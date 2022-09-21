/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Card, Col, Row, Spacer, Text } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Image, { MimeType } from 'remix-image';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube, { YouTubeProps } from 'react-youtube';

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
  trailer?: Trailer;
};

const BannerItem = ({
  item,
  handler,
  genresMovie,
  genresTv,
  showTrailer,
  trailer,
}: BannerItemProps) => {
  const { t } = useTranslation();
  const { backdropPath, overview, posterPath, title, id, mediaType } = item;
  const { colorDarkenLighten } = useColorDarkenLighten(posterPath);
  const isSm = useMediaQuery(650, 'max');
  const isMd = useMediaQuery(960, 'max');
  // const onPlayerReady: YouTubeProps['onReady'] = (event) => {
  //   // access to player in all event handlers via event.target
  //   event.target.playVideo();
  // };
  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      modestbranding: 1,
      controls: 0,
      mute: 0,
      disablekb: 1,
    },
  };

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
          {!showTrailer ? (
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
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              {trailer && trailer.key && (
                <YouTube
                  videoId={trailer.key}
                  opts={opts}
                  // onReady={onPlayerReady}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card.Body>
    </Card>
  );
};

export default BannerItem;
