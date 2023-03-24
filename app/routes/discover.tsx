import { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Badge } from '@nextui-org/react';

import TabLink from '~/components/elements/tab/TabLink';

export const meta: MetaFunction = () => ({
  title: 'Discover Movies, TV Shows, Anime, People and More - Sora',
  description: 'Discover Movies, TV Shows, Anime, People and More',
  'og:url': 'https://sora-anime.vercel.app/discover',
  'og:title': 'Discover Movies, TV Shows, Anime, People and More - Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=discover',
  'og:description': 'Discover Movies, TV Shows, Anime, People and More',
});

const discoverPages = [
  { pageName: 'Discover Movies', pageLink: '/movies' },
  { pageName: 'Discover TV Shows', pageLink: '/tv-shows' },
  { pageName: 'Discover Anime', pageLink: '/anime' },
];

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
};

const DiscoverPage = () => {
  const location = useLocation();
  if (location.pathname === '/discover')
    return (
      <div className="w-full">
        <Outlet />
      </div>
    );
  return (
    <div className="w-full">
      <TabLink pages={discoverPages} linkTo="/discover" />
      <Outlet />
    </div>
  );
};

export default DiscoverPage;
