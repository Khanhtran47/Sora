/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Container } from '@nextui-org/react';
import { RouteMatch } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';

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
        <BreadCrumb matches={matches} />
        <Container
          as="main"
          fluid
          css={{
            zIndex: 0,
            minHeight: '100vh',
            padding: '20px 0 0 0',
            margin: 0,
            '@sm': {
              paddingLeft: '20px',
              paddingRight: '20px',
            },
          }}
        >
          {children}
        </Container>
        <Copyright />
        <BottomNav />
      </Flex>
    </Container>
  );
};

export default Layout;
