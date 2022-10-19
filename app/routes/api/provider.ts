/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { getMovieSearch } from '~/services/consumet/flixhq/flixhq.server';
import { loklokSearchMovie } from '~/services/loklok';
import { IMovieResult } from '~/services/consumet/flixhq/flixhq.types';

type LoaderData = {
  provider: {
    id?: string | number;
    provider: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const title = url.searchParams.get('title');
  const orgTitle = url.searchParams.get('orgTitle');
  const year = url.searchParams.get('year');
  if (!title) throw new Response('No title', { status: 400 });
  // const search = await getMovieSearch(title);
  const [search, loklokSearch] = await Promise.all([
    getMovieSearch(title),
    loklokSearchMovie(title, orgTitle || '', Number(year)),
  ]);
  let provider = [];
  const findFlixhq: IMovieResult | undefined = search?.results.find(
    (movie) =>
      movie.title === title &&
      movie?.releaseDate === year &&
      type &&
      movie.type.toLowerCase().includes(type),
  );
  if (findFlixhq && findFlixhq.id)
    provider.push({
      id: findFlixhq.id,
      provider: 'Flixhq',
    });
  if (loklokSearch?.data.name === title)
    provider.push({
      id: loklokSearch.data.id,
      provider: 'Loklok',
    });
  if (provider && provider.length > 0)
    return json<LoaderData>({
      provider,
    });
  return json<LoaderData>({
    provider: [{ provider: 'Embed' }],
  });
};
