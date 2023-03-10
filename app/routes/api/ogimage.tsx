import type { LoaderArgs, HeadersFunction } from '@remix-run/node';
import { badRequest } from 'remix-utils';

import { getMovieDetail, getTvShowDetail } from '~/services/tmdb/tmdb.server';
import { IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';

import { generateSvg, generateMovieSvg, generatePng } from '~/utils/server/og.server';
import TMDB from '~/utils/media';

import HomeOgImage from '~/assets/images/home-ogimage.jpg';

export let headers: HeadersFunction = () => {
  return { 'Cache-Control': 'public, max-age=31536000, immutable' };
};

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  let mid = url.searchParams.get('m') ?? null;
  let mType = url.searchParams.get('mt') ?? null;
  let imageType = url.searchParams.get('it') ?? null;

  if (mid && mType && !imageType) {
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
    return generatePng(svg);
  }
  if (!mid && !mType && imageType) {
    let title;
    let cover;
    switch (imageType) {
      case 'home':
        title = 'SORA';
        cover =
          'https://raw.githubusercontent.com/Khanhtran47/Sora/master/app/assets/images/background-default.jpg';
        break;
      case 'movies':
        title = 'SORA Movies';
        cover =
          'https://image.tmdb.org/t/p/w1280_filter(duotone,190235,ad47dd)/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg';
        break;
      case 'tvshows':
        title = 'SORA TV Shows';
        cover =
          'https://image.tmdb.org/t/p/w1280_filter(duotone,00192f,00baff)/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg';
        break;
      case 'people':
        title = 'SORA People';
        cover =
          'https://image.tmdb.org/t/p/w1280_filter(duotone,190235,ad47dd)/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg';
        break;
      case 'anime':
        title = 'SORA Anime';
        cover =
          'https://image.tmdb.org/t/p/w1280_filter(duotone,00192f,00baff)/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg';
        break;
      case 'search':
        title = 'SORA Search';
        cover =
          'https://image.tmdb.org/t/p/w1280_filter(duotone,00192f,00baff)/Vq4L8A88fNQxBqM27xHtDi4DrL.jpg';
        break;
      default:
        title = 'SORA';
        cover =
          'https://raw.githubusercontent.com/Khanhtran47/Sora/master/app/assets/images/background-default.jpg';
        break;
    }

    const svg = await generateSvg({
      title,
      cover,
    });
    return generatePng(svg);
  }
  throw badRequest({ message: 'Invalid request' });
}
