/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Spacer, Tooltip } from '@nextui-org/react';
import { useMeasure, useMediaQuery } from '@react-hookz/web';
import { useFetcher, useLocation, useNavigate } from '@remix-run/react';
import { motion, useTransform } from 'framer-motion';
import Image, { MimeType } from 'remix-image';
// import { useTranslation } from 'react-i18next';
import { tv } from 'tailwind-variants';
import tinycolor from 'tinycolor2';
import type { ColorPalette } from '~/routes/api/color-palette';

import type { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import type { IMovieDetail, IMovieTranslations, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import { WebShareLink } from '~/utils/client/pwa-utils.client';
import TMDB from '~/utils/media';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import SelectProviderModal from '~/components/elements/modal/SelectProviderModal';
import Rating from '~/components/elements/shared/Rating';
import { H2, H5, H6 } from '~/components/styles/Text.styles';
import PhotoIcon from '~/assets/icons/PhotoIcon';
import ShareIcon from '~/assets/icons/ShareIcon';

import { BackgroundContent } from './Media.styles';

interface IMediaDetail {
  type: 'movie' | 'tv';
  item: IMovieDetail | ITvShowDetail | undefined;
  handler?: (id: number) => void;
  translations?: IMovieTranslations | undefined;
  imdbRating: { count: number; star: number } | undefined;
  color: string | undefined;
}

interface IMediaBackground {
  backdropPath: string | undefined;
  backgroundColor: string;
}

interface IAnimeDetail {
  item: IAnimeInfo | undefined;
  handler?: (id: number) => void;
}

const backgroundImageStyles = tv({
  base: 'relative w-full overflow-hidden bg-fixed bg-[left_0px_top_0px] bg-no-repeat',
  variants: {
    sidebarMiniMode: {
      true: 'sm:bg-[left_80px_top_0px]',
    },
    sidebarBoxedMode: {
      true: 'sm:bg-[left_280px_top_0px]',
    },
  },
  compoundVariants: [
    {
      sidebarMiniMode: true,
      sidebarBoxedMode: true,
      class: 'sm:bg-[left_110px_top_0px]',
    },
    {
      sidebarMiniMode: false,
      sidebarBoxedMode: false,
      class: 'sm:bg-[left_250px_top_0px]',
    },
  ],
});

export const MediaDetail = (props: IMediaDetail) => {
  // const { t } = useTranslation();
  const { type, item, handler, imdbRating, color } = props;
  const [size, ref] = useMeasure<HTMLDivElement>();
  const [imageSize, imageRef] = useMeasure<HTMLDivElement>();
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const { backgroundColor } = useColorDarkenLighten(color);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isXl = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const [visible, setVisible] = useState(false);
  const [colorPalette, setColorPalette] = useState<ColorPalette>();
  const closeHandler = () => {
    setVisible(false);
  };
  const { id, tagline, genres, status } = item || {};
  const title = (item as IMovieDetail)?.title || (item as ITvShowDetail)?.name || '';
  const titleEng = (item as IMovieDetail)?.titleEng || (item as ITvShowDetail)?.nameEng || '';
  const orgTitle =
    (item as IMovieDetail)?.original_title || (item as ITvShowDetail)?.original_name || '';
  const runtime =
    // @ts-ignore
    Number((item as IMovieDetail)?.runtime) ?? Number((item as ITvShowDetail)?.episode_run_time[0]);
  const posterPath = item?.poster_path
    ? TMDB?.posterUrl(item?.poster_path || '', 'w342')
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
      ref.current.scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'nearest',
      });
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
          backgroundColor: 'transparent',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          height: `calc(${size?.height}px)`,
          backgroundImage: `linear-gradient(to bottom, transparent 80px, ${backgroundColor} 80px)`,
          '@xs': {
            backgroundImage: `linear-gradient(to bottom, transparent 200px, ${backgroundColor} 200px)`,
          },
        }}
      >
        <Card.Body
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
          <div className="grid w-full max-w-[1920px] grid-cols-[1fr_2fr] grid-rows-[1fr_auto_auto] items-stretch justify-center gap-x-4 gap-y-6 px-3 pt-5 grid-areas-small sm:grid-rows-[auto_1fr_auto] sm:px-3.5 sm:grid-areas-wide xl:px-4 2xl:px-5">
            <div className="flex flex-col grid-in-image" ref={imageRef}>
              {posterPath ? (
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={posterPath}
                  alt={title}
                  objectFit="cover"
                  css={{
                    minWidth: 'auto !important',
                    minHeight: 'auto !important',
                    borderRadius: '$sm',
                    boxShadow: '12px 12px 30px 10px rgb(104 112 118 / 0.35)',
                    aspectRatio: '2 / 3',
                    '@sm': {
                      borderRadius: '$md',
                    },
                  }}
                  containerCss={{
                    overflow: 'visible',
                    width: '100% !important',
                    '@xs': {
                      width: '75% !important',
                    },
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
                        width: Math.round(
                          (imageSize?.width || 0) *
                            (!isXl && !isSm ? 0.5 : isXl && !isSm ? 0.75 : isXl && isSm ? 1 : 1),
                        ),
                        height: Math.round(
                          ((imageSize?.width || 0) *
                            3 *
                            (!isXl && !isSm ? 0.5 : isXl && !isSm ? 0.75 : isXl && isSm ? 1 : 1)) /
                            2,
                        ),
                      },
                    },
                  ]}
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <Avatar
                    icon={<PhotoIcon width={48} height={48} />}
                    css={{
                      width: '100% !important',
                      height: 'auto !important',
                      size: '$20',
                      borderRadius: '$sm',
                      aspectRatio: '2 / 3',
                      '@xs': { width: '75% !important' },
                      '@sm': { borderRadius: '$md' },
                      '@md': { width: '50% !important' },
                    }}
                  />
                </div>
              )}
              {isSm ? null : <Spacer y={2} />}
            </div>
            <div className="flex w-full flex-col items-start justify-start grid-in-title">
              <H2 h1 weight="bold" css={{ '@xsMax': { fontSize: '1.75rem !important' } }}>
                {`${title}${isSm ? '' : ` (${releaseYear})`}`}
              </H2>
              {tagline ? (
                <H5 h5 css={{ fontStyle: 'italic' }}>
                  {tagline}
                </H5>
              ) : null}
            </div>
            <div className="flex flex-col gap-y-3 grid-in-info sm:gap-y-6">
              <div className="flex flex-row flex-wrap gap-3">
                <Badge
                  size={isSm ? 'sm' : 'md'}
                  color="primary"
                  variant="flat"
                  className="transition-all duration-200 ease-in-out"
                  css={
                    colorPalette
                      ? {
                          backgroundColor: colorPalette[200],
                          borderColor: colorPalette[400],
                        }
                      : { borderColor: '$primaryLightActive' }
                  }
                >
                  <Rating
                    rating={item?.vote_average?.toFixed(1)}
                    ratingType="movie"
                    color={colorPalette ? colorPalette[600] : undefined}
                  />
                  {imdbRating ? (
                    <div className="ml-3 flex flex-row items-center gap-x-2">
                      <H6
                        h6
                        weight="semibold"
                        css={{
                          backgroundColor: '#ddb600',
                          color: '#000',
                          borderRadius: '$xs',
                          padding: '0 0.25rem 0 0.25rem',
                        }}
                      >
                        IMDb
                      </H6>
                      <H6
                        h6
                        weight="semibold"
                        css={colorPalette ? { color: colorPalette[600] } : {}}
                      >
                        {imdbRating?.star}
                      </H6>
                    </div>
                  ) : null}
                </Badge>
                <Badge
                  size={isSm ? 'sm' : 'md'}
                  color="primary"
                  variant="flat"
                  className="flex flex-row transition-all duration-200 ease-in-out"
                  css={
                    colorPalette
                      ? {
                          backgroundColor: colorPalette[200],
                          borderColor: colorPalette[400],
                        }
                      : { borderColor: '$primaryLightActive' }
                  }
                >
                  <H6 h6 weight="semibold" css={colorPalette ? { color: colorPalette[600] } : {}}>
                    {releaseDate}
                    {runtime ? ` • ${Math.floor(runtime / 60)}h ${runtime % 60}m` : null}
                  </H6>
                </Badge>
              </div>
              <div className="flex w-full flex-row flex-wrap items-center justify-start gap-3">
                {genres &&
                  genres?.map((genre) => (
                    <Button
                      type="button"
                      color="primary"
                      flat
                      auto
                      // shadow
                      key={genre?.id}
                      size={isSm ? 'sm' : 'md'}
                      css={{
                        transition: 'all 0.2s ease-in-out',
                        ...(colorPalette
                          ? {
                              color: colorPalette[600],
                              backgroundColor: colorPalette[200],
                              '&:hover': {
                                backgroundColor: colorPalette[300],
                              },
                            }
                          : {}),
                      }}
                      onPress={() =>
                        navigate(
                          `/discover/${type === 'movie' ? 'movies' : 'tv-shows'}?with_genres=${
                            genre?.id
                          }`,
                        )
                      }
                    >
                      {genre?.name}
                    </Button>
                  ))}
              </div>
            </div>
            <div className="mb-10 flex w-full flex-row flex-wrap items-center justify-between gap-4 grid-in-buttons">
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
              <div className="flex flex-row flex-wrap items-center justify-start">
                <Button
                  type="button"
                  auto
                  size={isSm ? 'sm' : 'md'}
                  // shadow
                  flat
                  onPress={() => handler && handler(Number(id))}
                >
                  Watch Trailer
                </Button>
                <Spacer x={0.5} />
                <Tooltip content="Share" placement="top" isDisabled={isSm}>
                  <Button
                    type="button"
                    size={isSm ? 'sm' : 'md'}
                    flat
                    onPress={() => WebShareLink(window.location.href, `${title}`, `${description}`)}
                    icon={<ShareIcon />}
                    css={{ minWidth: 'min-content' }}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <SelectProviderModal
        visible={visible}
        closeHandler={closeHandler}
        type={type}
        title={titleEng}
        origTitle={orgTitle}
        year={releaseYear}
        id={item?.id}
        {...(type === 'tv' && { season: 1, episode: 1, isEnded: status === 'Ended' })}
        {...(type === 'movie' && { isEnded: status === 'Released' })}
      />
    </>
  );
};

