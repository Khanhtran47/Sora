/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { MetaFunction, json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useCatch, useLoaderData, NavLink, RouteMatch } from '@remix-run/react';
import { Container, Spacer, Badge } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import Vibrant from 'node-vibrant';

import { authenticate, insertHistory } from '~/services/supabase';
import {
  getMovieDetail,
  getRecommendation,
  // getTranslations,
  getImdbRating,
} from '~/services/tmdb/tmdb.server';
import { getMovieInfo, getMovieEpisodeStreamLink } from '~/services/consumet/flixhq/flixhq.server';
import {
  getKissKhInfo,
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
} from '~/services/kisskh/kisskh.server';
import { loklokGetMovieInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
// import i18next from '~/i18n/i18next.server';
import TMDB from '~/utils/media';
import { TMDB as TmdbUtils } from '~/services/tmdb/utils.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import WatchDetail from '~/components/elements/shared/WatchDetail';
import CatchBoundaryView from '~/components/CatchBoundaryView';
import ErrorBoundaryView from '~/components/ErrorBoundaryView';

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Movie',
      description: `There is no movie with the ID: ${params.movieId}`,
    };
  }
  const { detail, color } = data || {};
  return {
    title: `Watch ${detail?.title || ''} HD online Free - Sora`,
    description: `Watch ${detail?.title || ''} in full HD online with Subtitle`,
    keywords: `Watch ${detail?.title || ''}, Stream ${detail?.title || ''}, Watch ${
      detail?.title || ''
    } HD, Online ${detail?.title || ''}, Streaming ${detail?.title || ''}, English, Subtitle ${
      detail?.title || ''
    }, English Subtitle`,
    ...(color ? { 'theme-color': color } : null),
    'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/watch`,
    'og:title': `Watch ${detail?.title || ''} HD online Free - Sora`,
    'og:description': `Watch ${detail?.title || ''} in full HD online with Subtitle`,
    'og:image': detail?.backdrop_path ? TMDB.backdropUrl(detail?.backdrop_path, 'w780') : undefined,
    refresh: {
      httpEquiv: 'Content-Security-Policy',
      content: 'upgrade-insecure-requests',
    },
  };
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticate(request, true, true, true);

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const routePlayer = `${url.pathname}${url.search}`;
  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid || !provider || !idProvider) throw new Response('Not Found', { status: 404 });
  const [detail, recommendations] = await Promise.all([
    getMovieDetail(mid),
    getRecommendation('movie', mid),
  ]);
  if (!detail) throw new Response('Not Found', { status: 404 });
  const titlePlayer = detail?.title || detail?.original_title || '';
  const posterPlayer = TmdbUtils.backdropUrl(detail?.backdrop_path || '', 'w1280');
  const subtitleOptions = {
    tmdb_id: detail?.id,
    type: 'movie',
    title: detail?.title,
    sub_format: provider === 'KissKh' ? 'srt' : 'webvtt',
  };
  const overview = detail?.overview || undefined;
  const extractColorImage = `https://corsproxy.io/?${encodeURIComponent(
    TMDB.backdropUrl(detail?.backdrop_path || detail?.poster_path || '', 'w300'),
  )}`;

  if (user) {
    insertHistory({
      user_id: user.id,
      media_type: 'movie',
      duration: (detail?.runtime || 0) * 60,
      watched: 0,
      route: url.pathname + url.search,
      media_id: (detail?.id || mid).toString(),
      poster: TMDB.backdropUrl(detail?.backdrop_path || '', 'w300'),
      title: detail?.title || detail?.original_title || undefined,
      overview: detail?.overview || undefined,
    });
  }

  if (provider === 'Loklok') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [movieDetail, imdbRating, fimg] = await Promise.all([
      loklokGetMovieInfo(idProvider),
      detail?.imdb_id ? getImdbRating(detail?.imdb_id) : undefined,
      fetch(extractColorImage),
    ]);
    const fimgb = Buffer.from(await fimg.arrayBuffer());
    const palette =
      detail?.backdrop_path || detail?.poster_path
        ? await Vibrant.from(fimgb).getPalette()
        : undefined;
    return json(
      {
        provider,
        detail,
        recommendations,
        imdbRating,
        sources: movieDetail?.sources,
        subtitles: movieDetail?.subtitles.map((sub) => ({
          lang: `${sub.language} (${sub.lang})`,
          url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
        })),
        userId: user?.id,
        routePlayer,
        titlePlayer,
        id: mid,
        posterPlayer,
        typeVideo: 'movie',
        subtitleOptions,
        overview,
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.watch,
        },
      },
    );
  }

  if (provider === 'Flixhq') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [movieDetail, imdbRating, fimg] = await Promise.all([
      getMovieInfo(idProvider),
      detail?.imdb_id ? getImdbRating(detail?.imdb_id) : undefined,
      fetch(extractColorImage),
    ]);
    const fimgb = Buffer.from(await fimg.arrayBuffer());
    const [movieStreamLink, palette] = await Promise.all([
      getMovieEpisodeStreamLink(movieDetail?.episodes[0].id || '', movieDetail?.id || ''),
      detail?.backdrop_path || detail?.poster_path
        ? await Vibrant.from(fimgb).getPalette()
        : undefined,
    ]);
    return json(
      {
        provider,
        detail,
        recommendations,
        imdbRating,
        data: movieDetail,
        sources: movieStreamLink?.sources,
        subtitles: movieStreamLink?.subtitles,
        userId: user?.id,
        routePlayer,
        titlePlayer,
        id: mid,
        posterPlayer,
        typeVideo: 'movie',
        subtitleOptions,
        overview,
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.watch,
        },
      },
    );
  }

  if (provider === 'KissKh') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [episodeDetail, imdbRating, fimg] = await Promise.all([
      getKissKhInfo(Number(idProvider)),
      detail?.imdb_id ? getImdbRating(detail?.imdb_id) : undefined,
      fetch(extractColorImage),
    ]);
    const fimgb = Buffer.from(await fimg.arrayBuffer());
    const [episodeStream, episodeSubtitle, palette] = await Promise.all([
      getKissKhEpisodeStream(Number(episodeDetail?.episodes[0]?.id)),
      episodeDetail?.episodes[0] && episodeDetail?.episodes[0].sub > 0
        ? getKissKhEpisodeSubtitle(Number(episodeDetail?.episodes[0]?.id))
        : undefined,
      detail?.backdrop_path || detail?.poster_path
        ? await Vibrant.from(fimgb).getPalette()
        : undefined,
    ]);

    return json(
      {
        provider,
        detail,
        recommendations,
        imdbRating,
        sources: [{ url: episodeStream?.Video || '', isM3U8: true, quality: 'auto' }],
        subtitles: episodeSubtitle?.map((sub) => ({
          lang: sub.label,
          url: sub.src,
          ...(sub.default && { default: true }),
        })),
        userId: user?.id,
        routePlayer,
        titlePlayer,
        id: mid,
        posterPlayer,
        typeVideo: 'movie',
        subtitleOptions,
        overview,
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.watch,
        },
      },
    );
  }
  const [imdbRating, fimg] = await Promise.all([
    detail?.imdb_id ? getImdbRating(detail?.imdb_id) : undefined,
    fetch(extractColorImage),
  ]);
  const fimgb = Buffer.from(await fimg.arrayBuffer());
  const palette =
    detail?.backdrop_path || detail?.poster_path
      ? await Vibrant.from(fimgb).getPalette()
      : undefined;
  return json(
    {
      detail,
      recommendations,
      imdbRating,
      userId: user?.id,
      routePlayer,
      titlePlayer,
      id: mid,
      posterPlayer,
      typeVideo: 'movie',
      subtitleOptions,
      overview,
      color: palette
        ? Object.values(palette).sort((a, b) =>
            a?.population === undefined || b?.population === undefined
              ? 0
              : b.population - a.population,
          )[0]?.hex
        : undefined,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.watch,
      },
    },
  );
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
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
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink to={`/movies/${match.params.movieId}/watch`}>
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
            Watch
          </Badge>
        )}
      </NavLink>
    </>
  ),
  playerSettings: {
    isMini: false,
    shouldShowPlayer: true,
  },
};

const MovieWatch = () => {
  const { detail, recommendations, imdbRating, color } = useLoaderData<typeof loader>();
  const rootData:
    | {
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const id = detail && detail.id;
  const releaseYear = new Date(detail?.release_date || '').getFullYear();
  return (
    <Container
      fluid
      alignItems="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: '0 0.75rem',
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
      <WatchDetail
        id={Number(id)}
        type="movie"
        title={`${detail?.title} (${releaseYear})`}
        overview={detail?.overview || ''}
        posterPath={detail?.poster_path ? TMDB.posterUrl(detail?.poster_path, 'w342') : undefined}
        tmdbRating={detail?.vote_average}
        imdbRating={imdbRating?.star}
        genresMedia={detail?.genres}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        recommendationsMovies={recommendations?.items}
        color={color}
      />
    </Container>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default MovieWatch;
