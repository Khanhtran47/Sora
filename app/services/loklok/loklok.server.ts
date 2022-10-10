/* eslint-disable import/prefer-default-export */
import { fetcher } from '../tmdb/utils.server';
import type { MediaInfo, SearchData } from './loklok.type';

const URL = 'https://loklok.vercel.app/api';

const lookerPromise = (title: string | undefined) => {
  if (title && title.length > 0) {
    return fetcher<SearchData[]>(`${URL}/search?name=${title}`);
  }
  return Promise.resolve(undefined);
};

const movieFilter = (items: (SearchData[] | undefined)[], titles: string[], year: number) => {
  let wantedId;
  const mTitles = titles.map((title) => title.trim().toLowerCase());

  for (let i = 0; i < items.length; i += 1) {
    const data = items[i];
    if (data) {
      if (data.length === 1) {
        wantedId = data[0].id;
        break;
      } else {
        const wantedItem = data.find(
          (item) =>
            mTitles.includes(item.name.trim().toLowerCase()) ||
            mTitles.some(
              (title) =>
                (year === Number(item.releaseTime) || title.includes(item.releaseTime)) &&
                (title.includes(item.name.trim().toLowerCase()) ||
                  item.name.trim().toLowerCase().includes(title)),
            ),
        );

        if (wantedItem) {
          wantedId = wantedItem.id;
          break;
        }
      }
    }
  }

  return wantedId;
};

export const loklokGetMovieInfo = async (
  titles: string[],
  year: number,
): Promise<MediaInfo | undefined> => {
  try {
    // search with titles and release year
    const fetched = await Promise.all(titles.map((title) => lookerPromise(title)));
    const wantedId = movieFilter(fetched, titles, year);

    if (wantedId) {
      const info = await fetcher<MediaInfo>(`${URL}/movie?id=${wantedId}&category=0`);
      return info;
    }
  } catch (error) {
    console.error(error);
  }
};

export const loklokSearchMovieSubtitles = async (titles: string[], year: number) => {
  try {
    // search with titles and release year
    const fetched = await Promise.all(titles.map((title) => lookerPromise(title)));
    const wantedId = movieFilter(fetched, titles, year);

    if (wantedId) {
      const info = await fetcher<MediaInfo>(`${URL}/movie?id=${wantedId}&category=0`);

      return info.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: `${URL}/subtitle?url=${sub.url}`,
      }));
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// export const loklokGetTvShowInfo = async (
//   titles: string[],
//   year: number,
//   season?: number,
//   episodeId?: string,
// ) => {
//   throw new Error('Not Implementation');
// };
