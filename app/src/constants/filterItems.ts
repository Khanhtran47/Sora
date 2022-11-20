export const sortMovieItems = ['popularity', 'release_date', 'original_title', 'vote_average'];

export const sortTvItems = ['popularity', 'first_air_date', 'vote_average'];

export const tvStatus: { [id: string]: string } = {
  0: 'Returning Series',
  1: 'Planned',
  2: 'In Production',
  3: 'Ended',
  4: 'Canceled',
  5: 'Pilot',
};

export const tvType: { [id: string]: string } = {
  0: 'Documentary',
  1: 'News',
  2: 'Miniseries',
  3: 'Reality',
  4: 'Scripted',
  5: 'Talk Show',
  6: 'Video',
};
