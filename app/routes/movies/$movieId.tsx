import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import {
  Outlet,
  useCatch,
  useFetcher,
  useLoaderData,
  useLocation,
  type RouteMatch,
} from '@remix-run/react';
import { motion, useTransform } from 'framer-motion';
import Vibrant from 'node-vibrant';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getImdbRating, getMovieDetail } from '~/services/tmdb/tmdb.server';
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
import WatchTrailerModal, { type Trailer } from '~/components/elements/dialog/WatchTrailerModal';
import CatchBoundaryView from '~/components/elements/shared/CatchBoundaryView';
import ErrorBoundaryView from '~/components/elements/shared/ErrorBoundaryView';
import TabLink from '~/components/elements/tab/TabLink';
import { backgroundStyles } from '~/components/styles/primitives';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });
  const detail = await getMovieDetail(mid, locale);
  if (!detail) throw new Response('Not Found', { status: 404 });
  const extractColorImage = `https://corsproxy.io/?${encodeURIComponent(
    TMDB.backdropUrl(detail?.backdrop_path || detail?.poster_path || '', 'w300'),
  )}`;
  let titleEng =
    detail?.original_language === 'en'
      ? detail?.original_title
      : locale === 'en'
      ? detail?.title
      : '';
  if (detail?.original_language !== 'en' && locale !== 'en') {
    const [detailEng, imdbRating, fimg] = await Promise.all([
      getMovieDetail(mid, 'en-US'),
      detail?.imdb_id && process.env.IMDB_API_URL !== undefined
        ? getImdbRating(detail?.imdb_id)
        : undefined,
      fetch(extractColorImage),
    ]);
    titleEng = detailEng?.title || '';
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
          titleEng,
        },
        imdbRating,
        palette,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.movie,
        },
      },
    );
  }
  const [imdbRating, fimg] = await Promise.all([
    detail?.imdb_id && process.env.IMDB_API_URL !== undefined
      ? getImdbRating(detail?.imdb_id)
      : undefined,
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
        titleEng,
      },
      imdbRating,
      translations: undefined,
      palette,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.movie,
      },
    },
  );
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Movie',
      description: `There is no movie with the ID: ${params.movieId}`,
    };
  }
  const { detail } = data;
  return {
    title: `Watch ${detail?.title || ''} HD online Free - Sora`,
    description: detail?.overview || `Watch ${detail?.title || ''} in full HD online with Subtitle`,
    keywords: `Watch ${detail?.title || ''}, Stream ${detail?.title || ''}, Watch ${
      detail?.title || ''
    } HD, Online ${detail?.title || ''}, Streaming ${detail?.title || ''}, English, Subtitle ${
      detail?.title || ''
    }, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}`,
    'og:title': `Watch ${detail?.title || ''} HD online Free - Sora`,
    'og:description':
      detail?.overview || `Watch ${detail?.title || ''} in full HD online with Subtitle`,
    'og:image': `https://sora-anime.vercel.app/api/ogimage?m=${params.movieId}&mt=movie`,
    'twitter:card': 'summary_large_image',
    'twitter:site': '@sora_anime',
    'twitter:domain': 'sora-anime.vercel.app',
    'twitter:url': `https://sora-anime.vercel.app/movies/${params.movieId}`,
    'twitter:title': `Watch ${detail?.title || ''} HD online Free - Sora`,
    'twitter:description':
      detail?.overview || `Watch ${detail?.title || ''} in full HD online with Subtitle`,
    'twitter:image': `https://sora-anime.vercel.app/api/ogimage?m=${params.movieId}&mt=movie`,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <BreadcrumbItem to={`/movies/${match.params.movieId}`} key={`movies-${match.params.movieId}`}>
      {match.data?.detail?.title || match.params.movieId}
    </BreadcrumbItem>
  ),
  miniTitle: (match: RouteMatch) => ({
    title: match.data?.detail?.title,
    subtitle: 'Overview',
    showImage: match.data?.detail?.poster_path !== undefined,
    imageUrl: TMDB?.posterUrl(match.data?.detail?.poster_path || '', 'w92'),
  }),
  preventScrollToTop: true,
  disableLayoutPadding: true,
  customHeaderBackgroundColor: true,
  customHeaderChangeColorOnScroll: true,
};

const MovieDetail = () => {
  const { detail, imdbRating } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const { backgroundColor } = useColorDarkenLighten(detail?.color);
  const { sidebarBoxedMode } = useSoraSettings();
  const { viewportRef, scrollY } = useLayout((scrollState) => scrollState);
  const { setBackgroundColor, startChangeScrollPosition } = useHeaderStyle(
    (headerState) => headerState,
  );
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
  const tabLinkRef = useRef<HTMLDivElement>(null);
  const tablinkIntersection = useIntersectionObserver(tabLinkRef, {
    root: viewportRef,
    rootMargin: sidebarBoxedMode ? '-180px 0px 0px 0px' : '-165px 0px 0px 0px',
    threshold: [1],
  });
  useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);

  useCustomHeaderChangePosition(tablinkIntersection);

  useEffect(() => {
    if (startChangeScrollPosition) {
      setBackgroundColor(backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, startChangeScrollPosition]);

  const currentTime = state && (state as { currentTime: number }).currentTime;
  const backdropPath = detail?.backdrop_path
    ? TMDB?.backdropUrl(detail?.backdrop_path || '', 'w1280')
    : undefined;
  const Handler = (id: number) => {
    setVisible(true);
    fetcher.load(`/movies/${id}/videos`);
  };
  const closeHandler = () => {
    setVisible(false);
    setTrailer({});
  };

  return (
    <>
      <MediaBackgroundImage backdropPath={backdropPath} backgroundColor={backgroundColor} />
      <div className="relative top-[-80px] w-full sm:top-[-200px]">
        <MediaDetail
          type="movie"
          item={detail}
          handler={Handler}
          imdbRating={imdbRating}
          color={detail.color}
        />
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
            <div className={backgroundStyles({ tablink: true })} style={{ backgroundColor }} />
            <TabLink pages={movieTvDetailsPages} linkTo={`/movies/${detail?.id}`} />
          </motion.div>
          <Outlet />
        </div>
      </div>
      <WatchTrailerModal
        trailer={trailer}
        visible={visible}
        closeHandler={closeHandler}
        currentTime={Number(currentTime)}
      />
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default MovieDetail;
