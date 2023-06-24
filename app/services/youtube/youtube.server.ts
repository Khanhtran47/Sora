/* eslint-disable @typescript-eslint/no-explicit-any */
import Youtube from './utils.server';
import type { Item, IYoutubeVideo } from './youtube.types';

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
