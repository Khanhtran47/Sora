/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';

import sgConfigs from '~/services/configs.server';
import { authenticate } from '~/services/supabase';
import { getMovieSearch } from '~/services/consumet/flixhq/flixhq.server';
import { loklokSearchMovie, loklokSearchOneTv } from '~/services/loklok';
import { getBilibiliSearch } from '~/services/consumet/bilibili/bilibili.server';
import { IBilibiliResult } from '~/services/consumet/bilibili/bilibili.types';
import { getKissKhSearch } from '~/services/kisskh/kisskh.server';
import { ISearchItem } from '~/services/kisskh/kisskh.types';
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
    const [search, loklokSearch, kisskhSearch] = await Promise.all([
      getMovieSearch(title),
      sgConfigs.__loklokProvider
        ? loklokSearchMovie(title, orgTitle || '', Number(year))
        : undefined,
      getKissKhSearch(title),
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

    const findKissKh: ISearchItem | undefined = kisskhSearch?.find((item) =>
      item.title.includes(' (')
        ? item.title.replace(/ *\([^)]*\) */g, '').toLowerCase() === title.toLowerCase()
        : item.title.toLowerCase() === title.toLowerCase(),
    );
    if (findKissKh && findKissKh.id)
      provider.push({
        id: findKissKh.id,
        provider: 'KissKh',
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
    const [search, loklokSearch, kisskhSearch] = await Promise.all([
      getMovieSearch(title),
      sgConfigs.__loklokProvider
        ? loklokSearchOneTv(title, orgTitle || '', Number(year), Number(season))
        : undefined,
      getKissKhSearch(title),
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

    const findKissKh: ISearchItem | undefined = kisskhSearch?.find((item) => {
      if (item?.title.includes('Season')) {
        const [itemTitle, seasonNumber] = item?.title.split(' - Season ');
        return (
          itemTitle.toLowerCase() === title.toLowerCase() && Number(seasonNumber) === Number(season)
        );
      }
      return item?.title.toLowerCase() === title.toLowerCase();
    });
    if (findKissKh && findKissKh.id)
      provider.push({
        id: findKissKh.id,
        provider: 'KissKh',
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
    const [bilibiliSearch, loklokSearch, kisskhSearch] = await Promise.all([
      sgConfigs.__bilibiliProvider ? getBilibiliSearch(title) : undefined,
      sgConfigs.__loklokProvider
        ? loklokSearchOneTv(title, orgTitle || '', Number(year))
        : undefined,
      getKissKhSearch(title, 3),
    ]);
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

    let findKissKh: ISearchItem | undefined = kisskhSearch?.find((item) =>
      item.title.includes(' - ') ? item.title.split(' - ')[1] === title : item.title === title,
    );
    if (findKissKh && findKissKh.id)
      provider.push({
        id: findKissKh.id.toString(),
        provider: 'KissKh',
      });

    let findBilibili: IBilibiliResult | undefined = bilibiliSearch?.results.find((anime) => {
      if (anime.title.includes('×')) {
        return (
          anime.title.replace(/×/g, 'x').toLowerCase() === title.replace(/\s/g, '').toLowerCase()
        );
      }
      return anime.title.toLowerCase() === title.toLowerCase();
    });
    if (findBilibili && findBilibili.id) {
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
