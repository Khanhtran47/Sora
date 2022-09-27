import Anilist from './utils.server';
import { IAnime } from './anilist.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = async <T = any>(url: string): Promise<T> => {
  const res = await fetch(url);
  return res.json();
};

export const getAnimeTrending = async (
  page?: number,
  perPage?: number,
): Promise<IAnime | undefined> => {
  try {
    const fetched = await fetcher<IAnime>(Anilist.animeTrendingUrl(page, perPage));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getAnimePopular = async (
  page?: number,
  perPage?: number,
): Promise<IAnime | undefined> => {
  try {
    const fetched = await fetcher<IAnime>(Anilist.animePopularUrl(page, perPage));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};