export const AnimeDetail = (props: IAnimeDetail) => {
  // const { t } = useTranslation();
  const { item, handler } = props;
  const { id, genres, title, releaseDate, rating, image, type, color, description, status } =
    item || {};
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  const [size, ref] = useMeasure<HTMLDivElement>();
  const [imageSize, imageRef] = useMeasure<HTMLDivElement>();
  const { backgroundColor } = useColorDarkenLighten(color);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isXl = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const [visible, setVisible] = useState(false);
  const [colorPalette, setColorPalette] = useState<ColorPalette>();
  const closeHandler = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
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
          backgroundColor: 'transparent',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          height: `calc(${size?.height}px)`,
          backgroundImage: `linear-gradient(to bottom, transparent 80px, ${backgroundColor} 80px)`,
          '@xs': {
            backgroundImage: `linear-gradient(to bottom, transparent 200px, ${backgroundColor} 200px)`,
          },
        }}
      >
        <Card.Body
          ref={ref}
          css={{
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <BackgroundContent />
          <div className="grid w-full max-w-[1920px] grid-cols-[1fr_2fr] grid-rows-[1fr_auto_auto] items-stretch justify-center gap-x-4 gap-y-6 px-3 pt-5 grid-areas-small sm:grid-rows-[auto_1fr_auto] sm:px-3.5 sm:grid-areas-wide xl:px-4 2xl:px-5">
            <div className="flex flex-col grid-in-image" ref={imageRef}>
              {image ? (
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={image}
                  title={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  objectFit="cover"
                  css={{
                    minWidth: 'auto !important',
                    minHeight: 'auto !important',
                    borderRadius: '$sm',
                    boxShadow: '12px 12px 30px 10px rgb(104 112 118 / 0.35)',
                    aspectRatio: '2 / 3',
                    '@sm': {
                      borderRadius: '$md',
                    },
                  }}
                  containerCss={{
                    overflow: 'visible',
                    width: '100% !important',
                    '@xs': {
                      width: '75% !important',
                    },
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
                        width: Math.round(
                          (imageSize?.width || 0) *
                            (!isXl && !isSm ? 0.5 : isXl && !isSm ? 0.75 : isXl && isSm ? 1 : 1),
                        ),
                        height: Math.round(
                          ((imageSize?.width || 0) *
                            3 *
                            (!isXl && !isSm ? 0.5 : isXl && !isSm ? 0.75 : isXl && isSm ? 1 : 1)) /
                            2,
                        ),
                      },
                    },
                  ]}
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <Avatar
                    icon={<PhotoIcon width={48} height={48} />}
                    css={{
                      width: '100% !important',
                      height: 'auto !important',
                      size: '$20',
                      borderRadius: '$sm',
                      aspectRatio: '2 / 3',
                      '@xs': { width: '75% !important' },
                      '@sm': { borderRadius: '$md' },
                      '@md': { width: '50% !important' },
                    }}
                  />
                </div>
              )}
              {isSm ? null : <Spacer y={2} />}
            </div>
            <div className="flex w-full flex-col items-start justify-start grid-in-title">
              <H2 h1 weight="bold" css={{ '@xsMax': { fontSize: '1.75rem !important' } }}>
                {`${title?.userPreferred || title?.english || title?.romaji || title?.native}`}
              </H2>
            </div>
            <div className="flex flex-col gap-y-3 grid-in-info sm:gap-y-6">
              <div className="flex flex-row flex-wrap gap-3">
                <Badge
                  size={isSm ? 'sm' : 'md'}
                  color="primary"
                  variant="flat"
                  className="transition-all duration-200 ease-in-out"
                  css={
                    colorPalette
                      ? {
                          backgroundColor: colorPalette[200],
                          borderColor: colorPalette[400],
                        }
                      : { borderColor: '$primaryLightActive' }
                  }
                >
                  <Rating
                    rating={rating}
                    ratingType="anime"
                    color={colorPalette ? colorPalette[600] : undefined}
                  />
                </Badge>
                <Badge
                  size={isSm ? 'sm' : 'md'}
                  color="primary"
                  variant="flat"
                  className="flex flex-row transition-all duration-200 ease-in-out"
                  css={
                    colorPalette
                      ? {
                          backgroundColor: colorPalette[200],
                          borderColor: colorPalette[400],
                        }
                      : { borderColor: '$primaryLightActive' }
                  }
                >
                  <H6 h6 weight="semibold" css={colorPalette ? { color: colorPalette[600] } : {}}>
                    {type}
                    {releaseDate ? ` • ${releaseDate}` : ''}
                  </H6>
                </Badge>
              </div>
              <div className="flex w-full flex-row flex-wrap items-center justify-start gap-3">
                {genres &&
                  genres?.map((genre) => (
                    <Button
                      type="button"
                      color="primary"
                      flat
                      auto
                      // shadow
                      key={genre}
                      size={isSm ? 'sm' : 'md'}
                      css={{
                        transition: 'all 0.2s ease-in-out',
                        ...(colorPalette
                          ? {
                              color: colorPalette[600],
                              backgroundColor: colorPalette[200],
                              '&:hover': {
                                backgroundColor: colorPalette[300],
                              },
                            }
                          : {}),
                      }}
                      onPress={() => navigate(`/discover/anime?genres=${genre}`)}
                    >
                      {genre}
                    </Button>
                  ))}
              </div>
            </div>
            <div className="mb-10 flex w-full flex-row flex-wrap items-center justify-between gap-4 grid-in-buttons">
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
              <div className="flex flex-row flex-wrap items-center justify-start">
                <Button
                  type="button"
                  auto
                  size={isSm ? 'sm' : 'md'}
                  // shadow
                  flat
                  onPress={() => handler && handler(Number(id))}
                >
                  Watch Trailer
                </Button>
                <Spacer x={0.5} />
                <Tooltip content="Share" placement="top" isDisabled={isSm}>
                  <Button
                    type="button"
                    size={isSm ? 'sm' : 'md'}
                    flat
                    onPress={() => WebShareLink(window.location.href, `${title}`, `${description}`)}
                    icon={<ShareIcon />}
                    css={{ minWidth: 'min-content' }}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <SelectProviderModal
        visible={visible}
        closeHandler={closeHandler}
        type="anime"
        id={id}
        title={title?.english || ''}
        origTitle={title?.native || ''}
        year={Number(releaseDate)}
        episode={1}
        season={undefined}
        animeType={type?.toLowerCase() || 'tv'}
        isEnded={status === 'FINISHED'}
      />
    </>
  );
};

