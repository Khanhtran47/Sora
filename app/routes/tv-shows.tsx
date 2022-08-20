import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import Tab from '~/src/components/elements/Tab';

const tvPage = [
  { pageName: 'Discover Tv Shows', pageLink: '/discover' },
  { pageName: 'Popular Tv Shows', pageLink: '/popular' },
  { pageName: 'Top Rated Tv Shows', pageLink: '/top-rated' },
  { pageName: 'On the air Tv Shows', pageLink: '/on-tv' },
];

export const handle = {
  breadcrumb: () => <NavLink to="/tv-shows">Tv Shows</NavLink>,
};

const TvPage = () => {
  const location = useLocation();

  return (
    <Container fluid css={{ m: 0, p: 0 }}>
      {!location.pathname.split('/')[2]?.match(/^\d+$/) && (
        <Tab pages={tvPage} linkTo="/tv-shows" />
      )}

      <Outlet />
    </Container>
  );
};

export default TvPage;
