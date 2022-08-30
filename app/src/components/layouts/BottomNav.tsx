import { Container, useTheme } from '@nextui-org/react';

import NavLink from '../elements/NavLink';

const pages = [
  {
    pageName: 'Movies',
    pageLink: 'movies/discover',
  },
  {
    pageName: 'TV Shows',
    pageLink: 'tv-shows/discover',
  },
  {
    pageName: 'People',
    pageLink: 'people',
  },
];

const BottomNav = () => {
  const { isDark } = useTheme();

  return (
    <Container
      fluid
      display="flex"
      justify="space-between"
      alignItems="center"
      wrap="nowrap"
      className={`backdrop-blur-md border-t ${
        isDark ? 'bg-black/70 border-t-slate-700' : ' border-t-slate-300 bg-white/70'
      }`}
      css={{
        position: 'fixed',
        bottom: 0,
        height: 65,
        padding: 0,
        margin: 0,
        zIndex: 999,
        '@xs': {
          display: 'none',
        },
      }}
    >
      {pages.map((page) => (
        <NavLink linkTo={`/${page.pageLink}`} linkName={page.pageName} key={page.pageName} />
      ))}
    </Container>
  );
};

export default BottomNav;
