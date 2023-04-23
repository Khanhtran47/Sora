import { type MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { trendingPages } from '~/constants/tabLinks';

export const meta: MetaFunction = () => ({
  title: 'Watch Top Trending movies and tv shows free | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/trending',
  'og:title': 'Watch Top Trending movies and tv shows free | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
});

export const handle = {
  showTabLink: true,
  tabLinkPages: trendingPages,
  tabLinkTo: () => '/trending',
};

const Trending = () => <Outlet />;

export default Trending;
