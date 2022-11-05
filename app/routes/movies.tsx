import { MetaFunction } from '@remix-run/node';
import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import Tab from '~/src/components/elements/Tab';

export const meta: MetaFunction = () => ({
  title: 'Free Movies HD - Watch Movies and Tv Series HD Online on Sora',
  description: 'Watch latest movies online in HD Quality. Unlimited streaming movies for free now',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, hd movies, stream movies, movies to stream, watch movies free',
  'og:url': 'https://sora-movies.vervel.app/movies',
  'og:title': 'Free Movies HD - Watch Movies and Tv Series HD Online on Sora',
  'og:image': 'https://static.alphacoders.com/thumbs_categories/20.jpg',
  'og:description':
    'Watch latest movies online in HD Quality. Unlimited streaming movies for free now',
});

const moviePage = [
  { pageName: 'Discover Movies', pageLink: '/discover' },
  { pageName: 'Popular Movies', pageLink: '/popular' },
  { pageName: 'Top Rated Movies', pageLink: '/top-rated' },
  { pageName: 'Upcoming Movies', pageLink: '/upcoming' },
];

export const handle = {
  breadcrumb: () => <NavLink to="/movies">Movies</NavLink>,
};

const MoviePage = () => {
  const location = useLocation();
  if (location.pathname.split('/')[2]?.match(/^\d+$/) || location.pathname === '/movies')
    return (
      <Container fluid css={{ m: 0, p: 0 }}>
        <Outlet />
      </Container>
    );
  return (
    <Container fluid css={{ m: 0, p: 0 }}>
      <Tab pages={moviePage} linkTo="/movies" />
      <Outlet />
    </Container>
  );
};

export default MoviePage;
