import { NavLink, Outlet } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import Tab from '~/src/components/elements/Tab';

const searchPage = [
  { pageName: 'search.title.movie', pageLink: 'movie' },
  { pageName: 'search.title.tv', pageLink: 'tv' },
  { pageName: 'search.title.people', pageLink: 'people' },
  { pageName: 'search.title.anime', pageLink: 'anime' },
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
