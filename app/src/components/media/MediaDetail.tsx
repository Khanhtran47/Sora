/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useRef } from 'react';
import { Link } from '@remix-run/react';
import { Card, Col, Text, Row, Button, Spacer } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

// import { useTranslation } from 'react-i18next';

import { IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';
import useSize, { IUseSize } from '~/hooks/useSize';
import Tab from '~/src/components/elements/Tab';

interface IMediaDetail {
  type: 'movie' | 'tv';
  item: IMovieDetail | ITvShowDetail | undefined;
  handler?: (id: number) => void;
}

const detailTab = [
  { pageName: 'Overview', pageLink: '/' },
  { pageName: 'Cast', pageLink: '/cast' },
  { pageName: 'Crew', pageLink: '/crew' },
  { pageName: 'Videos', pageLink: '/videos' },
  { pageName: 'Photos', pageLink: '/photos' },
  { pageName: 'Recommendations', pageLink: '/recommendations' },
  { pageName: 'Similar', pageLink: '/similar' },
];

const MediaDetail = (props: IMediaDetail) => {
  // const { t } = useTranslation();
  const { type, item, handler } = props;
  const ref = useRef<HTMLDivElement>(null);
  const size: IUseSize = useSize(ref);

  const isXs = useMediaQuery(425, 'max');
  const isSm = useMediaQuery(650, 'max');
  const isMd = useMediaQuery(960, 'max');
  // TODO: style mobile in landscape mode
  // const isMdLand = useMediaQuery(960, 'max', 'landscape');

  const { id, tagline, genres, status } = item || {};
  const title = (item as IMovieDetail)?.title || (item as ITvShowDetail)?.name || '';
  const runtime =
    Number((item as IMovieDetail)?.runtime) || Number((item as ITvShowDetail)?.episode_run_time);
  const posterPath = TMDB?.posterUrl(item?.poster_path || '', 'w342');
  const backdropPath = TMDB?.backdropUrl(item?.backdrop_path || '', 'w780');
  const releaseYear = new Date(
    (item as IMovieDetail)?.release_date || (item as ITvShowDetail)?.first_air_date || '',
  ).getFullYear();
  const releaseDate = new Date(
    (item as IMovieDetail)?.release_date || (item as ITvShowDetail)?.first_air_date || '',
  ).toLocaleDateString('fr-FR');

  // TODO: get and show IMDB score

  return (
    <Card
      variant="flat"
      css={{
        display: 'flex',
        flexFlow: 'column',
        width: '100vw',
        height: `calc(${JSON.stringify(size?.height)}px + 1rem)`,
        borderWidth: 0,
      }}
    >
      <Card.Header ref={ref} css={{ position: 'absolute', zIndex: 1, flexGrow: 1 }}>
        <Row
          fluid
          align="stretch"
          justify="center"
          css={{
            padding: 0,
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
          {!isSm && (
            <Col span={4}>
              <Card.Image
                // @ts-ignore
                as={Image}
                src={posterPath}
                alt={title}
                objectFit="cover"
                width="50%"
                css={{
                  minWidth: 'auto !important',
                  marginTop: '10vh',
                  borderRadius: '24px',
                }}
                showSkeleton
                loaderUrl="/api/image"
                placeholder="blur"
                responsive={[
                  {
                    size: {
                      width: 137,
                      height: 205,
                    },
                    maxWidth: 960,
                  },
                  {
                    size: {
                      width: 158,
                      height: 237,
                    },
                    maxWidth: 1280,
                  },
                  {
                    size: {
                      width: 173,
                      height: 260,
                    },
                    maxWidth: 1400,
                  },
                  {
                    size: {
                      width: 239,
                      height: 359,
                    },
                  },
                ]}
                options={{
                  contentType: MimeType.WEBP,
                }}
              />
              {(status === 'Released' || status === 'Ended' || status === 'Returning Series') &&
                !isSm && (
                  <Row align="center" justify="center">
                    <Button
                      auto
                      shadow
                      rounded
                      color="gradient"
                      css={{
                        width: '50%',
                        margin: '0.5rem 0 0.5rem 0',
                        '@xs': {
                          marginTop: '4vh',
                        },
                        '@sm': {
                          marginTop: '2vh',
                        },
                      }}
                    >
                      <Link
                        prefetch="intent"
                        to={`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}/watch`}
                      >
                        <Text
                          h4
                          size={12}
                          weight="bold"
                          transform="uppercase"
                          css={{
                            margin: 0,
                            '@xs': {
                              fontSize: '18px',
                            },
                            '@sm': {
                              fontSize: '20px',
                            },
                          }}
                        >
                          Watch now
                        </Text>
                      </Link>
                    </Button>
                  </Row>
                )}
            </Col>
          )}
          <Col
            span={isSm ? 12 : 8}
            css={{
              marginTop: `${isMd ? '8vh' : '10vh'}`,
              display: 'flex',
              flexFlow: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {(status === 'Released' || status === 'Ended' || status === 'Returning Series') &&
              isSm && (
                <>
                  <Row>
                    <Card.Image
                      // @ts-ignore
                      as={Image}
                      src={posterPath}
                      alt={title}
                      objectFit="cover"
                      width={isXs ? '70%' : '40%'}
                      css={{
                        minWidth: 'auto !important',
                        marginTop: '2rem',
                        borderRadius: '24px',
                      }}
                      showSkeleton
                      loaderUrl="/api/image"
                      placeholder="blur"
                      options={{
                        contentType: MimeType.WEBP,
                      }}
                      responsive={[
                        {
                          size: {
                            width: 246,
                            height: 369,
                          },
                          maxWidth: 375,
                        },
                        {
                          size: {
                            width: 235,
                            height: 352,
                          },
                        },
                      ]}
                    />
                  </Row>
                  <Row>
                    <Button
                      auto
                      shadow
                      rounded
                      color="gradient"
                      size="sm"
                      css={{
                        width: '100%',
                        margin: '0.5rem 0 0.5rem 0',
                        '@xs': {
                          marginTop: '4vh',
                        },
                        '@sm': {
                          marginTop: '2vh',
                        },
                      }}
                    >
                      <Link
                        prefetch="intent"
                        to={`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}/watch`}
                      >
                        <Text
                          h4
                          size={12}
                          weight="bold"
                          transform="uppercase"
                          css={{
                            margin: 0,
                            '@xs': {
                              fontSize: '18px',
                            },
                            '@sm': {
                              fontSize: '20px',
                            },
                          }}
                        >
                          Watch now
                        </Text>
                      </Link>
                    </Button>
                  </Row>
                </>
              )}
            <Row>
              <Text
                h1
                size={18}
                weight="bold"
                transform="uppercase"
                css={{
                  margin: 0,
                  '@xs': {
                    fontSize: '24px',
                  },
                  '@sm': {
                    fontSize: '30px',
                  },
                  '@md': {
                    fontSize: '36px',
                  },
                }}
              >
                {`${title} (${releaseYear})`}
              </Text>
            </Row>
            <Row>
              <Text
                h3
                size={12}
                css={{
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
                {releaseDate} • {item?.vote_average} •{' '}
                {runtime && `${Math.floor(runtime / 60)}h ${runtime % 60}m`}
              </Text>
            </Row>
            {tagline && (
              <Row>
                <Text
                  h3
                  size={12}
                  css={{
                    fontStyle: 'italic',
                    margin: '10px 0 0 0',
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
                  {tagline}
                </Text>
              </Row>
            )}
            <Spacer y={1} />
            <Row>
              <Button
                auto
                shadow
                rounded
                size={isSm ? 'sm' : 'md'}
                onClick={() => handler && handler(Number(id))}
              >
                <Text
                  h3
                  transform="uppercase"
                  size={12}
                  css={{
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
                  Watch Trailer
                </Text>
              </Button>
            </Row>
            <Row
              fluid
              align="center"
              wrap="wrap"
              justify="flex-start"
              css={{
                width: `${isMd ? '100%' : '60%'}`,
                margin: '1.25rem 0 1.25rem 0',
              }}
            >
              {genres &&
                genres?.map((genre) => (
                  <>
                    <Button
                      color="primary"
                      auto
                      ghost
                      rounded
                      shadow
                      key={genre?.id}
                      size={isSm ? 'sm' : 'md'}
                      css={{ marginBottom: '0.125rem' }}
                    >
                      {genre?.name}
                    </Button>
                    <Spacer x={1} />
                  </>
                ))}
            </Row>
            <Tab pages={detailTab} linkTo={`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}`} />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          // @ts-ignore
          as={Image}
          src={backdropPath}
          css={{
            minHeight: '100vh !important',
            minWidth: '100vw !important',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            objectFit: 'cover',
            opacity: 0.3,
          }}
          title={title}
          alt={title}
          showSkeleton
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
      </Card.Body>
    </Card>
  );
};

export default MediaDetail;
