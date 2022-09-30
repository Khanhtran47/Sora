import { NavLink, Outlet, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import Tab from '~/src/components/elements/Tab';

const animePage = [
  // { pageName: 'Discover Anime', pageLink: '/discover' },
  { pageName: 'Popular Anime', pageLink: '/popular' },
  { pageName: 'Trending Anime', pageLink: '/trending' },
];

export const handle = {
  breadcrumb: () => <NavLink to="/anime">Anime</NavLink>,
};

const AnimeIndexPage = () => {
  const location = useLocation();
  if (location.pathname.split('/')[2]?.match(/^\d+$/) || location.pathname === '/anime')
    return (
      <Container fluid css={{ m: 0, p: 0 }}>
        <Outlet />
      </Container>
    );
  return (
    <Container fluid css={{ m: 0, p: 0 }}>
      <Tab pages={animePage} linkTo="/anime" />
      <Outlet />
    </Container>
  );
};

export default AnimeIndexPage;
