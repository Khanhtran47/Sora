import {
  ICredit,
  IMediaList,
  IMovieDetail,
  ITvShowDetail,
  IVideos,
  ListMovieType,
  ListTvShowType,
  MediaType,
  TimeWindowType,
} from './tmdb.types';
import { fetcher, postFetchDataHandler, TMDB } from './utils.server';

// reusable function
const getListFromTMDB = async (url: string, type?: string): Promise<IMediaList> => {
  try {
    const fetched = await fetcher(url);

    return {
      page: fetched.page,
      totalPages: fetched.total_pages,
      items: [...postFetchDataHandler(fetched, type)],
    } as IMediaList;
  } catch (error) {
    console.log(error);
    return { page: 0, totalPages: 0, items: [] };
  }
};

// get a list of trending items
export const getTrending = async (
  mediaType: MediaType,
  timeWindow: TimeWindowType,
  page?: number,
): Promise<IMediaList> => {
  const url = TMDB.trendingUrl(mediaType, timeWindow, page);
  return getListFromTMDB(url);
};

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
  const url = TMDB.listMoviesUrl(type, page);
  return getListFromTMDB(url, 'movie');
};

export const getListTvShows = async (type: ListTvShowType, page?: number): Promise<IMediaList> => {
  const url = TMDB.listTvShowsUrl(type, page);
  return getListFromTMDB(url, 'tv');
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
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getTvShowDetail = async (id: number): Promise<ITvShowDetail | undefined> => {
  try {
    const fetched = await fetcher<ITvShowDetail>(TMDB.tvShowDetailUrl(id));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getVideos = async (type: 'movie' | 'tv', id: number): Promise<IVideos | undefined> => {
  try {
    const fetched = await fetcher<IVideos>(TMDB.videoUrl(type, id));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getCredits = async (
  type: 'movie' | 'tv',
  id: number,
): Promise<ICredit | undefined> => {
  try {
    const fetched = await fetcher<ICredit>(TMDB.creditUrl(type, id));
    return fetched;
  } catch (error) {
    console.log(error);
  }
};

export const getSimilar = async (type: 'movie' | 'tv', id: number): Promise<IMediaList> => {
  const url = TMDB.similarUrl(type, id);
  return getListFromTMDB(url);
};

export const getTvShowIMDBId = async (id: number): Promise<number | undefined> => {
  try {
    const fetched = await fetcher<{ imdb_id: number | undefined }>(TMDB.tvExternalIds(id));

    if (!fetched?.imdb_id) throw new Error('This TV show does not have IMDB ID');

    return fetched.imdb_id;
  } catch (error) {
    console.log(error);
  }
};
