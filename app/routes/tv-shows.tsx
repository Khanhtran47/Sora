import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { tvPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta: MetaFunction = () => ({
  title: 'Free Series HD - Watch Series and Movies HD Online on Sora',
  description:
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sorachill.vercel.app/tv-shows',
  'og:title': 'Free Series HD - Watch Series and Movies HD Online on Sora',
  'og:image': 'https://sorachill.vercel.app/api/ogimage?it=tvshows',
  'og:description':
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
});

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/tv-shows" key="tv-shows">
      Tv Shows
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: tvPages,
  tabLinkTo: () => '/tv-shows',
  hideTabLinkWithLocation: (locationPathname: string) => {
    if (locationPathname.split('/')[2]?.match(/^\d+$/) || locationPathname === '/tv-shows')
      return true;
    return false;
  },
};

const TvPage = () => <Outlet />;

export default TvPage;
