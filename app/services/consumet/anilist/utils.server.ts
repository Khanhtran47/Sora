export default class Anilist {
  static readonly API_BASE_URL = 'https://consumet-api.herokuapp.com/';

  static animeTrendingUrl = (page?: number, perPage?: number): string => {
    let url = `${Anilist.API_BASE_URL}meta/anilist/trending`;
    if (page) {
      url += `?page=${page}`;
    }
    if (perPage) {
      url += `&perPage=${perPage}`;
    }
    return url;
  };

  static animePopularUrl = (page?: number, perPage?: number): string => {
    let url = `${Anilist.API_BASE_URL}meta/anilist/popular`;
    if (page) {
      url += `?page=${page}`;
    }
    if (perPage) {
      url += `&perPage=${perPage}`;
    }
    return url;
  };
}
