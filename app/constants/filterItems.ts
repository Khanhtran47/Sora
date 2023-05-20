export const sortMovieItems = ['popularity', 'release_date', 'original_title', 'vote_average'];

export const sortTvItems = ['popularity', 'first_air_date', 'vote_average'];

export const tvStatus: { [id: string]: string } = {
  All: 'All',
  0: 'Returning Series',
  1: 'Planned',
  2: 'In Production',
  3: 'Ended',
  4: 'Canceled',
  5: 'Pilot',
};

// export const tvType: { [id: string]: string } = {
//   0: 'Documentary',
//   1: 'News',
//   2: 'Miniseries',
//   3: 'Reality',
//   4: 'Scripted',
//   5: 'Talk Show',
//   6: 'Video',
// };

export const animeGenres: string[] = [
  'Action',
  'Adventure',
  'Cars',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
];

export const animeFormat: string[] = ['MOVIE', 'MUSIC', 'ONA', 'OVA', 'SPECIAL', 'TV_SHORT', 'TV'];

export const animeSort: string[] = [
  'popularity',
  'title-english',
  'score',
  'trending',
  'favourites',
  'episodes',
  'start-date',
  'updated-at',
];

export const animeSeason = ['FALL', 'SPRING', 'SUMMER', 'WINTER'];

export const animeStatus = ['CANCELLED', 'FINISHED', 'HIATUS', 'NOT_YET_RELEASED', 'RELEASING'];
