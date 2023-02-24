import type { LoaderArgs, HeadersFunction } from '@remix-run/node';
import { renderAsync } from '@resvg/resvg-js';
import { join, resolve } from 'path';

import { getMovieDetail, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import { IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import { generateSvg, generateMovieSvg } from '~/utils/server/og.server';
import TMDB from '~/utils/media';

export let headers: HeadersFunction = () => {
  return { 'Cache-Control': 'public, max-age=31536000, immutable' };
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  let mid = url.searchParams.get('m') ?? null;
  let mType = url.searchParams.get('mt') ?? null;
  let imageType = url.searchParams.get('it') || 'svg';

  if (mid && mType) {
    const movieDetail =
      mType === 'movie' ? await getMovieDetail(Number(mid)) : await getTvShowDetail(Number(mid));
    const title =
      (movieDetail as IMovieDetail)?.title || (movieDetail as ITvShowDetail)?.name || '';
    const posterPath = movieDetail?.poster_path
      ? TMDB?.posterUrl(movieDetail?.poster_path || '', 'w342')
      : undefined;
    const backdropPath = movieDetail?.backdrop_path
      ? TMDB?.backdropUrl(movieDetail?.backdrop_path || '', 'w1280')
      : undefined;
    const releaseYear = new Date(
      (movieDetail as IMovieDetail)?.release_date ||
        (movieDetail as ITvShowDetail)?.first_air_date ||
        '',
    ).getFullYear();
    const svg = await generateMovieSvg({
      title,
      cover: backdropPath,
      poster: posterPath,
      voteAverage: movieDetail?.vote_average?.toFixed(1),
      genres: movieDetail?.genres?.splice(0, 4),
      releaseYear,
      numberOfEpisodes: (movieDetail as ITvShowDetail)?.number_of_episodes,
      numberOfSeasons: (movieDetail as ITvShowDetail)?.number_of_seasons,
      runtime: (movieDetail as IMovieDetail)?.runtime,
      productionCompany:
        (movieDetail as IMovieDetail)?.production_companies![0]?.name ||
        (movieDetail as ITvShowDetail)?.production_companies![0]?.name,
    });
    const image = await renderAsync(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
      font: {
        loadSystemFonts: false,
      },
    });
    return new Response(image.asPng(), {
      headers: {
        'content-type': 'image/png',
        'cache-control':
          process.env.NODE_ENV === 'development'
            ? 'no-cache, no-store'
            : 'public, immutable, no-transform, max-age=31536000',
      },
    });
  }
  const svg = await generateSvg({
    title: 'Test',
  });
  const image = await renderAsync(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
    font: {
      loadSystemFonts: false,
    },
  });
  return new Response(image.asPng(), {
    headers: {
      'content-type': 'image/png',
      'cache-control':
        process.env.NODE_ENV === 'development'
          ? 'no-cache, no-store'
          : 'public, immutable, no-transform, max-age=31536000',
    },
  });
}
