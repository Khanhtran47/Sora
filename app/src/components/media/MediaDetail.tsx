/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@remix-run/react';
import { Card, Col, Row, Button, Spacer, Avatar } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

// import { useTranslation } from 'react-i18next';

import { IMovieDetail, ITvShowDetail, IMovieTranslations } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';
import useSize, { IUseSize } from '~/hooks/useSize';

import TabLink from '~/src/components/elements/tab/TabLink';
import Flex from '~/src/components/styles/Flex.styles';
import { H2, H5 } from '~/src/components/styles/Text.styles';
import SelectProviderModal from '~/src/components/elements/modal/SelectProviderModal';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';
import BackgroundDefault from '~/src/assets/images/background-default.jpg';

interface IMediaDetail {
  type: 'movie' | 'tv';
  item: IMovieDetail | ITvShowDetail | undefined;
  handler?: (id: number) => void;
  translations?: IMovieTranslations | undefined;
  imdbRating: { count: number; star: number } | undefined;
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
  const { type, item, handler, translations, imdbRating } = props;
  const ref = useRef<HTMLDivElement>(null);
  const size: IUseSize = useSize(ref);
  const navigate = useNavigate();
  const location = useLocation();

  const isXs = useMediaQuery('(max-width: 425px)');
  const isSm = useMediaQuery('(max-width: 650px)');
  const isMd = useMediaQuery('(max-width: 960px)');
  const isLg = useMediaQuery('(max-width: 1280px)');

  const backgroundImageHeight = isXs ? 240 : isSm ? 360 : isMd ? 480 : isLg ? 720 : 787.5;
  const backgroundGradientHeight = isXs ? 100 : isSm ? 150 : isMd ? 200 : isLg ? 250 : 300;

  const [visible, setVisible] = useState(false);
  const closeHandler = () => {
    setVisible(false);
  };

