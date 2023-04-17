import type * as C from 'cachified';

import { cachified, lruCache } from '../lru-cache';
import type { ISubtitleDownload, ISubtitlesSearch } from './open-subtitles.types';
import Opensubtitles from './utils.server';

const fetcher = async <Value>({
  url,
  method,
  body,
  ...options
}: Omit<C.CachifiedOptions<Value>, 'getFreshValue' | 'forceFresh'> & {
  url: string;
  method: string;
  body?: { file_id: number; sub_format: string };
  forceFresh?: boolean | string;
  getFreshValue?: undefined;
}): Promise<Value> => {
  const results = await cachified({
    ...options,
    request: undefined,
    getFreshValue: async () => {
      const myHeaders = new Headers();
      myHeaders.append('Api-Key', `${process.env.OPEN_SUBTITLES_API_KEY}`);
      myHeaders.append('Content-Type', 'application/json');
      const init = {
        method,
        headers: myHeaders,
        ...(body && { body: JSON.stringify(body) }),
      };
      const res = await fetch(url, init);
      if (!res.ok) throw new Error(JSON.stringify(await res.json()));
      const data = (await res.json()) as Value;
      return data;
    },
  });
  return results;
};

export const getSubtitlesSearch = async (
  id?: number,
  imdb_id?: number,
  tmdb_id?: number,
  parent_feature_id?: number,
  parent_imdb_id?: number,
  parent_tmdb_id?: number,
  query?: string,
  ai_translated?: 'exclude' | 'include',
  episode_number?: number,
  foreign_parts_only?: 'exclude' | 'include' | 'only',
  hearing_impaired?: 'exclude' | 'include' | 'only',
  languages?: string,
  machine_translated?: 'exclude' | 'include',
  moviehash?: string,
  moviehash_match?: string,
  order_by?: string,
  order_direction?: 'asc' | 'desc',
  page?: number,
  season_number?: number,
  trusted_sources?: 'include' | 'only',
  type?: 'movie' | 'episode' | 'all',
  user_id?: number,
  year?: number,
): Promise<ISubtitlesSearch | undefined> => {
  try {
    const fetched = await fetcher<ISubtitlesSearch>({
      url: Opensubtitles.subtitlesSearchUrl(
        id,
        imdb_id,
        tmdb_id,
        parent_feature_id,
        parent_imdb_id,
        parent_tmdb_id,
        query,
        ai_translated,
        episode_number,
        foreign_parts_only,
        hearing_impaired,
        languages,
        machine_translated,
        moviehash,
        moviehash_match,
        order_by,
        order_direction,
        page,
        season_number,
        trusted_sources,
        type,
        user_id,
        year,
      ),
      method: 'GET',
      key: `subtitles-search-${id}-${imdb_id}-${tmdb_id}-${parent_feature_id}-${parent_imdb_id}-${parent_tmdb_id}-${query}-${ai_translated}-${episode_number}-${foreign_parts_only}-${hearing_impaired}-${languages}-${machine_translated}-${moviehash}-${moviehash_match}-${order_by}-${order_direction}-${page}-${season_number}-${trusted_sources}-${type}-${user_id}-${year}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getSubtitleDownload = async (
  id: number,
  sub_format: 'srt' | 'webvtt',
): Promise<ISubtitleDownload | undefined> => {
  try {
    const fetched = await fetcher<ISubtitleDownload>({
      url: Opensubtitles.subtitleDownloadUrl(),
      method: 'POST',
      body: {
        file_id: id,
        sub_format,
      },
      key: `subtitle-download-${id}-${sub_format}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};
