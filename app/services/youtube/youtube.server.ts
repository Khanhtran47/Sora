import Youtube from './utils.server';
import type { IYoutubeItem, IYoutubeVideoList } from './youtube.types';

const fetcher = async <T = any>(url: URL): Promise<T> => {
  const res = await fetch(url);
  return res.json();
};

export const getYoutubeVideo = async (
  id: string,
  contentDetails?: boolean,
  snippet?: boolean,
): Promise<IYoutubeItem[] | undefined> => {
  try {
    const fetched = await fetcher<IYoutubeVideoList>(
      Youtube.videoDetailUrl(id, contentDetails, snippet),
    );
    return fetched.items;
  } catch (error) {
    console.error(error);
  }
};
