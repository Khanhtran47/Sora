import { Container } from '@nextui-org/react';

import { useMediaQuery } from '@react-hookz/web';
import useScrollDirection from '~/hooks/useScrollDirection';

import { bottomNavPages } from '~/constants/navPages';

import NavLink from '~/components/elements/NavLink';

const BottomNav = () => {
  const scrollDirection = useScrollDirection();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });

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
      {bottomNavPages.map((page) => (
        <NavLink linkTo={`/${page.pageLink}`} linkName={page.pageName} key={page.pageName} />
      ))}
    </Container>
  );
};

export default BottomNav;
