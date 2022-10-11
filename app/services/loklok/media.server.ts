/* eslint-disable import/prefer-default-export */
import { fetcher, LOKLOK_URL } from './utils.server';

export const loklokGetMedia = async (contentId: string, episodeId: string, category: 0 | 1) => {
  try {
    const res = await fetcher(
      `${LOKLOK_URL}/api/media?contentId=${contentId}&episodeId=${episodeId}&category=${category}`,
    );

    return res;
  } catch (e) {
    console.error(e);
  }
};
