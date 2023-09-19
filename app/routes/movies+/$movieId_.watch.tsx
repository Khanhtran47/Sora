import type { ISource } from '@consumet/extensions';
import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import Vibrant from 'node-vibrant';

import type { Handle } from '~/types/handle';
import {
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
  getKissKhInfo,
} from '~/services/kisskh/kisskh.server';
import { loklokGetMovieInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import { authenticate, insertHistory } from '~/services/supabase';
import {
  // getTranslations,
  getImdbRating,
  getMovieDetail,
  getRecommendation,
  getWatchEpisode,
} from '~/services/tmdb/tmdb.server';
import { TMDB as TmdbUtils } from '~/services/tmdb/utils.server';
// import i18next from '~/i18n/i18next.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import ErrorBoundaryView from '~/components/elements/shared/ErrorBoundaryView';
import WatchDetail from '~/components/elements/shared/WatchDetail';

export const meta = mergeMeta<typeof loader>(({ data, params }) => {
  if (!data) {
    return [
      { title: 'Missing Movie' },
      { name: 'description', content: `There is no movie with the ID: ${params.movieId}` },
    ];
  }
  const { detail } = data || {};
  const { title, overview } = detail || {};
  const movieTitle = title || '';
  return [
    { title: `Sora - Watch ${movieTitle}` },
    { name: 'description', content: overview },
    {
      name: 'keywords',
      content: `Watch ${movieTitle}, Stream ${movieTitle}, Watch ${movieTitle} HD, Online ${movieTitle}, Streaming ${movieTitle}, English, Subtitle ${movieTitle}, English Subtitle`,
    },
    { property: 'og:url', content: `https://sorachill.vercel.app/movies/${params.movieId}/watch` },
    { property: 'og:title', content: `Sora - Watch ${movieTitle}` },
    { property: 'og:description', content: overview },
    {
      property: 'og:image',
      content: `https://sorachill.vercel.app/api/ogimage?m=${params.movieId}&mt=movie`,
    },
    { name: 'twitter:title', content: `Sora - Watch ${movieTitle}` },
    { name: 'twitter:description', content: overview },
    {
      name: 'twitter:image',
      content: `https://sorachill.vercel.app/api/ogimage?m=${params.movieId}&mt=movie`,
    },
  ];
});

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
  const extractColorImageUrl =
    process.env.NODE_ENV === 'development'
      ? TMDB.backdropUrl(detail?.backdrop_path || detail?.poster_path || '', 'w300')
      : `https://corsproxy.io/?${encodeURIComponent(
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
      detail?.imdb_id && process.env.IMDB_API_URL !== undefined
        ? getImdbRating(detail?.imdb_id)
        : undefined,
      fetch(extractColorImageUrl),
    ]);
    const fimgb = Buffer.from(await fimg.arrayBuffer());
    const palette =
      (detail?.backdrop_path || detail?.poster_path) && fimgb
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
    const getId = (id: string) => {
      const idArr = id.split('-');
      return idArr[idArr.length - 1];
    };
    const [movieStreamLink, imdbRating, fimg] = await Promise.all([
      getWatchEpisode(idProvider, getId(idProvider)),
      detail?.imdb_id && process.env.IMDB_API_URL !== undefined
        ? getImdbRating(detail?.imdb_id)
        : undefined,
      fetch(extractColorImageUrl),
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
        sources: (movieStreamLink as ISource)?.sources,
        subtitles: (movieStreamLink as ISource)?.subtitles,
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
      detail?.imdb_id && process.env.IMDB_API_URL !== undefined
        ? getImdbRating(detail?.imdb_id)
        : undefined,
      fetch(extractColorImageUrl),
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
    detail?.imdb_id && process.env.IMDB_API_URL !== undefined
      ? getImdbRating(detail?.imdb_id)
      : undefined,
    fetch(extractColorImageUrl),
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

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <>
      <BreadcrumbItem
        to={`/movies/${match.params.movieId}/`}
        key={`movies-${match.params.movieId}-overview`}
      >
        {match.data?.detail?.title || match.params.movieId}
      </BreadcrumbItem>
      <BreadcrumbItem
        to={`/movies/${match.params.movieId}/watch`}
        key={`movies-${match.params.movieId}-watch`}
      >
        {t('watch')}
      </BreadcrumbItem>
    </>
  ),
  playerSettings: {
    isMini: false,
    shouldShowPlayer: true,
  },
  miniTitle: ({ match, t }) => ({
    title: match.data?.detail?.title,
    subtitle: t('watch'),
    showImage: match.data?.detail?.poster_path !== undefined,
    imageUrl: TMDB.posterUrl(match.data?.detail?.poster_path || '', 'w92'),
  }),
};

const MovieWatch = () => {
  const { detail, recommendations, imdbRating, color } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const id = detail && detail.id;
  const releaseYear = new Date(detail?.release_date ?? '').getFullYear();
  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center px-3 sm:px-0">
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
    </div>
  );
};

export function ErrorBoundary() {
  return (
    <ErrorBoundaryView
      statusHandlers={{
        404: ({ params }) => <p>There is no movie with the ID: {params.movieId}</p>,
      }}
    />
  );
}

export default MovieWatch;
