/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Container } from '@nextui-org/react';
import { RouteMatch } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';

import useMediaQuery from '~/hooks/useMediaQuery';

/* Components */
import Flex from '../styles/Flex.styles';
import Header from './Header';
import LeftDrawer from './LeftDrawer';
import Copyright from './Copyright';
import BottomNav from './BottomNav';
import BreadCrumb from './BreadCrumb';

interface ILayout {
  children: React.ReactNode;
  user?: User;
  matches: RouteMatch[];
}

const Layout = (props: ILayout) => {
  const { children, user, matches } = props;
  const [open, setOpen] = React.useState(false);
  const isSm = useMediaQuery(650, 'max');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Container
      justify="flex-end"
      className="!max-w-full"
      css={{
        display: 'flex',
        margin: 0,
        padding: 0,
        backgroundColor: '$backgroundContrast',
      }}
    >
      <LeftDrawer
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
      <Flex
        direction="column"
        justify="center"
        align="center"
        className="w-full"
        css={{
          backgroundColor: '$background',
          margin: 0,
          width: '100%',
          '@sm': {
            borderTopLeftRadius: '$xl',
            width: 'calc(100% - 65px)',
          },
        }}
      >
        <Header
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
          user={user}
        />
        <Container
          as="main"
          fluid
          css={{
            zIndex: 0,
            minHeight: '100vh',
            padding: 0,
            margin: 0,
            '@sm': {
              paddingLeft: '20px',
              paddingRight: '20px',
            },
          }}
        >
          <BreadCrumb matches={matches} />
          {children}
        </Container>
        <Copyright />
        {isSm ? <BottomNav /> : null}
      </Flex>
    </Container>
  );
};

export default Layout;
