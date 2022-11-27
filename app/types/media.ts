export interface IMedia {
  adult?: boolean;
  backdropPath?: string;
  castId?: number;
  character?: string;
  color?: string;
  creditId?: string;
  department?: string;
  duration?: number;
  episodeId?: string;
  episodeNumber?: number;
  episodes?: number;
  episodeTitle?: string;
  firstAirDate?: string;
  gender?: number | null;
  genreIds?: number[];
  genresAnime?: string[];
  id?: number | string;
  job?: string;
  knownFor?: IMedia[];
  knownForDepartment?: string;
  malId?: number;
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
  name?: string;
  order?: number;
  originalCountry?: string;
  originalLanguage?: string;
  originalName?: string;
  originalTitle?: string;
  overview?: string;
  popularity?: number;
  posterPath?: string;
  rating?: number;
  relationType?: string;
  releaseDate?: string | number;
  status?: string;
  title?: string | Title;
  totalEpisodes?: number;
  trailer?: ITrailer;
  type?: Type;
  video?: boolean;
  voteAverage?: number;
  voteCount?: number;
}

export interface ITrailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}

export interface Title {
  english?: null | string;
  native?: string;
  romaji?: string;
  userPreferred?: string;
}

export enum Type {
  Movie = 'MOVIE',
  Music = 'MUSIC',
  Ona = 'ONA',
  Ova = 'OVA',
  Special = 'SPECIAL',
  Tv = 'TV',
  TvShort = 'TV_SHORT',
}
