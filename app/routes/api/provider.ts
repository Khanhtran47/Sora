/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, redirect } from '@remix-run/node';

import sgConfigs from '~/services/configs.server';
import { authenticate } from '~/services/supabase';
import { getMovieSearch } from '~/services/consumet/flixhq/flixhq.server';
import { loklokSearchMovie, loklokSearchOneTv } from '~/services/loklok';
import { getBilibiliSearch } from '~/services/consumet/bilibili/bilibili.server';
import { IBilibiliResult } from '~/services/consumet/bilibili/bilibili.types';
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
    const [bilibiliSearch, loklokSearch] = await Promise.all([
      getBilibiliSearch(title),
      sgConfigs.__loklokProvider
        ? loklokSearchOneTv(title, orgTitle || '', Number(year))
        : undefined,
    ]);
    console.log(
      '🚀 ~ file: provider.ts ~ line 93 ~ constloader:LoaderFunction= ~ bilibiliSearch',
      bilibiliSearch,
    );
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
    let findBilibili: IBilibiliResult | undefined = bilibiliSearch?.results.find(
      (anime) => anime.title.toLowerCase() === title.toLowerCase(),
    );
    if (findBilibili && findBilibili.id) {
      provider.push({
        id: findBilibili.id.toString(),
        provider: 'Bilibili',
      });
    } else {
      findBilibili = bilibiliSearch?.results.find(
        (anime) =>
          anime.title.replace(/×/g, 'x').toLowerCase() === title.replace(/\s/g, '').toLowerCase(),
      );
      if (findBilibili && findBilibili.id)
        provider.push({
          id: findBilibili.id.toString(),
          provider: 'Bilibili',
        });
    }
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
