import type { MetaFunction, LoaderArgs, HeadersFunction } from '@remix-run/node';
import { renderAsync } from '@resvg/resvg-js';

import { getMovieDetail, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import { IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import { generateSvg } from '~/utils/server/og.server';
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

    const svg = await generateSvg({
      title,
    });
    if (imageType === 'svg') {
      return new Response(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
    // otherwise, generate a png file
    const data = await renderAsync(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
      font: {
        loadSystemFonts: false,
      },
    });
    return new Response(data.asPng(), {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  }

  const svg = await generateSvg({
    title: 'Test',
    subtitle: 'Test',
  });

  if (imageType === 'svg') {
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }
  // otherwise, generate a png file
  const data = await renderAsync(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
    font: {
      loadSystemFonts: false,
    },
  });
  return new Response(data.asPng(), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
