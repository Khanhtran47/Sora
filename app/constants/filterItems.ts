export const sortMovieTvItems = [
  'popularity.desc',
  'popularity.asc',
  'primary_release_date.desc',
  'primary_release_date.asc',
  'title.asc',
  'title.desc',
  'vote_average.desc',
  'vote_average.asc',
];

export const tvStatus: { [id: string]: string } = {
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
  'title_english',
  'title_romaji',
  'popularity_desc',
  'score_desc',
  'trending_desc',
  'favourites_desc',
  'start_date_desc',
];

export const animeSeason = ['FALL', 'SPRING', 'SUMMER', 'WINTER'];

export const animeStatus = ['CANCELLED', 'FINISHED', 'HIATUS', 'NOT_YET_RELEASED', 'RELEASING'];
