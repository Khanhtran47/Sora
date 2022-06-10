/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFilm, MediaType, TimeWindowType, TMDB } from './tmdb.types';

export const getTrending = async (
  type: MediaType,
  timeWindow: TimeWindowType,
): Promise<IFilm[]> => {
  try {
    const res = await fetch(TMDB.trendingUrl(type, timeWindow));
    const data = await res.json();
    return data.results as IFilm[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};
