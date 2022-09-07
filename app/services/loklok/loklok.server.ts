/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import Loklok from './utils.server';
import { ISearchMedia, Result, Info, ILokMovieDetail } from './loklok.types';

const fetcher = async <T = any>(url: string): Promise<T> => {
  const res = await fetch(url);
  return res.json();
};

export const getSearchMedia = async (keyword: string): Promise<Result[] | undefined> => {
  try {
    const fetched = await fetcher<ISearchMedia>(Loklok.searchMediaUrl(keyword));
    return fetched.pageProps.result;
  } catch (error) {
    console.error(error);
  }
};

export const getLoklokMovieDetail = async (id: number): Promise<Info | undefined> => {
  try {
    const fetched = await fetcher<ILokMovieDetail>(Loklok.movieDetailUrl(id));
    return fetched.pageProps.info;
  } catch (error) {
    console.error(error);
  }
};
