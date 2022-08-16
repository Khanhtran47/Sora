/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from '@remix-run/react';
import {
  Link as NextLink,
  Card,
  Col,
  Text,
  Row,
  Button,
  Spacer,
  useTheme,
} from '@nextui-org/react';

import { useTranslation } from 'react-i18next';

import { IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';

interface IMediaDetail {
  type: 'movie' | 'tv';
  item: IMovieDetail | ITvShowDetail | undefined;
}

const detailTab = [
  { pageName: 'Overview', pageLink: '' },
  { pageName: 'Cast', pageLink: '/cast' },
  { pageName: 'Crew', pageLink: '/crew' },
  { pageName: 'Videos', pageLink: '/videos' },
  { pageName: 'Photos', pageLink: '/photos' },
  { pageName: 'Similar', pageLink: '/similar' },
];

const MediaDetail = (props: IMediaDetail) => {
  const { t } = useTranslation();
  const { type, item } = props;
  const { theme } = useTheme();
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref?.current && setHeight(ref.current.clientHeight);
  }, [ref?.current?.clientHeight]);
  const isXs = useMediaQuery(425, 'max');
  const isSm = useMediaQuery(650, 'max');
  const isMd = useMediaQuery(960, 'max');
  // TODO: style mobile in landscape mode
  // const isMdLand = useMediaQuery(960, 'max', 'landscape');

  const { id, tagline, genres, status } = item || {};
  const title = (item as IMovieDetail)?.title || (item as ITvShowDetail)?.name || '';
  const runtime =
    Number((item as IMovieDetail)?.runtime) || Number((item as ITvShowDetail)?.episode_run_time);
  const posterPath = TMDB?.posterUrl(item?.poster_path || '', 'w500');
  const backdropPath = TMDB?.backdropUrl(item?.backdrop_path || '', 'original');
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
        height: `${height}px`,
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
                src={posterPath}
                alt={title}
                objectFit="cover"
                width="50%"
                css={{
                  marginTop: '10vh',
                  borderRadius: '24px',
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
                        to={`/${type === 'movie' ? 'movies' : 'tv-shows'}/watch/${id}`}
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
            {status === 'Released' && isSm && (
              <>
                <Row>
                  <Card.Image
                    src={posterPath}
                    alt={title}
                    objectFit="cover"
                    width={isXs ? '70%' : '40%'}
                    css={{
                      marginTop: '2rem',
                      borderRadius: '24px',
                    }}
                  />
                </Row>
                <Row>
                  <Button
                    auto
                    shadow
                    rounded
                    color="gradient"
                    size="xs"
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
                      to={`/${type === 'movie' ? 'movies' : 'tv-shows'}/watch/${id}`}
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
                        Watch now
                      </Text>
                    </Link>
                  </Button>
                </Row>
              </>
            )}
            <Row>
              <Text
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
                  size={12}
                  i
                  css={{
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
                  {t('userScore')}
                </Text>
              </Row>
            )}
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
                      size={isSm ? 'xs' : 'md'}
                      css={{ marginBottom: '0.125rem' }}
                    >
                      {genre?.name}
                    </Button>
                    <Spacer x={1} />
                  </>
                ))}
            </Row>
            <Row
              fluid
              className="border-b"
              align="center"
              justify="flex-start"
              css={{
                p: 0,
                gap: '$lg',
                overflowX: 'auto',
                flexFlow: 'row nowrap',
                width: `${isMd ? '100%' : '70%'}`,
                margin: 'auto 0 0 0',
                borderColor: `${theme?.colors.primaryLightActive.value}`,
              }}
            >
              {/* TODO: create tab component for reusing in other places */}
              {detailTab?.map((page, index) => (
                <Col
                  key={`row-item-${index}`}
                  css={{
                    dflex: 'center',
                  }}
                >
                  <NavLink
                    to={`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}${page.pageLink}`}
                    end
                    className={({ isActive }) => `${isActive ? 'border-b-2 border-solid' : ''}`}
                    style={({ isActive }) =>
                      isActive ? { borderColor: `${theme?.colors.primary.value}` } : {}
                    }
                  >
                    {({ isActive }) => (
                      <Text
                        h1
                        size={20}
                        css={{
                          textTransform: 'uppercase',
                        }}
                      >
                        <NextLink
                          block
                          color="primary"
                          css={{
                            height: '45px',
                            borderRadius: '14px 14px 0 0',
                            alignItems: 'center',
                            ...(isActive && {
                              background: `${theme?.colors.primaryLightActive.value}`,
                            }),
                          }}
                        >
                          {page.pageName}
                        </NextLink>
                      </Text>
                    )}
                  </NavLink>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src={backdropPath}
          css={{
            minHeight: '100vh',
            minWidth: '100vw',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            objectFit: 'cover',
            opacity: 0.3,
          }}
          alt="Card example background"
        />
      </Card.Body>
    </Card>
  );
};

export default MediaDetail;
