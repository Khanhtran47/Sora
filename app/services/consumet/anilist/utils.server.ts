export default class Anilist {
  static readonly API_BASE_URL = 'https://api.consumet.org/meta/anilist/';

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
    if (query) {
      url += `?query=${query}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    if (page) {
      url += `&page=${page}`;
    }
    if (perPage) {
      url += `&perPage=${perPage}`;
    }
    if (season) {
      url += `&season=${season}`;
    }
    if (format) {
      url += `&format=${format}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (genres) {
      url += `&genres=${genres}`;
    }
    if (id) {
      url += `&id=${id}`;
    }
    if (year) {
      url += `&year=${year}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
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
