import { useEffect, useRef } from 'react';
import { Avatar, Badge, Card, Spacer } from '@nextui-org/react';
import { useIntersectionObserver, useMeasure, useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import {
  NavLink,
  Outlet,
  useCatch,
  useLoaderData,
  useParams,
  type RouteMatch,
} from '@remix-run/react';
import { motion, useTransform } from 'framer-motion';
import Vibrant from 'node-vibrant';
import Image, { MimeType } from 'remix-image';
import tinycolor from 'tinycolor2';
import i18next from '~/i18n/i18next.server';

import getProviderList from '~/services/provider.server';
import { authenticate } from '~/services/supabase';
import { getTvSeasonDetail, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useLayout } from '~/store/layout/useLayout';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useCustomHeaderChangePosition } from '~/hooks/useHeader';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { tvSeasonDetailPages } from '~/constants/tabLinks';
import { BackgroundContent, BackgroundTabLink } from '~/components/media/Media.styles';
import TabLink from '~/components/elements/tab/TabLink';
import { H2, H5, H6 } from '~/components/styles/Text.styles';
import CatchBoundaryView from '~/components/CatchBoundaryView';
import ErrorBoundaryView from '~/components/ErrorBoundaryView';
import PhotoIcon from '~/assets/icons/PhotoIcon';
import BackgroundDefault from '~/assets/images/background-default.jpg';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId, seasonId } = params;
  if (!tvId || !seasonId) throw new Error('Missing params');
  const tid = Number(tvId);
  const sid = Number(seasonId);

  // get translators

  const [seasonDetail, detail, detailEng] = await Promise.all([
    getTvSeasonDetail(tid, sid, locale),
    getTvShowDetail(tid, locale),
    getTvShowDetail(tid, 'en-US'),
  ]);
  if (!seasonDetail) throw new Response('Not Found', { status: 404 });
  const title = detailEng?.name || '';
  const orgTitle = detail?.original_name || '';
  const year = new Date(seasonDetail?.air_date || '').getFullYear();
  const season = seasonDetail?.season_number;
  const extractColorImage = `https://corsproxy.io/?${encodeURIComponent(
    TMDB.backdropUrl(seasonDetail?.poster_path || '', 'w300'),
  )}`;
  const isEnded = detail?.status === 'Ended' || detail?.status === 'Canceled';

  const [providers, fimg] = await Promise.all([
    getProviderList({
      type: 'tv',
      title,
      orgTitle,
      year,
      season,
      animeId: undefined,
      animeType: undefined,
      isEnded,
      tmdbId: tid,
    }),
    fetch(extractColorImage),
  ]);

  const fimgb = Buffer.from(await fimg.arrayBuffer());
  const palette = seasonDetail?.poster_path ? await Vibrant.from(fimgb).getPalette() : undefined;

  if (providers && providers.length > 0)
    return json(
      {
        detail,
        seasonDetail,
        providers,
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
      },
      { headers: { 'Cache-Control': CACHE_CONTROL.season } },
    );

  return json(
    {
      detail,
      seasonDetail,
      color: palette
        ? Object.values(palette).sort((a, b) =>
            a?.population === undefined || b?.population === undefined
              ? 0
              : b.population - a.population,
          )[0]?.hex
        : undefined,
      providers: [],
    },
    { headers: { 'Cache-Control': CACHE_CONTROL.season } },
  );
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Season',
      description: `This Tv show doesn't have season ${params.seasonId}`,
    };
  }
  const { detail, seasonDetail } = data;
  return {
    title: `Watch ${detail?.name || ''} ${seasonDetail?.name || ''} HD online Free - Sora`,
    description: `Watch ${detail?.name || ''} ${
      seasonDetail?.name || ''
    } in full HD online with Subtitle`,
    keywords: `Watch ${detail?.name || ''}, Stream ${detail?.name || ''}, Watch ${
      detail?.name || ''
    } HD, Online ${detail?.name || ''}, Streaming ${detail?.name || ''}, English, Subtitle ${
      detail?.name || ''
    }, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}`,
    'og:title': `Watch ${detail?.name || ''} ${seasonDetail?.name || ''} HD online Free - Sora`,
    'og:description': `Watch ${detail?.name || ''} ${
      seasonDetail?.name || ''
    } in full HD online with Subtitle`,
    'og:image': `https://sora-anime.vercel.app/api/ogimage?m=${params.tvId}&mt=tv`,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <NavLink
        to={`/tv-shows/${match.params.tvId}`}
        aria-label={
          match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId
        }
      >
        {({ isActive }) => (
          <Badge
            color="primary"
            variant="flat"
            css={{
              opacity: isActive ? 1 : 0.7,
              transition: 'opacity 0.25s ease 0s',
              '&:hover': { opacity: 0.8 },
            }}
          >
            {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
          </Badge>
        )}
      </NavLink>
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/`}
        aria-label={`Season ${match.params.seasonId}`}
      >
        {({ isActive }) => (
          <Badge
            color="primary"
            variant="flat"
            css={{
              opacity: isActive ? 1 : 0.7,
              transition: 'opacity 0.25s ease 0s',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Season {match.params.seasonId}
          </Badge>
        )}
      </NavLink>
    </>
  ),
  miniTitle: (match: RouteMatch) => ({
    title: `${match.data?.detail?.name || match.data?.detail?.original_name} - ${
      match.data?.seasonDetail?.name
    }`,
    subtitle: 'Episodes',
    showImage: match.data?.seasonDetail?.poster_path !== undefined,
    imageUrl: TMDB.posterUrl(match.data?.seasonDetail?.poster_path || '', 'w92'),
  }),
  disableLayoutPadding: true,
  customHeaderBackgroundColor: true,
  customHeaderChangeColorOnScroll: true,
};

const TvSeasonDetail = () => {
  const { detail, seasonDetail, color } = useLoaderData<typeof loader>();
  const { tvId, seasonId } = useParams();
  const [size, ref] = useMeasure<HTMLDivElement>();
  const [imageSize, imageRef] = useMeasure<HTMLDivElement>();
  const { backgroundColor } = useColorDarkenLighten(color);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isXl = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const { sidebarBoxedMode } = useSoraSettings();
  const { viewportRef, scrollY } = useLayout((scrollState) => scrollState);
  const { setBackgroundColor, startChangeScrollPosition } = useHeaderStyle(
    (headerState) => headerState,
  );
  const tabLinkRef = useRef<HTMLDivElement>(null);
  const tablinkIntersection = useIntersectionObserver(tabLinkRef, {
    root: viewportRef,
    rootMargin: sidebarBoxedMode ? '-180px 0px 0px 0px' : '-165px 0px 0px 0px',
    threshold: [1],
  });
  const paddingTop = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 100],
    [16, 16, startChangeScrollPosition ? 0 : 16],
  );
  const paddingBottom = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 100],
    [32, 32, startChangeScrollPosition ? 0 : 32],
  );
  useCustomHeaderChangePosition(tablinkIntersection);
  useEffect(() => {
    if (startChangeScrollPosition) {
      setBackgroundColor(backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, startChangeScrollPosition]);

  return (
    <>
      <Card
        as="section"
        variant="flat"
        css={{
          display: 'flex',
          flexDirection: 'column',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopRightRadius: 0,
          height: `calc(${size?.height}px + 72px)`,
          width: '100%',
          borderWidth: 0,
          backgroundColor: 'transparent',
          backgroundImage: `linear-gradient(to top, ${backgroundColor}, ${tinycolor(
            backgroundColor,
          ).setAlpha(0)})`,
        }}
      >
        <Card.Header
          ref={ref}
          css={{
            position: 'absolute',
            zIndex: 1,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            bottom: 0,
            padding: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            flexDirection: 'column',
          }}
        >
          <BackgroundContent />
          <div className="grid w-full max-w-[1920px] grid-cols-[1fr_2fr] grid-rows-[1fr_auto_auto] items-stretch justify-center gap-x-4 gap-y-6 px-3 pt-5 pb-8 grid-areas-small sm:grid-rows-[auto_1fr_auto] sm:px-3.5 sm:grid-areas-wide xl:px-4 2xl:px-5">
            <div className="flex flex-col grid-in-image" ref={imageRef}>
              {seasonDetail?.poster_path ? (
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={TMDB.posterUrl(seasonDetail?.poster_path)}
                  alt={seasonDetail?.name}
                  title={seasonDetail?.name}
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
            </div>
            <div className="flex w-full flex-col items-start justify-start grid-in-title">
              <H2 h2 weight="bold">
                {detail?.name} {seasonDetail?.name}
              </H2>
              <H5 h5 weight="bold">
                {seasonDetail?.episodes?.length || 0} episodes &middot; {seasonDetail?.air_date}{' '}
              </H5>
            </div>
            {seasonDetail?.overview ? (
              <div className="flex flex-col gap-y-3 grid-in-info sm:gap-y-6">
                <H6 h6>{seasonDetail.overview}</H6>
              </div>
            ) : null}
          </div>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            // @ts-ignore
            as={Image}
            src={
              seasonDetail?.poster_path
                ? TMDB.posterUrl(seasonDetail?.poster_path, 'w342')
                : BackgroundDefault
            }
            showSkeleton
            css={{
              width: '100%',
              height: 'auto',
              top: 0,
              left: 0,
              objectFit: 'cover',
              opacity: 0.3,
            }}
            title={seasonDetail?.name}
            alt={seasonDetail?.name}
            containerCss={{ margin: 0, visibility: size ? 'visible' : 'hidden' }}
            loaderUrl="/api/image"
            placeholder="empty"
            responsive={[
              {
                size: {
                  width: Math.round(size?.width || 0),
                  height: Math.round(size?.height || 0) + 72,
                },
              },
            ]}
            options={{
              blurRadius: 80,
              contentType: MimeType.WEBP,
            }}
          />
        </Card.Body>
      </Card>
      <div className="flex w-full flex-col items-center justify-center">
        <motion.div
          className="sticky top-[64px] z-[1000] flex w-full justify-center transition-[padding] duration-100 ease-in-out"
          style={{
            backgroundColor,
            paddingTop,
            paddingBottom,
          }}
          ref={tabLinkRef}
        >
          <BackgroundTabLink css={{ backgroundColor, zIndex: 1 }} />
          <TabLink pages={tvSeasonDetailPages} linkTo={`/tv-shows/${tvId}/season/${seasonId}`} />
        </motion.div>
        <Outlet />
      </div>
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default TvSeasonDetail;
