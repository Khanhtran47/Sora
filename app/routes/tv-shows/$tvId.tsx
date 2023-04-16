/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { useState, useRef, useEffect } from 'react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
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
import { useIntersectionObserver } from '@react-hookz/web';

import { getTvShowDetail, getTvShowIMDBId, getImdbRating } from '~/services/tmdb/tmdb.server';
import { authenticate } from '~/services/supabase';
import i18next from '~/i18n/i18next.server';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useCustomHeaderChangePosition } from '~/hooks/useHeader';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';

import { CACHE_CONTROL } from '~/utils/server/http';
import TMDB from '~/utils/media';

import { MediaDetail, MediaBackgroundImage } from '~/components/media/MediaDetail';
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
  ),
  miniTitle: (match: RouteMatch) => ({
    title: match.data?.detail?.name,
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
  const fetcher = useFetcher();
  const { state } = useLocation();
  const [visible, setVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const { backgroundColor } = useColorDarkenLighten(detail?.color);
  const { sidebarBoxedMode } = useSoraSettings();
  const { scrollPosition, viewportRef } = useLayoutScrollPosition((scrollState) => scrollState);
  const { setBackgroundColor, startChangeScrollPosition } = useHeaderStyle(
    (headerStyle) => headerStyle,
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
  }, [backgroundColor, startChangeScrollPosition]);

  const currentTime = state && (state as { currentTime: number | undefined }).currentTime;
  const backdropPath = detail?.backdrop_path
    ? TMDB?.backdropUrl(detail?.backdrop_path || '', 'w1280')
    : undefined;
  const Handler = (id: number) => {
    setVisible(true);
    fetcher.load(`/tv-shows/${id}/videos`);
  };
  const closeHandler = () => {
    setVisible(false);
    setTrailer({});
  };

  return (
    <>
      <MediaBackgroundImage backdropPath={backdropPath} backgroundColor={backgroundColor} />
      <div className="w-full relative top-[-80px] sm:top-[-200px]">
        <MediaDetail
          type="tv"
          item={detail}
          handler={Handler}
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
            <TabLink pages={movieTvDetailsPages} linkTo={`/tv-shows/${detail?.id}`} />
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
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default TvShowDetail;
