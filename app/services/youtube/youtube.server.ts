/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import type { IYoutubeVideo, Item } from './youtube.types';
import Youtube from './utils.server';

const fetcher = async <T = any>(url: URL): Promise<T> => {
  const res = await fetch(url);
  return res.json();
};

export const getYoutubeVideo = async (
  id: string,
  contentDetails?: boolean,
  snippet?: boolean,
): Promise<Item[] | undefined> => {
  try {
    const fetched = await fetcher<IYoutubeVideo>(
      Youtube.videoDetailUrl(id, contentDetails, snippet),
    );
    return fetched.items;
  } catch (error) {
    console.error(error);
  }
};
