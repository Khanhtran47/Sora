/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useRef, useState, memo } from 'react';
import { useNavigate } from '@remix-run/react';
import { Card, Col, Row, Button, Spacer, Avatar } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

// import { useTranslation } from 'react-i18next';

import { IMovieDetail, ITvShowDetail, IMovieTranslations } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';
import useSize, { IUseSize } from '~/hooks/useSize';

import Tab from '~/src/components/elements/Tab';
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

  const isXs = useMediaQuery('(max-width: 425px)');
  const isSm = useMediaQuery('(max-width: 650px)');

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

  return (
    <>
      <Card
        variant="flat"
        css={{
          display: 'flex',
          flexFlow: 'column',
          width: '100%',
          height: `calc(${JSON.stringify(size?.height)}px + 1rem)`,
          borderWidth: 0,
        }}
      >
        <Card.Header
          ref={ref}
          css={{
            position: 'absolute',
            zIndex: 1,
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
              padding: '20px',
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
                    width="50%"
                    css={{
                      minWidth: 'auto !important',
                      minHeight: '205px !important',
                      borderRadius: '24px',
                    }}
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
                ) : (
                  <Row align="center" justify="center">
                    <Avatar
                      icon={<PhotoIcon width={48} height={48} />}
                      css={{
                        width: '50% !important',
                        size: '$20',
                        minWidth: 'auto !important',
                        minHeight: '205px !important',
                        marginTop: '10vh',
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
                        shadow
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
              {tagline && (
                <Row>
                  <H5 h5 css={{ fontStyle: 'italic', marginTop: '10px' }}>
                    {tagline}
                  </H5>
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
                        rounded
                        shadow
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
              <Tab
                pages={detailTab}
                linkTo={`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}`}
              />
            </Col>
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
          <Card.Image
            // @ts-ignore
            as={Image}
            src={backdropPath || BackgroundDefault}
            css={{
              minHeight: '100vh !important',
              minWidth: '100% !important',
              width: '100%',
              height: `calc(${JSON.stringify(size?.height)}px + 1rem)`,
              top: 0,
              left: 0,
              objectFit: 'cover',
              opacity: 0.3,
            }}
            title={title}
            alt={title}
            containerCss={{ margin: 0 }}
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

export default memo(MediaDetail);
