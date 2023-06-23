import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { moviePages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta: MetaFunction = () => ({
  title: 'Free Movies HD - Watch Movies and Tv Series HD Online on Sora',
  description: 'Watch latest movies online in HD Quality. Unlimited streaming movies for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sora-anime.vercel.app/movies',
  'og:title': 'Free Movies HD - Watch Movies and Tv Series HD Online on Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=movies',
  'og:description':
    'Watch latest movies online in HD Quality. Unlimited streaming movies for free now',
});

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/movies" key="movies">
      Movies
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: moviePages,
  tabLinkTo: () => '/movies',
  hideTabLinkWithLocation: (locationPathname: string) => {
    if (locationPathname.split('/')[2]?.match(/^\d+$/) || locationPathname === '/movies')
      return true;
    return false;
  },
};

const MoviePage = () => <Outlet />;

export default MoviePage;
