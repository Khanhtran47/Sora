import type { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet } from '@remix-run/react';
import { Badge } from '@nextui-org/react';

import { discoverPages } from '~/constants/tabLinks';

export const meta: MetaFunction = () => ({
  title: 'Discover Movies, TV Shows, Anime, People and More - Sora',
  description: 'Discover Movies, TV Shows, Anime, People and More',
  'og:url': 'https://sora-anime.vercel.app/discover',
  'og:title': 'Discover Movies, TV Shows, Anime, People and More - Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=discover',
  'og:description': 'Discover Movies, TV Shows, Anime, People and More',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/discover" aria-label="Discover Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Discover
        </Badge>
      )}
    </NavLink>
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
};

const DiscoverPage = () => (
  <div className="w-full">
    <Outlet />
  </div>
);

export default DiscoverPage;
