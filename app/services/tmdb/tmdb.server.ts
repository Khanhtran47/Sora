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
  IListGenre,
  IListPeople,
  ListPersonType,
} from './tmdb.types';
import { fetcher, postFetchDataHandler, TMDB } from './utils.server';

// reusable function
const getListFromTMDB = async (url: string, type?: 'movie' | 'tv'): Promise<IMediaList> => {
  try {
    const fetched = await fetcher(url);

    return {
      page: fetched.page,
      totalPages: fetched.total_pages,
      items: [...postFetchDataHandler(fetched, type)],
      totalResults: fetched.total_results,
    } as IMediaList;
  } catch (error) {
    console.error(error);
    return { page: 0, totalPages: 0, items: [], totalResults: 0 };
  }
};

/* ===========================================Trending Field========================================== */

// get a list of trending items
export const getTrending = async (
  mediaType: MediaType,
  timeWindow: TimeWindowType,
  page?: number,
): Promise<IMediaList> => {
  const url = TMDB.trendingUrl(mediaType, timeWindow, page);
  return getListFromTMDB(url);
};

/* ======================================End of Trending Field======================================== */

/* ===========================================Movie Field============================================= */

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

/* =====================================End of Movie Field============================================ */

/* ========================================Tv Show Field============================================== */

/**
 * It takes a type and a page number, and returns a promise that resolves to an object that contains a
 * list of tv shows
 * @param {ListTvShowType} type - ListTvShowType = 'airing_today' | 'on_the_air' | 'popular' |
 * 'top_rated';
 * @param {number} [page] - number
 * @returns A promise that resolves to an object of type IMediaList.
 */
export const getListTvShows = async (type: ListTvShowType, page?: number): Promise<IMediaList> => {
  const url = TMDB.listTvShowsUrl(type, page);
  return getListFromTMDB(url, 'tv');
};

export const getTvShowDetail = async (id: number): Promise<ITvShowDetail | undefined> => {
  try {
    const fetched = await fetcher<ITvShowDetail>(TMDB.tvShowDetailUrl(id));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/**
 * It fetches the IMDB ID of a TV show from TMDB, and if it doesn't exist, it throws an error
 * @param {number} id - number - The TV show ID from TMDB
 * @returns A Promise that resolves to a number or undefined.
 */
export const getTvShowIMDBId = async (id: number): Promise<number | undefined> => {
  try {
    const fetched = await fetcher<{ imdb_id: number | undefined }>(TMDB.tvExternalIds(id));

    if (!fetched?.imdb_id) throw new Error('This TV show does not have IMDB ID');

    return fetched.imdb_id;
  } catch (error) {
    console.error(error);
  }
};

/* ======================================End of Tv Show Field========================================= */

/* ==========================================People Field============================================= */
export const getListPeople = async (
  type: ListPersonType,
  language?: string,
  page?: number,
): Promise<IListPeople | undefined> => {
  try {
    const fetched = await fetcher<IListPeople>(TMDB.listPerson(type, language, page));
    if (!fetched?.results) throw new Error('Dont have result');

    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/* ======================================End of People Field========================================== */

/* ==========================================Search Field============================================= */

export const getSearchMovies = async (
  keyword: string,
  page?: number,
  language?: string,
  include_adult?: boolean,
  region?: string,
  year?: number,
): Promise<IMediaList> => {
  const url = TMDB.searchMovies(keyword, language, page, include_adult, region, year, undefined);
  return getListFromTMDB(url, 'movie');
};

export const getSearchTvShows = async (
  keyword: string,
  page?: number,
  language?: string,
  include_adult?: boolean,
  first_air_date_year?: number,
): Promise<IMediaList> => {
  const url = TMDB.searchTv(keyword, language, page, include_adult, first_air_date_year);
  return getListFromTMDB(url, 'tv');
};

export const getSearchPerson = async (
  keyword: string,
  page?: number,
  include_adult?: boolean,
  language?: string,
  region?: string,
): Promise<IListPeople | undefined> => {
  try {
    const fetched = await fetcher<IListPeople>(
      TMDB.searchPerson(keyword, page, include_adult, language, region),
    );
    if (!fetched?.results) throw new Error('Dont have result');

    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/* =======================================End of Search Field========================================= */

/* =============================================UTILS================================================= */

/**
 * It fetches a video from the TMDB API and returns the response
 * @param {'movie' | 'tv'} type - 'movie' | 'tv'
 * @param {number} id - number - the id of the movie or tv show
 * @returns The return type is a Promise of IVideos or undefined.
 */
export const getVideos = async (type: 'movie' | 'tv', id: number): Promise<IVideos | undefined> => {
  try {
    const fetched = await fetcher<IVideos>(TMDB.videoUrl(type, id));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/**
 * It fetches a credit object from the TMDB API, and returns it if it exists
 * @param {'movie' | 'tv'} type - 'movie' | 'tv'
 * @param {number} id - number,
 * @returns Promise&lt;ICredit | undefined&gt;
 */
export const getCredits = async (
  type: 'movie' | 'tv',
  id: number,
): Promise<ICredit | undefined> => {
  try {
    const fetched = await fetcher<ICredit>(TMDB.creditUrl(type, id));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/**
 * It takes a type and an id, and returns a promise that resolves to a list of media
 * @param {'movie' | 'tv'} type - 'movie' | 'tv'
 * @param {number} id - The id of the movie or tv show
 * @returns A promise that resolves to an IMediaList object.
 */
export const getSimilar = async (type: 'movie' | 'tv', id: number): Promise<IMediaList> => {
  const url = TMDB.similarUrl(type, id);
  return getListFromTMDB(url);
};

export const getListGenre = async (type: 'movie' | 'tv'): Promise<{ [id: string]: string }> => {
  const url = TMDB.listGenre(type);
  try {
    const fetched = await fetcher<IListGenre>(url);
    const result: { [key: string]: string } = {};

    for (let i = 0; i < fetched.genres.length; i += 1) {
      const genre = fetched.genres[i];
      result[genre.id] = genre.name;
    }
    return result;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getListDiscover = async (
  type: 'movie' | 'tv',
  with_genres?: string,
  sort_by?: string,
  page?: number,
): Promise<IMediaList> => {
  const url = TMDB.discoverUrl(type, with_genres, sort_by, page);

  return getListFromTMDB(url, type);
};
