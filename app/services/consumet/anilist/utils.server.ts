import { env } from 'process';
import { IMedia } from '~/types/media';
import { IAnimeResult, IAnimeEpisode } from './anilist.types';

export class Anilist {
  static readonly API_BASE_URL = env.ANILIST_API_URL;

  static animeSearchUrl = (query: string, page?: number, perPage?: number): string => {
    let url = `${Anilist.API_BASE_URL}${query}`;
    if (page) {
      url += `?page=${page}`;
    }
    if (perPage) {
      url += `&perPage=${perPage}`;
    }
    return url;
  };

  static animeRecentEpisodesUrl = (
    provider?: string | undefined,
    page?: number,
    perPage?: number,
  ): string => {
    let url = `${Anilist.API_BASE_URL}recent-episodes`;
    if (provider) {
      url += `?provider=${provider}`;
    }
    if (page) {
      url += `&page=${page}`;
    }
    if (perPage) {
      url += `&perPage=${perPage}`;
    }
    return url;
  };

  static animeAdvancedSearchUrl = (
    query?: string,
    type?: 'ANIME' | 'MANGA',
    page?: number,
    perPage?: number,
    season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL',
    format?: 'TV' | 'TV_SHORT' | 'OVA' | 'ONA' | 'MOVIE' | 'SPECIAL' | 'MUSIC',
    sort?: string[],
    genres?: string[],
    id?: string,
    year?: number,
    status?: 'RELEASING' | 'NOT_YET_RELEASED' | 'FINISHED' | 'CANCELLED' | 'HIATUS',
  ): string => {
    let url = `${Anilist.API_BASE_URL}advanced-search`;
    const params = new URLSearchParams();
    if (query) {
      params.append('query', query);
    }
    if (type) {
      params.append('type', type);
    }
    if (page) {
      params.append('page', page.toString());
    }
    if (perPage) {
      params.append('perPage', perPage.toString());
    }
    if (season) {
      params.append('season', season);
    }
    if (format) {
      params.append('format', format);
    }
    if (sort) {
      params.append('sort', sort.toString());
    }
    if (genres) {
      params.append('genres', genres.toString());
    }
    if (id) {
      params.append('id', id);
    }
    if (year) {
      params.append('year', year.toString());
    }
    if (status) {
      params.append('status', status);
    }
    url += `?${params.toString()}`;
    return url;
  };

  static animeGenreUrl = (genres: string[]): string =>
    `${Anilist.API_BASE_URL}genre/?genres=${genres}`;

  static animeRandomUrl = (): string => `${Anilist.API_BASE_URL}random-anime`;

  static animeTrendingUrl = (page?: number, perPage?: number): string => {
    let url = `${Anilist.API_BASE_URL}trending`;
    if (page) {
      url += `?page=${page}`;
    }
    if (perPage) {
      url += `&perPage=${perPage}`;
    }
    return url;
  };

  static animePopularUrl = (page?: number, perPage?: number): string => {
    let url = `${Anilist.API_BASE_URL}popular`;
    if (page) {
      url += `?page=${page}`;
    }
    if (perPage) {
      url += `&perPage=${perPage}`;
    }
    return url;
  };

  static animeAiringSchedule = (
    page?: number,
    perPage?: number,
    weekStart?: number | string,
    weekEnd?: number | string,
    notYetAired?: boolean,
  ): string => {
    let url = `${Anilist.API_BASE_URL}airing-schedule`;
    if (page) {
      url += `?page=${page}`;
    }
    if (perPage) {
      url += `&perPage=${perPage}`;
    }
    if (weekStart) {
      url += `&weekStart=${weekStart}`;
    }
    if (weekEnd) {
      url += `&weekStart=${weekEnd}`;
    }
    if (notYetAired) {
      url += `&notYetAired=${notYetAired}`;
    }
    return url;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static animeInfoUrl = (id: any, dub?: boolean, provider?: string): string => {
    let url = `${Anilist.API_BASE_URL}data/${id}`;
    const params = new URLSearchParams();
    if (dub) {
      params.append('dub', dub.toString());
    }
    if (provider) {
      params.append('provider', provider);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return url;
  };

  static animeEpisodeUrl = (id: string, dub?: boolean, provider?: string): string => {
    let url = `${Anilist.API_BASE_URL}episodes/${id}`;
    const params = new URLSearchParams();
    if (dub) {
      params.append('dub', dub.toString());
    }
    if (provider) {
      params.append('provider', provider);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return url;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static animeEpisodeStreamUrl = (episodeId: any, provider?: string): string => {
    let url = `${Anilist.API_BASE_URL}watch/${episodeId}`;
    if (provider) {
      url += `&provider=${provider}`;
    }
    return url;
  };
}

export const fetchAnimeResultsHandler = (data: IAnimeResult[]): IMedia[] => {
  const media: IMedia[] = [];
  data.forEach((anime) => {
    const {
      color,
      cover,
      description,
      episodes,
      genres,
      id,
      image,
      malId,
      popularity,
      rating,
      relationType,
      releaseDate,
      status,
      title,
      totalEpisodes,
      trailer,
      type,
    } = anime;
    const mediaData: IMedia = {
      backdropPath: cover,
      color,
      episodes,
      genresAnime: genres,
      id,
      malId,
      mediaType: 'anime',
      overview: description,
      popularity,
      posterPath: image,
      relationType,
      releaseDate,
      status,
      title,
      totalEpisodes,
      trailer,
      type,
      voteAverage: rating,
    };
    media.push(mediaData);
  });
  return media;
};

export const fetchAnimeEpisodeHandler = (data: IAnimeEpisode[]): IMedia[] => {
  const media: IMedia[] = [];
  data.forEach((anime) => {
    const {
      color,
      episodeId,
      episodeNumber,
      episodeTitle,
      genres,
      id,
      image,
      malId,
      rating,
      title,
      type,
    } = anime;
    const mediaData: IMedia = {
      color,
      episodeId,
      episodeNumber,
      episodeTitle,
      genresAnime: genres,
      id,
      malId,
      mediaType: 'anime',
      posterPath: image,
      title,
      type,
      voteAverage: rating,
    };
    media.push(mediaData);
  });
  return media;
};
