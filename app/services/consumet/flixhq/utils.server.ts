export default class Flixhq {
  static readonly API_BASE_URL = 'https://api.consumet.org/movies/flixhq/';

  static movieSearchUrl = (query: string, page?: number): string => {
    let url = `${Flixhq.API_BASE_URL}${query}`;
    if (page) {
      url += `?page=${page}`;
    }
    return url;
  };

  static movieInfoUrl = (id: string): string => `${Flixhq.API_BASE_URL}info?id=${id}`;

  static movieEpisodeStreamUrl = (episodeId: string, mediaId: string, server?: string): string => {
    let url = `${Flixhq.API_BASE_URL}watch?episodeId=${episodeId}&mediaId=${mediaId}`;
    if (server) {
      url += `&server=${server}`;
    }
    return url;
  };
}
