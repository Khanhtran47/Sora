/* eslint-disable import/prefer-default-export */
export const CACHE_CONTROL = {
  home: 'private, max-age=300, stale-while-revalidate=604800',
  default: 'private, max-age=300, stale-while-revalidate=604800',
  popular: `public, max-age=${60 * 60 * 5}, s-maxage=1, stale-while-revalidate=${
    60 * 60 * 24 * 31
  }`,
  trending: `public, max-age=${60 * 60}, s-maxage=1, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  topRated: `public, max-age=${60 * 60 * 5}, s-maxage=1, stale-while-revalidate=${
    60 * 60 * 24 * 31
  }`,
  discover: `private, max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  search: `public, max-age=${60 * 60}, s-maxage=1, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  watch: `private, max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  movie: `public, max-age=${60 * 60}, s-maxage=1, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  tv: `public, max-age=${60 * 60}, s-maxage=1, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  anime: `public, max-age=${60 * 60}, s-maxage=1, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  person: `public, max-age=${60 * 60}, s-maxage=1, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  collection: `public, max-age=${60 * 60 * 5}, s-maxage=1, stale-while-revalidate=${
    60 * 60 * 24 * 31
  }`,
  detail: `public, max-age=${60 * 60 * 5}, s-maxage=1, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  season: `private, max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
  episode: `private, max-age=${60 * 5}, stale-while-revalidate=${60 * 60 * 24 * 31}`,
};