export const MediaBackgroundImage = (props: IMediaBackground) => {
  const { backdropPath, backgroundColor } = props;
  const [size, backgroundRef] = useMeasure<HTMLDivElement>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const { sidebarMiniMode, sidebarBoxedMode } = useSoraSettings();
  const { scrollY } = useLayoutScrollPosition((scrollState) => scrollState);
  const backgroundImageHeight = isSm ? 100 : 300;
  const height = useTransform(
    scrollY,
    [0, 800 - backgroundImageHeight],
    [backgroundImageHeight, 800],
  );
  return (
    <div
      ref={backgroundRef}
      className={backgroundImageStyles({
        sidebarMiniMode: sidebarMiniMode.value,
        sidebarBoxedMode: sidebarBoxedMode.value,
      })}
      style={{
        backgroundImage: `url(${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://sora-anime.vercel.app'
        }/api/image?src=${encodeURIComponent(
          backdropPath ||
            'https://raw.githubusercontent.com/Khanhtran47/Sora/master/app/assets/images/background-default.jpg',
        )}&width=${size?.width}&height=${
          size?.height
        }&fit=cover&position=center&background[]=0&background[]=0&background[]=0&background[]=0&quality=80&compressionLevel=9&loop=0&delay=100&crop=null&contentType=image%2Fwebp)`,
        aspectRatio: '2 / 1',
        visibility: size?.width !== undefined ? 'visible' : 'hidden',
        backgroundSize: `${size?.width}px auto`,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height,
          backgroundImage: `linear-gradient(to top, ${backgroundColor}, ${tinycolor(
            backgroundColor,
          ).setAlpha(0)})`,
        }}
      />
    </div>
  );
};
