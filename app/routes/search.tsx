import { NavLink, Outlet } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import Tab from '~/src/components/elements/Tab';

const searchPage = [
  { pageName: 'searchMovies', pageLink: 'movie' },
  { pageName: 'searchTv', pageLink: 'tv' },
  { pageName: 'searchPeople', pageLink: 'people' },
];

export const handle = {
  breadcrumb: () => <NavLink to="/search">Search</NavLink>,
};

const SearchPage = () => (
  <Container fluid css={{ m: 0, p: 0 }}>
    <Tab pages={searchPage} linkTo="/search/" />

    <Outlet />
  </Container>
);

export default SearchPage;
