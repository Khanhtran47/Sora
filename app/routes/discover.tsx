import { Outlet } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import { discoverPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Discover' },
  { name: 'description', content: 'Discover Movies, TV Shows, Anime, People and More' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/discover' },
  { property: 'og:title', content: 'Sora - Discover' },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=discover' },
  { property: 'og:description', content: 'Discover Movies, TV Shows, Anime, People and More' },
  { name: 'twitter:title', content: 'Sora - Discover' },
  { name: 'twitter:description', content: 'Discover Movies, TV Shows, Anime, People and More' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=discover' },
]);

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
