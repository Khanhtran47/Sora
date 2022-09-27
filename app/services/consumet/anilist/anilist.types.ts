export interface IAnime {
  currentPage: number;
  hasNextPage: boolean;
  results: IAnimeResult[];
}

export interface IAnimeResult {
  cover?: string;
  description?: string;
  duration?: number | null;
  genres?: string[];
  id?: string;
  image?: string;
  malId?: number;
  rating?: number | null;
  releaseDate?: number | null;
  status?: string;
  title?: Title;
  totalEpisodes?: number | null;
  trailer?: Trailer;
  type?: string;
}

export interface Title {
  english?: null | string;
  native?: string;
  romaji?: string;
  userPreferred?: string;
}

export interface Trailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}
