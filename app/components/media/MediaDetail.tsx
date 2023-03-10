/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useFetcher } from '@remix-run/react';
import { Card, Col, Row, Button, Spacer, Avatar, Tooltip } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import tinycolor from 'tinycolor2';
// import { useTranslation } from 'react-i18next';

import { IMovieDetail, ITvShowDetail, IMovieTranslations } from '~/services/tmdb/tmdb.types';
import { ColorPalette } from '~/routes/api/color-palette';

import TMDB from '~/utils/media';
import { WebShareLink } from '~/utils/client/pwa-utils.client';

import { useMediaQuery, useMeasure } from '@react-hookz/web';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';

import TabLink from '~/components/elements/tab/TabLink';
import Flex from '~/components/styles/Flex.styles';
import { H2, H5, H6 } from '~/components/styles/Text.styles';
import SelectProviderModal from '~/components/elements/modal/SelectProviderModal';
import Rating from '~/components/elements/shared/Rating';

import PhotoIcon from '~/assets/icons/PhotoIcon';
import ShareIcon from '~/assets/icons/ShareIcon';
import BackgroundDefault from '~/assets/images/background-default.jpg';

import { BackgroundContent, BackgroundTabLink } from './Media.styles';

interface IMediaDetail {
  type: 'movie' | 'tv';
  item: IMovieDetail | ITvShowDetail | undefined;
  handler?: (id: number) => void;
  translations?: IMovieTranslations | undefined;
  imdbRating: { count: number; star: number } | undefined;
  color: string | undefined;
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
  const { type, item, handler, translations, imdbRating, color } = props;
  const [size, ref] = useMeasure<HTMLDivElement>();
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const { backgroundColor } = useColorDarkenLighten(color);
  const isXs = useMediaQuery('(max-width: 425px)', { initializeWithValue: false });
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const [visible, setVisible] = useState(false);
  const [colorPalette, setColorPalette] = useState<ColorPalette>();
  const closeHandler = () => {
    setVisible(false);
  };
  const { id, tagline, genres, status } = item || {};
  const title = (item as IMovieDetail)?.title || (item as ITvShowDetail)?.name || '';
  const orgTitle =
    (item as IMovieDetail)?.original_title || (item as ITvShowDetail)?.original_name || '';
  const runtime =
    // @ts-ignore
    Number((item as IMovieDetail)?.runtime) ?? Number((item as ITvShowDetail)?.episode_run_time[0]);
  const posterPath = item?.poster_path
    ? TMDB?.posterUrl(item?.poster_path || '', 'w342')
    : undefined;
  const backdropPath = item?.backdrop_path
    ? TMDB?.backdropUrl(item?.backdrop_path || '', 'w1280')
    : undefined;
  const releaseYear = new Date(
    (item as IMovieDetail)?.release_date ?? ((item as ITvShowDetail)?.first_air_date || ''),
  ).getFullYear();
  const releaseDate = new Date(
    (item as IMovieDetail)?.release_date ?? ((item as ITvShowDetail)?.first_air_date || ''),
  ).toLocaleDateString('fr-FR');
  const description = (item as IMovieDetail)?.overview || (item as ITvShowDetail)?.overview || '';

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    }
  }, [ref, location.pathname]);

  useEffect(() => {
    if (color?.startsWith('#')) {
      fetcher.load(`/api/color-palette?color=${color.replace('#', '')}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.color) {
      setColorPalette(fetcher.data.color);
    }
  }, [fetcher.data]);

  return (
    <>
      <Card
        variant="flat"
        css={{
          display: 'flex',
          flexFlow: 'column',
          width: '100%',
          borderWidth: 0,
          backgroundColor,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          minHeight: '1050px',
          height: isXs
            ? `calc(${JSON.stringify(size?.height)}px + 240px - 10rem)`
            : `calc(${JSON.stringify(size?.height)}px + 360px - 10rem)`,
          '@xs': {
            minHeight: '1075px',
            height: `calc(${JSON.stringify(size?.height)}px + 480px - 10rem)`,
          },
          '@sm': {
            minHeight: '1100px',
            height: `calc(${JSON.stringify(size?.height)}px + 720px - 10rem)`,
          },
          '@md': {
            minHeight: '1125px',
            height: `calc(${JSON.stringify(size?.height)}px + 787.5px - 10rem)`,
          },
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
              left: 0,
              width: '100%',
              backgroundImage: `linear-gradient(to top, ${backgroundColor}, ${tinycolor(
                backgroundColor,
              ).setAlpha(0)})`,
              top: isXs ? '140px' : '210px',
              height: isXs ? '100px' : '150px',
              '@xs': {
                top: '280px',
                height: '200px',
              },
              '@sm': {
                top: '470px',
                height: '250px',
              },
              '@md': {
                top: '487.5px',
                height: '300px',
              },
            },
          }}
        >
          <Card.Image
            // @ts-ignore
            as={Image}
            src={backdropPath || BackgroundDefault}
            css={{
              minWidth: '100% !important',
              width: '100%',
              top: 0,
              left: 0,
              objectFit: 'cover',
              opacity: 0.8,
              minHeight: isXs ? '240px !important' : '360px !important',
              height: isXs ? '240px !important' : '360px !important',
              '@xs': {
                minHeight: '480px !important',
                height: '480px !important',
              },
              '@sm': {
                minHeight: '720px !important',
                height: '720px !important',
              },
              '@md': {
                minHeight: '787.5px !important',
                height: '787.5px !important',
              },
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
            flexDirection: 'column',
            padding: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <BackgroundContent />
          <Row
            fluid
            align="stretch"
            justify="center"
            css={{
              px: '0.75rem',
              paddingTop: '1.25rem',
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
              <Col
                span={4}
                css={{
                  display: 'none',
                  '@xs': {
                    display: 'block',
                  },
                }}
              >
                {posterPath ? (
                  <Card.Image
                    // @ts-ignore
                    as={Image}
                    src={posterPath}
                    alt={title}
                    objectFit="cover"
                    css={{
                      minWidth: 'auto !important',
                      minHeight: '205px !important',
                      borderRadius: '24px',
                      boxShadow: '12px 12px 30px 10px rgb(104 112 118 / 0.35)',
                    }}
                    containerCss={{
                      overflow: 'visible',
                      width: '75% !important',
                      '@md': {
                        width: '50% !important',
                      },
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
                        width: '75% !important',
                        size: '$20',
                        minWidth: 'auto !important',
                        minHeight: '205px !important',
                        borderRadius: '24px !important',
                        '@md': {
                          width: '50% !important',
                        },
                      }}
                    />
                  </Row>
                )}
                <Spacer y={2} />
              </Col>
            )}
            <Col
              css={{
                display: 'flex',
                flexFlow: 'column',
                justifyContent: 'space-between',
                width: '100%',
                '@xs': {
                  width: '66.6667%',
                },
              }}
            >
              <Flex direction="column" justify="center" align="start">
                {isSm && (
                  <>
                    <Spacer y={1} />
                    {posterPath ? (
                      <Card.Image
                        // @ts-ignore
                        as={Image}
                        src={posterPath}
                        alt={title}
                        objectFit="cover"
                        width={isXs ? '70%' : '40%'}
                        containerCss={{
                          borderRadius: '24px',
                          overflow: 'visible',
                          '@xs': {
                            display: 'none',
                          },
                        }}
                        css={{
                          minWidth: 'auto !important',
                          borderRadius: '24px',
                          minHeight: '205px !important',
                          boxShadow: '12px 12px 30px 10px rgb(104 112 118 / 0.35)',
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
                    ) : (
                      <Row align="center" justify="center">
                        <Avatar
                          icon={<PhotoIcon width={48} height={48} />}
                          css={{
                            width: `${isXs ? '70%' : '40%'} !important`,
                            size: '$20',
                            minWidth: 'auto !important',
                            minHeight: '205px !important',
                            borderRadius: '24px !important',
                          }}
                        />
                      </Row>
                    )}
                    <Spacer y={1.5} />
                  </>
                )}
                <H2 h1 weight="bold">
                  {`${title} (${releaseYear})`}
                </H2>
                <Spacer y={0.5} />
                {tagline && (
                  <H5 h5 css={{ fontStyle: 'italic' }}>
                    {tagline}
                  </H5>
                )}
                <Spacer y={0.5} />
                <Row fluid wrap="wrap">
                  <Flex direction="row">
                    <Rating rating={item?.vote_average?.toFixed(1)} ratingType="movie" />
                    {imdbRating && (
                      <>
                        <Spacer x={0.75} />
                        <H6
                          h6
                          weight="semibold"
                          css={{
                            backgroundColor: '#ddb600',
                            color: '#000',
                            borderRadius: '$xs',
                            padding: '0 0.25rem 0 0.25rem',
                            marginRight: '0.5rem',
                          }}
                        >
                          IMDb
                        </H6>
                        <H6 h6 weight="semibold">
                          {imdbRating?.star}
                        </H6>
                      </>
                    )}
                  </Flex>
                  <Spacer x={1} />
                  <H6 h6>
                    {releaseDate}
                    {runtime ? ` • ${Math.floor(runtime / 60)}h ${runtime % 60}m` : null}
                  </H6>
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
                          type="button"
                          color="primary"
                          flat
                          auto
                          // shadow
                          key={genre?.id}
                          size={isSm ? 'sm' : 'md'}
                          css={{
                            marginBottom: '0.4rem',
                            ...(colorPalette && {
                              color: colorPalette[600],
                              backgroundColor: colorPalette[200],
                              '&:hover': {
                                backgroundColor: colorPalette[300],
                              },
                            }),
                          }}
                          onPress={() =>
                            navigate(
                              `/${type === 'movie' ? 'movies/' : 'tv-shows/'}discover?with_genres=${
                                genre?.id
                              }`,
                            )
                          }
                        >
                          {genre?.name}
                        </Button>
                        <Spacer x={0.25} />
                      </>
                    ))}
                </Row>
              </Flex>
              <Row
                fluid
                justify="space-between"
                align="center"
                wrap="wrap"
                css={{ marginBottom: '2.55rem' }}
              >
                {(status === 'Released' || status === 'Ended' || status === 'Returning Series') && (
                  <Button
                    type="button"
                    auto
                    // shadow
                    color="gradient"
                    onPress={() => setVisible(true)}
                    css={{
                      '@xsMax': {
                        width: '100%',
                      },
                    }}
                  >
                    <H5 h5 weight="bold" transform="uppercase">
                      Watch now
                    </H5>
                  </Button>
                )}
                <Flex direction="row" align="center" justify="start" wrap="wrap">
                  <Button
                    type="button"
                    auto
                    // shadow
                    flat
                    onPress={() => handler && handler(Number(id))}
                    css={{ margin: '0.5rem 0' }}
                  >
                    Watch Trailer
                  </Button>
                  <Spacer x={0.5} />
                  <Tooltip content="Share" placement="top" isDisabled={isSm}>
                    <Button
                      type="button"
                      auto
                      flat
                      onPress={() =>
                        WebShareLink(window.location.href, `${title}`, `${description}`)
                      }
                      icon={<ShareIcon />}
                    />
                  </Tooltip>
                </Flex>
              </Row>
            </Col>
          </Row>
          <Row
            fluid
            css={{
              paddingTop: '1rem',
              paddingBottom: '2rem',
              borderRadius: 0,
            }}
            justify="center"
          >
            <BackgroundTabLink css={{ backgroundColor }} />
            <TabLink
              pages={detailTab}
              linkTo={`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}`}
            />
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
        {...(type === 'tv' && { season: 1, episode: 1, isEnded: status === 'Ended' })}
        {...(type === 'movie' && { isEnded: status === 'Released' })}
      />
    </>
  );
};

export default MediaDetail;
