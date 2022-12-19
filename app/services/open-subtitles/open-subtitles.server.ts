import Opensubtitles from './utils.server';
import { ISubtitlesSearch, ISubtitleDownload } from './open-subtitles.types';
import { lruCache } from '../lru-cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = async <T = any>(
  url: string,
  method: string,
  body?: { file_id: number; sub_format: string },
): Promise<T> => {
  if (lruCache) {
    const cached = lruCache.get<T>(url);
    if (cached) {
      console.info('\x1b[32m%s\x1b[0m', '[cached]', url);
      return cached;
    }
  }

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
  const data = await res.json();

  if (lruCache) lruCache.set(url, data);

  return data;
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
    const fetched = await fetcher<ISubtitlesSearch>(
      Opensubtitles.subtitlesSearchUrl(
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
      'GET',
    );
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
    const fetched = await fetcher<ISubtitleDownload>(Opensubtitles.subtitleDownloadUrl(), 'POST', {
      file_id: id,
      sub_format,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};
