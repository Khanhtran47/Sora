/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { getMovieSearch } from '~/services/consumet/flixhq/flixhq.server';
import { loklokSearchMovie, loklokSearchTv } from '~/services/loklok';
import { ILoklokSearchData } from '~/services/loklok/loklok.type';
import { IMovieResult } from '~/services/consumet/flixhq/flixhq.types';

type LoaderData = {
  provider: {
    id?: string | number | null;
    provider: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const title = url.searchParams.get('title');
  const orgTitle = url.searchParams.get('orgTitle');
  const year = url.searchParams.get('year');
  const season = url.searchParams.get('season');
  const episodeId = url.searchParams.get('episodeId');
  if (!title) throw new Response('No title', { status: 400 });
  if (type === 'movie') {
    const [search, loklokSearch] = await Promise.all([
      getMovieSearch(title),
      loklokSearchMovie(title, orgTitle || '', Number(year)),
    ]);
    let provider = [];
    const findFlixhq: IMovieResult | undefined = search?.results.find((movie) => {
      return (
        movie.title.toLowerCase() === title.toLowerCase() &&
        movie?.releaseDate === year &&
        movie?.type === 'Movie'
      );
    });
    if (findFlixhq && findFlixhq.id)
      provider.push({
        id: findFlixhq.id,
        provider: 'Flixhq',
      });
    if (loklokSearch?.data.name.toLowerCase() === title.toLowerCase())
      provider.push({
        id: loklokSearch.data.id,
        provider: 'Loklok',
      });
    if (provider && provider.length > 0)
      return json<LoaderData>({
        provider,
      });
  }
  if (type === 'tv') {
    const [search, loklokSearch] = await Promise.all([
      getMovieSearch(title),
      loklokSearchTv(title),
    ]);
    let provider = [];
    const findFlixhq: IMovieResult | undefined = search?.results.find((movie) => {
      return movie.title.toLowerCase() === title.toLowerCase() && movie?.type === 'TV Series';
    });
    if (findFlixhq && findFlixhq.id)
      provider.push({
        id: findFlixhq.id,
        provider: 'Flixhq',
      });
    const findLoklok = loklokSearch.find((movie: ILoklokSearchData) => {
      return (
        movie.name.toLowerCase() === title.toLowerCase() ||
        movie.name.toLowerCase() === `${title} Season ${season}`.toLowerCase() ||
        movie.name.toLowerCase() === `${title} Part ${season}`.toLowerCase() ||
        (movie.name.toLowerCase().includes(title.toLowerCase()) && movie?.releaseTime === year)
      );
    });
    if (findLoklok && findLoklok.id)
      provider.push({
        id: findLoklok.id,
        provider: 'Loklok',
      });
    if (provider && provider.length > 0)
      return json<LoaderData>({
        provider,
      });
  }
  if (type === 'anime') {
    const loklokSearch = await loklokSearchTv(title);
    let provider = [
      {
        id: episodeId,
        provider: 'Gogo',
      },
      {
        id: episodeId,
        provider: 'Zoro',
      },
    ];
    const findLoklok = loklokSearch.find((movie: ILoklokSearchData) => {
      return (
        movie.name.toLowerCase() === title.toLowerCase() ||
        movie.name.toLowerCase() === `${title} Season ${season}`.toLowerCase() ||
        movie.name.toLowerCase() === `${title} Part ${season}`.toLowerCase() ||
        (movie.name.toLowerCase().includes(title.toLowerCase()) && movie?.releaseTime === year)
      );
    });
    if (findLoklok && findLoklok.id)
      provider.push({
        id: findLoklok.id,
        provider: 'Loklok',
      });
    if (provider && provider.length > 0)
      return json<LoaderData>({
        provider,
      });
  }
  return json<LoaderData>({
    provider: [{ provider: 'Embed' }],
  });
};
