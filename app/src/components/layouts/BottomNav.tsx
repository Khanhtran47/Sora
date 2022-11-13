import { Container } from '@nextui-org/react';

import useMediaQuery from '~/hooks/useMediaQuery';
import useScrollDirection from '~/hooks/useScrollDirection';

import NavLink from '../elements/NavLink';

const pages = [
  {
    pageName: 'Movies',
    pageLink: 'movies',
  },
  {
    pageName: 'TV Shows',
    pageLink: 'tv-shows',
  },
  {
    pageName: 'Anime',
    pageLink: 'anime',
  },
];

const BottomNav = () => {
  const scrollDirection = useScrollDirection();
  const isSm = useMediaQuery('(max-width: 650px)');

  return (
    <Container
      fluid
      display="flex"
      justify="space-around"
      alignItems="center"
      wrap="nowrap"
      className="backdrop-blur-md transition-all duration-500"
      css={{
        backgroundColor: '$backgroundAlpha',
        position: 'fixed',
        bottom: isSm && scrollDirection === 'down' ? -64 : 10,
        height: 64,
        padding: 0,
        margin: 0,
        zIndex: 990,
        borderRadius: '$xl',
        width: 'calc(100% - 1rem)',
      }}
    >
      {pages.map((page) => (
        <NavLink linkTo={`/${page.pageLink}`} linkName={page.pageName} key={page.pageName} />
      ))}
    </Container>
  );
};

export default BottomNav;
