import { META, PROVIDERS_LIST } from '@consumet/extensions';

import type { IMedia } from '~/types/media';

import { cachified, fetcher, lruCache } from '../lru-cache';
import type {
  ICredit,
  IDetailImages,
  ILanguage,
  IList,
  IListGenre,
  IMediaList,
  IMovieDetail,
  IMovieTranslations,
  IPeopleCredits,
  IPeopleDetail,
  IPeopleExternalIds,
  IPeopleImages,
  ISeasonDetail,
  ITvShowDetail,
  IVideos,
  ListMovieType,
  ListPersonType,
  ListTvShowType,
  MediaType,
  TimeWindowType,
} from './tmdb.types';
import { postFetchDataHandler, TMDB } from './utils.server';

// reusable function
const getListFromTMDB = async (
  url: string,
  type?: 'movie' | 'tv' | 'people',
): Promise<IMediaList> => {
  try {
    const fetched = await fetcher<{
      items?: IMedia[];
      page: number;
      total_pages: number;
      total_results: number;
    }>({
      url,
      key: `tmdb-list-${url}-${type}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
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

/* ============================================Config Field=========================================== */

export const getListLanguages = async (): Promise<ILanguage[] | undefined> => {
  try {
    const fetched = await fetcher<ILanguage[]>({
      url: TMDB.languagesUrl(),
      key: 'tmdb-languages',
      ttl: 1000 * 60 * 60 * 24 * 30,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 365,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/* =======================================End of Config Field========================================= */

/* ===========================================Trending Field========================================== */

// get a list of trending items
export const getTrending = async (
  mediaType: MediaType,
  timeWindow: TimeWindowType,
  language?: string,
  page?: number,
): Promise<IMediaList> => {
  const url = TMDB.trendingUrl(mediaType, timeWindow, language, page);
  return getListFromTMDB(url, mediaType === 'person' ? 'people' : undefined);
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
export const getListMovies = async (
  type: ListMovieType,
  language?: string,
  page?: number,
): Promise<IMediaList> => {
  const url = TMDB.listMoviesUrl(type, page, language);
  return getListFromTMDB(url, 'movie');
};

/**
 * It fetches a movie detail from the TMDB API and returns the data if it exists, otherwise it returns
 * undefined
 * @param {number} id - number - The id of the movie you want to get the details for
 * @returns A Promise that resolves to an IMovieDetail or undefined.
 */
export const getMovieDetail = async (
  id: number,
  language?: string,
): Promise<IMovieDetail | undefined> => {
  try {
    const fetched = await fetcher<IMovieDetail>({
      url: TMDB.movieDetailUrl(id, language),
      key: `tmdb-movie-detail-${id}-${language}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
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
export const getListTvShows = async (
  type: ListTvShowType,
  language?: string,
  page?: number,
): Promise<IMediaList> => {
  const url = TMDB.listTvShowsUrl(type, page, language);
  return getListFromTMDB(url, 'tv');
};

export const getTvShowDetail = async (
  id: number,
  language?: string,
): Promise<ITvShowDetail | undefined> => {
  try {
    const fetched = await fetcher<ITvShowDetail>({
      url: TMDB.tvShowDetailUrl(id, language),
      key: `tmdb-tv-show-detail-${id}-${language}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
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
export const getTvShowIMDBId = async (id: number): Promise<string | undefined> => {
  try {
    const fetched = await fetcher<{ imdb_id: string | undefined }>({
      url: TMDB.tvExternalIds(id),
      key: `tmdb-tv-show-imdb-id-${id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });

    if (!fetched?.imdb_id) throw new Error('This TV show does not have IMDB ID');

    return fetched.imdb_id;
  } catch (error) {
    console.error(error);
  }
};

// Season and episodes

export const getTvSeasonDetail = async (
  tv_id: number,
  season_number: number,
  language?: string,
): Promise<ISeasonDetail | undefined> => {
  try {
    const fetched = await fetcher<ISeasonDetail>({
      url: TMDB.tvSeasonDetailUrl(tv_id, season_number, language),
      key: `tmdb-tv-season-detail-${tv_id}-${season_number}-${language}`,
      ttl: 1000 * 60 * 60,
      staleWhileRevalidate: 1000 * 60 * 60 * 24,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getTvSeasonCredits = async (
  tv_id: number,
  season_number: number,
  language?: string,
): Promise<ICredit | undefined> => {
  try {
    const fetched = await fetcher<ICredit>({
      url: TMDB.tvSeasonCreditsUrl(tv_id, season_number, language),
      key: `tmdb-tv-season-credits-${tv_id}-${season_number}-${language}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getTvSeasonVideos = async (
  tv_id: number,
  season_number: number,
  language?: string,
): Promise<IVideos | undefined> => {
  try {
    const fetched = await fetcher<IVideos>({
      url: TMDB.tvSeasonVideosUrl(tv_id, season_number, language),
      key: `tmdb-tv-season-videos-${tv_id}-${season_number}-${language}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getTvSeasonImages = async (
  tv_id: number,
  season_number: number,
  language?: string,
): Promise<IDetailImages | undefined> => {
  try {
    const fetched = await fetcher<IDetailImages>({
      url: TMDB.tvSeasonImagesUrl(tv_id, season_number, language),
      key: `tmdb-tv-season-images-${tv_id}-${season_number}-${language}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
    return fetched;
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
): Promise<IMediaList | undefined> => {
  const url = TMDB.listPerson(type, language, page);
  return getListFromTMDB(url, 'people');
};

export const getPeopleDetail = async (
  person_id: number,
  language?: string,
): Promise<IPeopleDetail | undefined> => {
  try {
    const fetched = await fetcher<IPeopleDetail>({
      url: TMDB.personDetail(person_id, language),
      key: `tmdb-people-detail-${person_id}-${language}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    if (!fetched) throw new Error('Dont have result');
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getPeopleExternalIds = async (
  person_id: number,
  language?: string,
): Promise<IPeopleExternalIds | undefined> => {
  try {
    const fetched = await fetcher<IPeopleExternalIds>({
      url: TMDB.peopleExternalIds(person_id, language),
      key: `tmdb-people-external-ids-${person_id}-${language}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
    if (!fetched) throw new Error('Dont have result');
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getPeopleImages = async (
  person_id: number,
  language?: string,
): Promise<IPeopleImages | undefined> => {
  try {
    const fetched = await fetcher<IPeopleImages>({
      url: TMDB.peopleImages(person_id, language),
      key: `tmdb-people-images-${person_id}-${language}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
    if (!fetched) throw new Error('Dont have result');
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getPeopleCredits = async (
  id: number,
  type?: 'movie' | 'tv' | 'combined',
  language?: string,
): Promise<IPeopleCredits | undefined> => {
  try {
    const fetched = await fetcher<IPeopleCredits>({
      url: TMDB.peopleCredits(id, type, language),
      key: `tmdb-people-credits-${id}-${type}-${language}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return {
      cast: fetched?.cast ? postFetchDataHandler(fetched.cast) : [],
      id: fetched?.id || undefined,
    };
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
): Promise<IMediaList | undefined> => {
  const url = TMDB.searchPerson(keyword, page, include_adult, language, region);
  return getListFromTMDB(url, 'people');
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
    const fetched = await fetcher<IVideos>({
      url: TMDB.videoUrl(type, id),
      key: `tmdb-video-${type}-${id}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
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
    const fetched = await fetcher<ICredit>({
      url: TMDB.creditUrl(type, id),
      key: `tmdb-credit-${type}-${id}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getImages = async (
  type: 'movie' | 'tv',
  id: number,
  language?: string,
): Promise<IDetailImages | undefined> => {
  try {
    const fetched = await fetcher<IDetailImages>({
      url: TMDB.imagesUrl(type, id, language),
      key: `tmdb-images-${type}-${id}-${language}`,
      ttl: 1000 * 60 * 60 * 24 * 7,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 30,
      cache: lruCache,
    });
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
export const getSimilar = async (
  type: 'movie' | 'tv',
  id: number,
  page?: number,
  language?: string,
): Promise<IMediaList> => {
  const url = TMDB.similarUrl(type, id, page, language);
  return getListFromTMDB(url);
};

export const getRecommendation = async (
  type: 'movie' | 'tv',
  id: number,
  page?: number,
  language?: string,
): Promise<IMediaList> => {
  const url = TMDB.recommendationUrl(type, id, page, language);
  return getListFromTMDB(url);
};

export const getListGenre = async (
  type: 'movie' | 'tv',
  language?: string,
): Promise<{ [id: string]: string }> => {
  const url = TMDB.listGenre(type, language);
  try {
    const fetched = await fetcher<IListGenre>({
      url,
      key: `tmdb-genre-${type}-${language}`,
      ttl: 1000 * 60 * 60 * 24 * 30,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 365,
      cache: lruCache,
    });
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
  language?: string,
  page?: number,
  releaseDateGte?: string,
  releaseDateLte?: string,
  firstAirDateGte?: string,
  firstAirDateLte?: string,
  withOriginalLanguage?: string,
  voteCountGte?: number,
  voteAverageGte?: number,
  voteAverageLte?: number,
  withCast?: string,
  withCrew?: string,
  withPeople?: string,
  withCompanies?: string,
  withNetworks?: string,
  withKeywords?: string,
  withRuntimeGte?: number,
  withRuntimeLte?: number,
  withStatus?: string,
  withType?: string,
  airDateGte?: string,
  airDateLte?: string,
): Promise<IMediaList> => {
  const url = TMDB.discoverUrl(
    type,
    with_genres,
    sort_by,
    language,
    page,
    type === 'movie' ? releaseDateGte : undefined,
    type === 'movie' ? releaseDateLte : undefined,
    type === 'tv' ? firstAirDateGte : undefined,
    type === 'tv' ? firstAirDateLte : undefined,
    withOriginalLanguage,
    voteCountGte,
    voteAverageGte,
    voteAverageLte,
    type === 'movie' ? withCast : undefined,
    type === 'movie' ? withCrew : undefined,
    type === 'movie' ? withPeople : undefined,
    withCompanies,
    type === 'tv' ? withNetworks : undefined,
    withKeywords,
    withRuntimeGte,
    withRuntimeLte,
    type === 'tv' ? withStatus : undefined,
    type === 'tv' ? withType : undefined,
    type === 'tv' ? airDateGte : undefined,
    type === 'tv' ? airDateLte : undefined,
  );

  return getListFromTMDB(url, type);
};

export const getTranslations = async (
  type: 'movie' | 'tv',
  id: number,
): Promise<IMovieTranslations | undefined> => {
  try {
    const fetched = await fetcher<IMovieTranslations>({
      url: TMDB.translationsUrl(type, id),
      key: `tmdb-translations-${type}-${id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

export const getListDetail = async (
  listId: number,
  language?: string,
): Promise<IList | undefined> => {
  try {
    const fetched = await fetcher<IList>({
      url: TMDB.listUrl(listId, language),
      key: `tmdb-list-${listId}-${language}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    return {
      ...fetched,
      items: [...postFetchDataHandler(fetched.items)],
    };
  } catch (error) {
    console.error(error);
  }
};

export const getImdbRating = async (
  id: string,
): Promise<{ count: number; star: number } | undefined> => {
  try {
    const fetched = await fetcher<{
      rating: { count: number; star: number };
    }>({
      url: TMDB.imdbDetailUrl(id),
      key: `tmdb-imdb-${id}`,
      ttl: 1000 * 60 * 60 * 24,
      staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
      cache: lruCache,
    });
    if (fetched && fetched.rating) {
      return fetched.rating;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getInfoWithProvider = async (id: string, type: 'movie' | 'tv', provider?: string) => {
  let tmdb = new META.TMDB(TMDB.key);

  if (provider) {
    const possibleProvider = PROVIDERS_LIST.MOVIES.find(
      (p) => p.name.toLowerCase() === provider.toLowerCase(),
    );
    if (!possibleProvider) {
      throw new Error(`Provider ${provider} not found`);
    }
    tmdb = new META.TMDB(TMDB.key, possibleProvider);
  }

  const info = await cachified({
    key: `tmdb-${type}-${id}-info`,
    ttl: 1000 * 60 * 60 * 24,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 7,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await tmdb.fetchMediaInfo(id, type);
        return res;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
  });

  return info;
};

export const getWatchEpisode = async (id: string, episodeId: string) => {
  const tmdb = new META.TMDB(TMDB.key);

  const data = await cachified({
    key: `tmdb-${id}-episode-${episodeId}-watch`,
    ttl: 1000 * 60 * 60,
    staleWhileRevalidate: 1000 * 60 * 60 * 3,
    cache: lruCache,
    request: undefined,
    getFreshValue: async () => {
      try {
        const res = await tmdb.fetchEpisodeSources(episodeId, id);
        return res;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
  });
  return data;
};
