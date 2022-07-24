import { IMediaList, ListMovieType, IMovieDetail } from './tmdb.types';
import { fetcher, postFetchDataHandler, TMDB } from './utils.server';

export const getListMovies = async (type: ListMovieType, page?: number): Promise<IMediaList> => {
  const fetched = await fetcher(TMDB.listMoviesUrl(type, page));

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
    result.items.push(...postFetchDataHandler(fetched.data, 'movie'));
  }

  return result;
};

export const getMovieDetail = async (id: number): Promise<IMovieDetail | undefined> => {
  try {
    const fetched = await fetcher<IMovieDetail>(TMDB.movieDetailUrl(id));
    if (!fetched) {
      throw new Error('Movie Detail Unavailable');
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
