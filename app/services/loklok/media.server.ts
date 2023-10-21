import { fetcher, lruCache } from '~/utils/server/cache.server';

import { LOKLOK_URL } from './utils.server';

export const loklokGetMedia = async (contentId: string, episodeIndex: string, category: 0 | 1) => {
  try {
    const res = await fetcher({
      url: `${LOKLOK_URL}/api/media?contentId=${contentId}&episodeIndex=${episodeIndex}&category=${category}`,
      key: `loklok-media-${contentId}-${episodeIndex}-${category}`,
      cache: lruCache,
      ttl: 1000 * 60 * 60,
      staleWhileRevalidate: 1000 * 60 * 60 * 24,
    });

    return res;
  } catch (e) {
    console.error(e);
  }
};
