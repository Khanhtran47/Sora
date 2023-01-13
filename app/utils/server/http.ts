/* eslint-disable import/prefer-default-export */
export const CACHE_CONTROL = {
  home: 'private, max-age=300, stale-while-revalidate=604800',
  default: 'private max-age=300, stale-while-revalidate=604800',
  popular: `private, max-age=${60 * 60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  trending: `private, max-age=${60 * 60}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  topRated: `private, max-age=${60 * 60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  discover: `private, max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  search: `private, max-age=${60 * 60}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  watch: `private, max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  movie: `private, max-age=${60 * 60}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  tv: `private, max-age=${60 * 60}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  anime: `private, max-age=${60 * 60}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  person: `private, max-age=${60 * 60}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  collection: `private, max-age=${60 * 60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  detail: `private, max-age=${60 * 60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  season: `private, max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  episode: `private, max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
};
