import { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import Tab from '~/src/components/elements/Tab';

export const meta: MetaFunction = () => ({
  title: 'Free Series HD - Watch Series and Movies HD Online on Sora',
  description:
    'Watch latest Tv series online in HD Quality. Unlimited streaming series for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sora-anime.vercel.app/tv-shows',
  'og:title': 'Free Series HD - Watch Series and Movies HD Online on Sora',
  'og:image': 'https://static.alphacoders.com/thumbs_categories/20.jpg',
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
      Tv Shows
    </NavLink>
  ),
};

const TvPage = () => {
  const location = useLocation();
  if (location.pathname.split('/')[2]?.match(/^\d+$/) || location.pathname === '/tv-shows')
    return (
      <Container fluid css={{ m: 0, p: 0 }}>
        <Outlet />
      </Container>
    );
  return (
    <Container fluid css={{ m: 0, p: 0 }}>
      <Tab pages={tvPage} linkTo="/tv-shows" />
      <Outlet />
    </Container>
  );
};

export default TvPage;
