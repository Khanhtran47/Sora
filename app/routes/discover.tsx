import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { discoverPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta: MetaFunction = () => ({
  title: 'Discover Movies, TV Shows, Anime, People and More - Sora',
  description: 'Discover Movies, TV Shows, Anime, People and More',
  'og:url': 'https://sorachill.vercel.app/discover',
  'og:title': 'Discover Movies, TV Shows, Anime, People and More - Sora',
  'og:image': 'https://sorachill.vercel.app/api/ogimage?it=discover',
  'og:description': 'Discover Movies, TV Shows, Anime, People and More',
});

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/discover" key="discover">
      Discover
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: discoverPages,
  tabLinkTo: () => '/discover',
  hideTabLinkWithLocation: (locationPathname: string) => {
    if (locationPathname === '/discover') {
      return true;
    }
    return false;
  },
  miniTitle: () => ({
    title: 'Discover',
    showImage: false,
  }),
};

const DiscoverPage = () => <Outlet />;

export default DiscoverPage;
