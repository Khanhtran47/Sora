import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import Tab from '~/src/components/elements/Tab';

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

  return (
    <Container fluid css={{ m: 0, p: 0 }}>
      {!location.pathname.split('/')[2]?.match(/^\d+$/) && (
        <Tab pages={moviePage} linkTo="/movies" />
      )}

      <Outlet />
    </Container>
  );
};

export default MoviePage;
