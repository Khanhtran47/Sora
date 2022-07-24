import { IMediaList, ITvShowDetail, ListTvShowType } from './tmdb.types';
import { fetcher, postFetchDataHandler, TMDB } from './utils.server';

export const getListTvShows = async (type: ListTvShowType, page?: number): Promise<IMediaList> => {
  const fetched = await fetcher(TMDB.listTvShowsUrl(type, page));

  const result: IMediaList = {
    page: 0,
    totalPages: 0,
    items: [],
  };

  if (fetched.error) {
    console.error(fetched.error);
  }

  if (fetched.data) {
    result.page = fetched.data.page;
    result.totalPages = fetched.data.total_pages;
    result.items.push(...postFetchDataHandler(fetched.data, 'tv'));
  }

  return result;
};

export const getTvShowDetail = async (id: number): Promise<ITvShowDetail | undefined> => {
  try {
    const fetched = await fetcher<ITvShowDetail>(TMDB.tvShowDetailUrl(id));
    if (!fetched) {
      throw new Error('Tv Detail Unavailable');
    }
    if (fetched.error) {
      console.error(fetched.error);
    }

    if (fetched.data) {
      return fetched.data;
    }
  } catch (error) {
    console.error(error);
  }
};
