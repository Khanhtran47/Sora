import { IMediaList, ListMovieType, IMovieDetail } from './tmdb.types';
import { fetcher, postFetchDataHandler, TMDB } from './utils.server';

/**
 * It fetches a list of movies from the TMDB API, and returns a list of movies
 * @param {ListMovieType} type - ListMovieType
 * @param {number} [page] - number
 * @returns An object with the following properties:
 * page: number
 * totalPages: number
 * items: IMovie[]
 */
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

/**
 * It fetches a movie detail from the TMDB API and returns the data if it exists, otherwise it returns
 * undefined
 * @param {number} id - number - The id of the movie you want to get the details for
 * @returns A Promise that resolves to an IMovieDetail or undefined.
 */
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
