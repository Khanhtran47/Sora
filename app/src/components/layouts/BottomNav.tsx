import { Container, useTheme } from '@nextui-org/react';

import useMediaQuery from '~/hooks/useMediaQuery';
import useScrollDirection from '~/hooks/useScrollDirection';

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
  const scrollDirection = useScrollDirection();
  const isSm = useMediaQuery(650, 'max');

  return (
    <Container
      fluid
      display="flex"
      justify="space-between"
      alignItems="center"
      wrap="nowrap"
      className={`backdrop-blur-md border-t transition-all duration-500 ${
        isDark ? 'bg-black/70 border-t-slate-700' : ' border-t-slate-300 bg-white/70'
      }`}
      css={{
        position: 'fixed',
        bottom: isSm && scrollDirection === 'down' ? -64 : 0,
        height: 64,
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
