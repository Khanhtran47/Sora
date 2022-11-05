/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, redirect } from '@remix-run/node';

import sgConfigs from '~/services/configs.server';
import { authenticate } from '~/services/supabase';
import { getMovieSearch } from '~/services/consumet/flixhq/flixhq.server';
import { loklokSearchMovie, loklokSearchOneTv } from '~/services/loklok';
import { IMovieResult } from '~/services/consumet/flixhq/flixhq.types';

type LoaderData = {
  provider: {
    id?: string | number | null;
    provider: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticate(request);

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
      sgConfigs.__loklokProvider
        ? loklokSearchMovie(title, orgTitle || '', Number(year))
        : undefined,
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
      sgConfigs.__loklokProvider
        ? loklokSearchOneTv(title, orgTitle || '', Number(year), Number(season))
        : undefined,
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
    if (loklokSearch && loklokSearch?.data?.id)
      provider.push({
        id: loklokSearch?.data?.id,
        provider: 'Loklok',
      });
    if (provider && provider.length > 0)
      return json<LoaderData>({
        provider,
      });
  }
  if (type === 'anime') {
    const loklokSearch = sgConfigs.__loklokProvider
      ? await loklokSearchOneTv(title, orgTitle || '', Number(year))
      : undefined;
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
    if (loklokSearch && loklokSearch?.data?.id)
      provider.push({
        id: loklokSearch?.data?.id,
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
