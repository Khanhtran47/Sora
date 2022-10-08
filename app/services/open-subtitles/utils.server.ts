export default class Opensubtitles {
  static readonly API_BASE_URL = 'https://api.opensubtitles.com/api/v1/';

  static subtitlesSearchUrl = (
    id?: number,
    imdb_id?: number,
    tmdb_id?: number,
    parent_feature_id?: number,
    parent_imdb_id?: number,
    parent_tmdb_id?: number,
    query?: string,
    ai_translated?: 'exclude' | 'include',
    episode_number?: number,
    foreign_parts_only?: 'exclude' | 'include' | 'only',
    hearing_impaired?: 'exclude' | 'include' | 'only',
    languages?: string,
    machine_translated?: 'exclude' | 'include',
    moviehash?: string,
    moviehash_match?: string,
    order_by?: string,
    order_direction?: 'asc' | 'desc',
    page?: number,
    season_number?: number,
    trusted_sources?: 'include' | 'only',
    type?: 'movie' | 'episode' | 'all',
    user_id?: number,
    year?: number,
  ): string => {
    let url = `${Opensubtitles.API_BASE_URL}subtitles`;
    const params = new URLSearchParams();
    if (id) {
      params.append('id', id.toString());
    }
    if (imdb_id) {
      params.append('imdb_id', imdb_id.toString());
    }
    if (tmdb_id) {
      params.append('tmdb_id', tmdb_id.toString());
    }
    if (parent_feature_id) {
      params.append('parent_feature_id', parent_feature_id.toString());
    }
    if (parent_imdb_id) {
      params.append('parent_imdb_id', parent_imdb_id.toString());
    }
    if (parent_tmdb_id) {
      params.append('parent_tmdb_id', parent_tmdb_id.toString());
    }
    if (query) {
      params.append('query', query);
    }
    if (ai_translated) {
      params.append('ai_translated', ai_translated);
    }
    if (episode_number) {
      params.append('episode_number', episode_number.toString());
    }
    if (foreign_parts_only) {
      params.append('foreign_parts_only', foreign_parts_only);
    }
    if (hearing_impaired) {
      params.append('hearing_impaired', hearing_impaired);
    }
    if (languages) {
      params.append('languages', languages);
    }
    if (machine_translated) {
      params.append('machine_translated', machine_translated);
    }
    if (moviehash) {
      params.append('moviehash', moviehash);
    }
    if (moviehash_match) {
      params.append('moviehash_match', moviehash_match);
    }
    if (order_by) {
      params.append('order_by', order_by);
    }
    if (order_direction) {
      params.append('order_direction', order_direction);
    }
    if (page) {
      params.append('page', page.toString());
    }
    if (season_number) {
      params.append('season_number', season_number.toString());
    }
    if (trusted_sources) {
      params.append('trusted_sources', trusted_sources);
    }
    if (type) {
      params.append('type', type);
    }
    if (user_id) {
      params.append('user_id', user_id.toString());
    }
    if (year) {
      params.append('year', year.toString());
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return url;
  };

  static subtitleDownloadUrl = (): string => `${Opensubtitles.API_BASE_URL}download`;
}
