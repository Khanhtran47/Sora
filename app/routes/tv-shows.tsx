import { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';

import TabLink from '~/components/elements/tab/TabLink';

export const meta: MetaFunction = () => ({
  title: 'Free Series HD - Watch Series and Movies HD Online on Sora',
  description:
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sora-anime.vercel.app/tv-shows',
  'og:title': 'Free Series HD - Watch Series and Movies HD Online on Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=tvshows',
  'og:description':
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
});

const tvPage = [
  { pageName: 'Discover Tv Shows', pageLink: '/discover' },
  { pageName: 'Popular Tv Shows', pageLink: '/popular' },
  { pageName: 'Top Rated Tv Shows', pageLink: '/top-rated' },
  { pageName: 'On the air Tv Shows', pageLink: '/on-tv' },
];

export const handle = {
  breadcrumb: () => (
    <NavLink to="/tv-shows" aria-label="Tv Series Page">
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
          Tv Shows
        </Badge>
      )}
    </NavLink>
  ),
};

const TvPage = () => {
  const location = useLocation();
  if (location.pathname.split('/')[2]?.match(/^\d+$/) || location.pathname === '/tv-shows')
    return (
      <Container fluid responsive={false} css={{ m: 0, p: 0 }}>
        <Outlet />
      </Container>
    );
  return (
    <Container fluid responsive={false} css={{ m: 0, p: 0 }}>
      <TabLink pages={tvPage} linkTo="/tv-shows" />
      <Outlet />
    </Container>
  );
};

export default TvPage;
