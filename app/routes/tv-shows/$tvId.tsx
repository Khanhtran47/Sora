import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { Outlet, useCatch, useLoaderData, useLocation, type RouteMatch } from '@remix-run/react';
import { motion, useTransform } from 'framer-motion';
import Vibrant from 'node-vibrant';
import { useHydrated } from 'remix-utils';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getImdbRating, getTvShowDetail, getTvShowIMDBId } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useLayout } from '~/store/layout/useLayout';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useCustomHeaderChangePosition } from '~/hooks/useHeader';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { movieTvDetailsPages } from '~/constants/tabLinks';
import { MediaBackgroundImage, MediaDetail } from '~/components/media/MediaDetail';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import CatchBoundaryView from '~/components/elements/shared/CatchBoundaryView';
import ErrorBoundaryView from '~/components/elements/shared/ErrorBoundaryView';
import TabLink from '~/components/elements/tab/TabLink';
import { backgroundStyles } from '~/components/styles/primitives';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId } = params;
  const tid = Number(tvId);
  if (!tid) throw new Response('Not Found', { status: 404 });

  const [detail, imdbId] = await Promise.all([getTvShowDetail(tid, locale), getTvShowIMDBId(tid)]);
  if (!detail) throw new Response('Not Found', { status: 404 });
  const extractColorImage = `https://corsproxy.io/?${encodeURIComponent(
    TMDB.backdropUrl(detail?.backdrop_path || detail?.poster_path || '', 'w300'),
  )}`;
  let nameEng =
    detail?.original_language === 'en'
      ? detail?.original_name
      : locale === 'en'
      ? detail?.name
      : '';
  if (detail?.original_language !== 'en' && locale !== 'en') {
    const [detailEng, imdbRating, fimg] = await Promise.all([
      getTvShowDetail(tid, 'en-US'),
      imdbId && process.env.IMDB_API_URL !== undefined ? getImdbRating(imdbId) : undefined,
      fetch(extractColorImage),
    ]);
    nameEng = detailEng?.name || '';
    const fimgb = Buffer.from(await fimg.arrayBuffer());
    const palette =
      detail?.backdrop_path || detail?.poster_path
        ? await Vibrant.from(fimgb).getPalette()
        : undefined;
    return json(
      {
        detail: {
          ...detail,
          color: palette
            ? Object.values(palette).sort((a, b) =>
                a?.population === undefined || b?.population === undefined
                  ? 0
                  : b.population - a.population,
              )[0]?.hex
            : undefined,
          nameEng,
        },
        imdbRating,
      },
      {
        headers: { 'Cache-Control': CACHE_CONTROL.detail },
      },
    );
  }

  const [imdbRating, fimg] = await Promise.all([
    imdbId && process.env.IMDB_API_URL !== undefined ? getImdbRating(imdbId) : undefined,
    fetch(extractColorImage),
  ]);
  const fimgb = Buffer.from(await fimg.arrayBuffer());
  const palette =
    detail?.backdrop_path || detail?.poster_path
      ? await Vibrant.from(fimgb).getPalette()
      : undefined;
  return json(
    {
      detail: {
        ...detail,
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
        nameEng,
      },
      imdbRating,
      translations: undefined,
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Movie',
      description: `There is no movie with the ID: ${params.tvId}`,
    };
  }
  const { detail } = data;
  return {
    title: `Watch ${detail?.name || ''} HD online Free - Sora`,
    description: detail?.overview || `Watch ${detail?.name || ''} full HD online with Subtitle`,
    keywords: `Watch ${detail?.name || ''}, Stream ${detail?.name || ''}, Watch ${
      detail?.name || ''
    } HD, Online ${detail?.name || ''}, Streaming ${detail?.name || ''}, English, Subtitle ${
      detail?.name || ''
    }, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}`,
    'og:title': `Watch ${detail?.name || ''} HD online Free - Sora`,
    'og:description':
      detail?.overview || `Watch ${detail?.name || ''} in full HD online with Subtitle`,
    'og:image': `https://sora-anime.vercel.app/api/ogimage?m=${params.tvId}&mt=tv`,
    'twitter:card': 'summary_large_image',
    'twitter:site': '@sora_anime',
    'twitter:domain': 'sora-anime.vercel.app',
    'twitter:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}`,
    'twitter:title': `Watch ${detail?.name || ''} HD online Free - Sora`,
    'twitter:description':
      detail?.overview || `Watch ${detail?.name || ''} in full HD online with Subtitle`,
    'twitter:image': `https://sora-anime.vercel.app/api/ogimage?m=${params.tvId}&mt=tv`,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <BreadcrumbItem to={`/tv-shows/${match.params.tvId}`} key={`tv-shows-${match.params.tvId}`}>
      {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
    </BreadcrumbItem>
  ),
  miniTitle: (match: RouteMatch) => ({
    title: match.data?.detail?.name,
    subtitle: 'Overview',
    showImage: match.data?.detail?.poster_path !== undefined,
    imageUrl: TMDB?.posterUrl(match.data?.detail?.poster_path || '', 'w92'),
  }),
  preventScrollToTop: true,
  disableLayoutPadding: true,
  customHeaderBackgroundColor: true,
  customHeaderChangeColorOnScroll: true,
};

const TvShowDetail = () => {
  const { detail, imdbRating } = useLoaderData<typeof loader>();
  const { state } = useLocation();
  const isHydrated = useHydrated();
  const { backgroundColor } = useColorDarkenLighten(detail?.color);
  const { sidebarBoxedMode } = useSoraSettings();
  const { viewportRef, scrollY } = useLayout((scrollState) => scrollState);
  const { setBackgroundColor, startChangeScrollPosition } = useHeaderStyle(
    (headerStyle) => headerStyle,
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

  const currentTime = state && (state as { currentTime: number | undefined }).currentTime;
  const backdropPath = detail?.backdrop_path
    ? TMDB?.backdropUrl(detail?.backdrop_path || '', 'w1280')
    : undefined;

  return (
    <>
      <MediaBackgroundImage backdropPath={backdropPath} backgroundColor={backgroundColor} />
      <div className="relative top-[-80px] w-full sm:top-[-200px]">
        <MediaDetail
          type="tv"
          item={detail}
          imdbRating={imdbRating}
          color={detail.color}
          trailerTime={currentTime}
        />
        <div className="flex w-full flex-col items-center justify-center">
          <motion.div
            className="sticky top-[64px] z-[1000] flex w-full justify-center transition-[padding] duration-100 ease-in-out"
            style={{
              backgroundColor: isHydrated ? backgroundColor : 'transparent',
              paddingTop,
              paddingBottom,
            }}
            ref={tabLinkRef}
          >
            <div
              className={backgroundStyles({ tablink: true })}
              style={{ backgroundColor: isHydrated ? backgroundColor : 'transparent' }}
            />
            <TabLink pages={movieTvDetailsPages} linkTo={`/tv-shows/${detail?.id}`} />
          </motion.div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default TvShowDetail;
