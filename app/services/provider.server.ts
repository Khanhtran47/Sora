/* eslint-disable @typescript-eslint/indent */
import { lruCache } from '~/services/lru-cache';
import sgConfigs from '~/services/configs.server';
import { getMovieSearch, getMovieInfo } from '~/services/consumet/flixhq/flixhq.server';
import { loklokSearchMovie, loklokSearchOneTv, getLoklokOrgDetail } from '~/services/loklok';
import { getBilibiliSearch, getBilibiliInfo } from '~/services/consumet/bilibili/bilibili.server';
import { IBilibiliResult } from '~/services/consumet/bilibili/bilibili.types';
import { getKissKhSearch, getKissKhInfo } from '~/services/kisskh/kisskh.server';
import { ISearchItem } from '~/services/kisskh/kisskh.types';
import { IMovieResult } from '~/services/consumet/flixhq/flixhq.types';
import { getAnimeEpisodeInfo } from '~/services/consumet/anilist/anilist.server';

const getProviderList = async (
  type: string,
  title: string,
  orgTitle?: string | null,
  year?: number | string | null,
  season?: number | string | null,
  animeId?: number,
  animeType?: string | null,
): Promise<
  | {
      id?: string | number | null;
      provider: string;
      episodesCount?: number;
    }[]
  | undefined
> => {
  const cacheKey = `${type}-${title}-${orgTitle}-${year}-${season}`;
  if (lruCache) {
    const cacheProvider = lruCache.get<
      | {
          id?: string | number | null;
          provider: string;
          episodesCount: number;
        }[]
      | undefined
    >(cacheKey);
    if (cacheProvider) {
      console.info('Cache provider', cacheKey);
      return cacheProvider;
    }
  }
  if (type === 'movie') {
    const [search, loklokSearch, kisskhSearch] = await Promise.all([
      getMovieSearch(title),
      sgConfigs.__loklokProvider
        ? loklokSearchMovie(title, orgTitle || '', Number(year))
        : undefined,
      sgConfigs.__kisskhProvider ? getKissKhSearch(title) : undefined,
    ]);
    const provider = [];
    const findFlixhq: IMovieResult | undefined = search?.results.find(
      (movie) =>
        movie.title.toLowerCase() === title.toLowerCase() &&
        movie?.releaseDate === year &&
        movie?.type === 'Movie',
    );
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
    if (lruCache) lruCache.set(cacheKey, provider);
    return provider;
  }
  if (type === 'tv') {
    const [search, loklokSearch, kisskhSearch] = await Promise.all([
      getMovieSearch(title),
      sgConfigs.__loklokProvider
        ? loklokSearchOneTv(
            `${title} ${Number(season) > 1 ? `Season ${season}` : ''}`,
            orgTitle || '',
            Number(year),
            Number(season),
          )
        : undefined,
      sgConfigs.__kisskhProvider ? getKissKhSearch(title) : undefined,
    ]);
    const provider = [];
    const findFlixhq: IMovieResult | undefined = search?.results.find(
      (movie) => movie.title.toLowerCase() === title.toLowerCase() && movie?.type === 'TV Series',
    );
    const findKissKh: ISearchItem | undefined = kisskhSearch?.find((item) => {
      if (item && item.title && item.title.includes('Season')) {
        const [itemTitle, seasonNumber] = item.title.split(' - Season ');
        return (
          itemTitle.toLowerCase() === title.toLowerCase() && Number(seasonNumber) === Number(season)
        );
      }
      return item?.title.toLowerCase() === title.toLowerCase();
    });
    const [flixhqDetail, loklokDetail, kissKhDetail] = await Promise.all([
      findFlixhq && findFlixhq.id ? getMovieInfo(findFlixhq.id) : undefined,
      loklokSearch && loklokSearch.data?.id
        ? getLoklokOrgDetail(loklokSearch.data.id, 'tv')
        : undefined,
      findKissKh && findKissKh.id ? getKissKhInfo(findKissKh.id) : undefined,
    ]);
    if (findFlixhq && findFlixhq.id)
      provider.push({
        id: findFlixhq.id,
        provider: 'Flixhq',
        episodesCount: flixhqDetail?.episodes
          ? flixhqDetail.episodes.filter((episode) => episode.season === Number(season)).length
          : 0,
      });
    if (findKissKh && findKissKh.id)
      provider.push({
        id: findKissKh.id,
        provider: 'KissKh',
        episodesCount: kissKhDetail?.episodesCount || 0,
      });
    if (loklokSearch && loklokSearch?.data?.id)
      provider.push({
        id: loklokSearch?.data?.id,
        provider: 'Loklok',
        episodesCount: loklokDetail?.episodeVo ? loklokDetail.episodeVo.length : 0,
      });
    if (lruCache) lruCache.set(cacheKey, provider);
    return provider;
  }
  if (type === 'anime') {
    const [bilibiliSearch, loklokSearch, kisskhSearch, animeEpisodes] = await Promise.all([
      sgConfigs.__bilibiliProvider ? getBilibiliSearch(title) : undefined,
      sgConfigs.__loklokProvider
        ? loklokSearchOneTv(title, orgTitle || '', Number(year))
        : undefined,
      sgConfigs.__kisskhProvider ? getKissKhSearch(title, 3) : undefined,
      getAnimeEpisodeInfo(animeId),
    ]);
    const provider: {
      id?: string | number | null;
      provider: string;
      episodesCount?: number;
    }[] = [
      {
        id: animeId,
        provider: 'Gogo',
        episodesCount: animeEpisodes ? animeEpisodes.length : 0,
      },
      {
        id: animeId,
        provider: 'Zoro',
        episodesCount: animeEpisodes ? animeEpisodes.length : 0,
      },
    ];
    const findKissKh: ISearchItem | undefined = kisskhSearch?.find((item) =>
      item.title.includes(' - ') ? item.title.split(' - ')[1] === title : item.title === title,
    );
    const findBilibili: IBilibiliResult | undefined = bilibiliSearch?.results.find((anime) => {
      if (anime.title.includes('×')) {
        return (
          anime.title.replace(/×/g, 'x').toLowerCase() === title.replace(/\s/g, '').toLowerCase()
        );
      }
      return anime.title.toLowerCase() === title.toLowerCase();
    });
    const [loklokDetail, kissKhDetail, bilibiliDetail] = await Promise.all([
      loklokSearch && loklokSearch.data?.id
        ? getLoklokOrgDetail(loklokSearch.data.id, animeType || 'tv')
        : undefined,
      findKissKh && findKissKh.id ? getKissKhInfo(findKissKh.id) : undefined,
      findBilibili && findBilibili.id ? getBilibiliInfo(findBilibili.id) : undefined,
    ]);
    if (findKissKh && findKissKh.id)
      provider.push({
        id: findKissKh.id.toString(),
        provider: 'KissKh',
        episodesCount: kissKhDetail?.episodesCount || 0,
      });
    if (findBilibili && findBilibili.id) {
      provider.push({
        id: findBilibili.id.toString(),
        provider: 'Bilibili',
        episodesCount: bilibiliDetail?.totalEpisodes || 0,
      });
    }
    if (loklokSearch && loklokSearch?.data?.id)
      provider.push({
        id: loklokSearch?.data?.id,
        provider: 'Loklok',
        episodesCount: loklokDetail?.episodeVo ? loklokDetail.episodeVo.length : 0,
      });
    if (lruCache) lruCache.set(cacheKey, provider);
    return provider;
  }
};

export default getProviderList;