  const { id, tagline, genres, status } = item || {};
  const title = (item as IMovieDetail)?.title || (item as ITvShowDetail)?.name || '';
  const orgTitle =
    (item as IMovieDetail)?.original_title || (item as ITvShowDetail)?.original_name || '';
  const runtime =
    // @ts-ignore
    Number((item as IMovieDetail)?.runtime) || Number((item as ITvShowDetail)?.episode_run_time[0]);
  const posterPath = item?.poster_path
    ? TMDB?.posterUrl(item?.poster_path || '', 'w342')
    : undefined;
  const backdropPath = item?.backdrop_path
    ? TMDB?.backdropUrl(item?.backdrop_path || '', 'w1280')
    : undefined;
  const releaseYear = new Date(
    (item as IMovieDetail)?.release_date || (item as ITvShowDetail)?.first_air_date || '',
  ).getFullYear();
  const releaseDate = new Date(
    (item as IMovieDetail)?.release_date || (item as ITvShowDetail)?.first_air_date || '',
  ).toLocaleDateString('fr-FR');

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [ref, location.pathname]);

  return (
    <>
      <Card
        variant="flat"
        css={{
          display: 'flex',
          flexFlow: 'column',
          width: '100%',
          height: `calc(${JSON.stringify(size?.height)}px + ${backgroundImageHeight}px - 10rem)`,
          borderWidth: 0,
          backgroundColor: '$background',
        }}
      >
        <Card.Body
          css={{
            p: 0,
            overflow: 'hidden',
            margin: 0,
            '&::after': {
              content: '',
              position: 'absolute',
              top: `calc(${backgroundImageHeight}px - ${backgroundGradientHeight}px)`,
              left: 0,
              width: '100%',
              height: `${backgroundGradientHeight}px`,
              backgroundImage: 'linear-gradient(to top, $background, $backgroundTransparent)',
            },
          }}
        >
          <Card.Image
            // @ts-ignore
            as={Image}
            src={backdropPath || BackgroundDefault}
            css={{
              minHeight: `${backgroundImageHeight}px !important`,
              minWidth: '100% !important',
              width: '100%',
              height: `${backgroundImageHeight}px !important`,
              top: 0,
              left: 0,
              objectFit: 'cover',
              opacity: 0.8,
            }}
            title={title}
            alt={title}
            showSkeleton
            containerCss={{ margin: 0 }}
            loaderUrl="/api/image"
            placeholder="empty"
            responsive={[
              {
                size: {
                  width: 426,
                  height: 240,
                },
                maxWidth: 375,
              },
              {
                size: {
                  width: 640,
                  height: 360,
                },
                maxWidth: 650,
              },
              {
                size: {
                  width: 854,
                  height: 480,
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
                  height: 787.5,
                },
              },
            ]}
            options={{
              contentType: MimeType.WEBP,
            }}
          />
        </Card.Body>
        <Card.Footer
          ref={ref}
          css={{
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          <Row
            fluid
            align="stretch"
            justify="center"
            css={{
              px: '0.75rem',
              '@xs': {
                px: '3vw',
              },
              '@sm': {
                px: '6vw',
              },
              '@md': {
                px: '12vw',
              },
              '@lg': {
                px: '20px',
              },
              maxWidth: '1920px',
            }}
          >
            {!isSm && (
              <Col span={4}>
                {posterPath ? (
                  <Card.Image
                    // @ts-ignore
                    as={Image}
                    src={posterPath}
                    alt={title}
                    objectFit="cover"
                    width={isLg ? '75%' : isMd ? '100%' : '50%'}
                    css={{
                      minWidth: 'auto !important',
                      minHeight: '205px !important',
                      borderRadius: '24px',
                    }}
                    showSkeleton
                    loaderUrl="/api/image"
                    placeholder="empty"
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
                ) : (
                  <Row align="center" justify="center">
                    <Avatar
                      icon={<PhotoIcon width={48} height={48} />}
                      css={{
                        width: `${isLg ? '75%' : isMd ? '100%' : '50%'} !important`,
                        size: '$20',
                        minWidth: 'auto !important',
                        minHeight: '205px !important',
                        borderRadius: '24px !important',
                      }}
                    />
                  </Row>
                )}
                {(status === 'Released' || status === 'Ended' || status === 'Returning Series') &&
                  !isSm && (
                    <Row align="center" justify="center">
                      <Button
                        auto
                        // shadow
                        rounded
                        color="gradient"
                        css={{
                          width: `${isLg ? '75%' : isMd ? '100%' : '50%'}`,
                          margin: '0.5rem 0 0.5rem 0',
                          '@xs': {
                            marginTop: '4vh',
                          },
                          '@sm': {
                            marginTop: '2vh',
                          },
                        }}
                        onClick={() => setVisible(true)}
                      >
                        <H5 h5 weight="bold" transform="uppercase">
                          Watch now
                        </H5>
                      </Button>
                    </Row>
                  )}
              </Col>
            )}
            <Col
              span={isSm ? 12 : 8}
              css={{
                display: 'flex',
                flexFlow: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {(status === 'Released' || status === 'Ended' || status === 'Returning Series') &&
                isSm && (
                  <>
                    {posterPath ? (
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
                              minHeight: '205px !important',
                            }}
                            showSkeleton
                            loaderUrl="/api/image"
                            placeholder="empty"
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
                        <Spacer y={1} />
                      </>
                    ) : (
                      <>
                        <Row align="center" justify="center">
                          <Avatar
                            icon={<PhotoIcon width={48} height={48} />}
                            css={{
                              width: `${isXs ? '70%' : '40%'} !important`,
                              size: '$20',
                              minWidth: 'auto !important',
                              minHeight: '205px !important',
                              marginTop: '2rem',
                              borderRadius: '24px !important',
                            }}
                          />
                        </Row>
                        <Spacer y={1} />
                      </>
                    )}
                    <Row>
                      <Button
                        auto
                        // shadow
                        rounded
                        color="gradient"
                        size="sm"
                        css={{
                          width: '100%',
                          minHeight: '36px',
                          margin: '0.5rem 0 0.5rem 0',
                          '@xs': {
                            marginTop: '4vh',
                          },
                          '@sm': {
                            marginTop: '2vh',
                          },
                        }}
                        onClick={() => setVisible(true)}
                      >
                        <H5 h5 weight="bold" transform="uppercase">
                          Watch now
                        </H5>
                      </Button>
                    </Row>
                  </>
                )}
              <Row>
                <H2 h2 weight="bold">
                  {`${title} (${releaseYear})`}
                </H2>
              </Row>
              <Row>
                <H5 h5>
                  {releaseDate}
                  {runtime ? ` • ${Math.floor(runtime / 60)}h ${runtime % 60}m` : null}
                </H5>
              </Row>
              {tagline && (
                <Row>
                  <H5 h5 css={{ fontStyle: 'italic', marginTop: '10px' }}>
                    {tagline}
                  </H5>
                </Row>
              )}
              <Spacer y={0.5} />
              <Flex direction="row">
                <H5
                  h5
                  css={{
                    backgroundColor: '#3ec2c2',
                    borderRadius: '$xs',
                    padding: '0 0.25rem 0 0.25rem',
                    marginRight: '0.5rem',
                  }}
                >
                  TMDb
                </H5>
                <H5 h5>{item?.vote_average?.toFixed(1)}</H5>
                {imdbRating && (
                  <>
                    <Spacer x={1.25} />
                    <H5
                      h5
                      css={{
                        backgroundColor: '#ddb600',
                        color: '#000',
                        borderRadius: '$xs',
                        padding: '0 0.25rem 0 0.25rem',
                        marginRight: '0.5rem',
                      }}
                    >
                      IMDb
                    </H5>
                    <H5 h5>{imdbRating?.star}</H5>
                  </>
                )}
              </Flex>
              <Spacer y={1} />
              <Row>
                <Button
                  auto
                  // shadow
                  size={isSm ? 'sm' : 'md'}
                  onClick={() => handler && handler(Number(id))}
                >
                  <H5 h5 transform="uppercase">
                    Watch Trailer
                  </H5>
                </Button>
              </Row>
              <Row
                fluid
                align="center"
                wrap="wrap"
                justify="flex-start"
                css={{
                  width: '100%',
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
                        // shadow
                        key={genre?.id}
                        size={isSm ? 'sm' : 'md'}
                        css={{ marginBottom: '0.125rem' }}
                        onClick={() =>
                          navigate(
                            `/${type === 'movie' ? 'movies/' : 'tv-shows/'}discover?with_genres=${
                              genre?.id
                            }`,
                          )
                        }
                      >
                        {genre?.name}
                      </Button>
                      <Spacer x={1} />
                    </>
                  ))}
              </Row>
              <TabLink
                pages={detailTab}
                linkTo={`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}`}
              />
            </Col>
          </Row>
        </Card.Footer>
      </Card>
      <SelectProviderModal
        visible={visible}
        closeHandler={closeHandler}
        type={type}
        title={title}
        origTitle={orgTitle}
        year={releaseYear}
        translations={translations}
        id={item?.id}
        {...(type === 'tv' && { season: 1, episode: 1 })}
      />
    </>
  );
};

export default MediaDetail;
