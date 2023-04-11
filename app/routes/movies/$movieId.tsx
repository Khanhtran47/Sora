/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { useState, useRef, useEffect } from 'react';
import { json } from '@remix-run/node';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  Outlet,
  NavLink,
  RouteMatch,
  useFetcher,
  useLocation,
} from '@remix-run/react';
import { Badge } from '@nextui-org/react';
import Vibrant from 'node-vibrant';
import tinycolor from 'tinycolor2';
import { useMeasure, useIntersectionObserver, useMediaQuery } from '@react-hookz/web';
import { tv } from 'tailwind-variants';

import { getMovieDetail, getTranslations, getImdbRating } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { authenticate } from '~/services/supabase';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';

import { CACHE_CONTROL } from '~/utils/server/http';
import TMDB from '~/utils/media';

import MediaDetail from '~/components/media/MediaDetail';
import WatchTrailerModal, { Trailer } from '~/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/components/CatchBoundaryView';
import ErrorBoundaryView from '~/components/ErrorBoundaryView';
import TabLink from '~/components/elements/tab/TabLink';
import { BackgroundTabLink } from '~/components/media/Media.styles';

import { movieTvDetailsPages } from '~/constants/tabLinks';

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
  if ((detail && detail.original_language !== 'en') || locale !== 'en') {
    const [translations, imdbRating, fimg] = await Promise.all([
      getTranslations('movie', mid),
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
        },
        imdbRating,
        translations,
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
    <NavLink
      to={`/movies/${match.params.movieId}`}
      aria-label={match.data?.detail?.title || match.params.movieId}
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
          {match.data?.detail?.title || match.params.movieId}
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: (match: RouteMatch) => ({
    title: match.data?.detail?.title,
    showImage: match.data?.detail?.poster_path !== undefined,
    imageUrl: TMDB?.posterUrl(match.data?.detail?.poster_path || '', 'w92'),
  }),
  preventScrollToTop: true,
  disableLayoutPadding: true,
  customHeaderBackgroundColor: true,
  customHeaderChangeColorOnScroll: true,
};

const backgroundImageStyles = tv({
  base: 'w-full relative overflow-hidden bg-fixed bg-no-repeat bg-[left_0px_top_0px]',
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

const MovieDetail = () => {
  const { detail, imdbRating, translations } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const { backgroundColor } = useColorDarkenLighten(detail?.color);
  const { sidebarMiniMode, sidebarBoxedMode } = useSoraSettings();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const { scrollPosition, viewportRef } = useLayoutScrollPosition((scrollState) => scrollState);
  const { setBackgroundColor, setStartChangeScrollPosition, startChangeScrollPosition } =
    useHeaderStyle((headerState) => headerState);
  const tabLinkRef = useRef<HTMLDivElement>(null);
  const tabLinkIntersection = useIntersectionObserver(tabLinkRef, {
    root: viewportRef,
    rootMargin: sidebarBoxedMode ? '-180px 0px 0px 0px' : '-165px 0px 0px 0px',
    threshold: [1],
  });
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
  const [size, backgroundRef] = useMeasure<HTMLDivElement>();
  useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (
      viewportRef?.current &&
      tabLinkIntersection?.intersectionRatio !== undefined &&
      tabLinkIntersection?.intersectionRatio < 1 &&
      tabLinkIntersection?.boundingClientRect?.top < 500
    ) {
      setStartChangeScrollPosition(viewportRef?.current?.scrollTop);
    }
  }, [tabLinkIntersection, viewportRef]);

  useEffect(() => {
    if (startChangeScrollPosition) {
      setBackgroundColor(backgroundColor);
    }
  }, [backgroundColor, scrollPosition, startChangeScrollPosition]);

  const currentTime = state && (state as { currentTime: number }).currentTime;
  const backgroundImageHeight = isSm ? 100 : 300;

  return (
    <div className="w-full">
      <div
        ref={backgroundRef}
        className={backgroundImageStyles({
          sidebarMiniMode: sidebarMiniMode.value,
          sidebarBoxedMode: sidebarBoxedMode.value,
        })}
        style={{
          backgroundImage: `url(${
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:3001'
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
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height:
              scrollPosition?.y && backgroundImageHeight + scrollPosition?.y > 800
                ? 800
                : scrollPosition?.y && backgroundImageHeight + scrollPosition?.y < 800
                ? backgroundImageHeight + scrollPosition?.y
                : backgroundImageHeight,
            backgroundImage: `linear-gradient(to top, ${backgroundColor}, ${tinycolor(
              backgroundColor,
            ).setAlpha(0)})`,
          }}
        />
      </div>
      <div className="w-full relative top-[-80px] sm:top-[-200px]">
        <MediaDetail
          type="movie"
          item={detail}
          handler={Handler}
          translations={translations}
          imdbRating={imdbRating}
          color={detail.color}
        />
        <div className="w-full flex flex-col justify-center items-center">
          <div
            className="w-full flex justify-center top-[64px] sticky z-[1000] transition-[padding] duration-100 ease-in-out"
            style={{
              backgroundColor,
              paddingTop: `${
                startChangeScrollPosition === 0
                  ? 1
                  : scrollPosition?.y - startChangeScrollPosition > 0 &&
                    scrollPosition?.y - startChangeScrollPosition < 100 &&
                    startChangeScrollPosition > 0
                  ? 1 - (scrollPosition?.y - startChangeScrollPosition) / 100
                  : scrollPosition?.y - startChangeScrollPosition > 100
                  ? 0
                  : 1
              }rem`,
              paddingBottom: `${
                startChangeScrollPosition === 0
                  ? 2
                  : scrollPosition?.y - startChangeScrollPosition > 0 &&
                    scrollPosition?.y - startChangeScrollPosition < 100 &&
                    startChangeScrollPosition > 0
                  ? 2 - (scrollPosition?.y - startChangeScrollPosition) / 100
                  : scrollPosition?.y - startChangeScrollPosition > 100
                  ? 0
                  : 2
              }rem`,
            }}
            ref={tabLinkRef}
          >
            <BackgroundTabLink css={{ backgroundColor, zIndex: 1 }} />
            <TabLink pages={movieTvDetailsPages} linkTo={`/movies/${detail?.id}`} />
          </div>
          <Outlet />
        </div>
      </div>
      <WatchTrailerModal
        trailer={trailer}
        visible={visible}
        closeHandler={closeHandler}
        currentTime={Number(currentTime)}
      />
    </div>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default MovieDetail;
