/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Container } from '@nextui-org/react';
import { useLocation } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';

/* Components */
import Header from './Header';
import LeftDrawer from './LeftDrawer';
import Copyright from './Copyright';
import BottomNav from './BottomNav';

interface ILayout {
  children: React.ReactNode;
  user?: User;
}

const Layout = ({ children, user }: ILayout) => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Container
      fluid
      css={{
        margin: 0,
        padding: 0,
      }}
    >
      <Header
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        user={user ?? undefined}
      />
      <LeftDrawer open={open} />
      <Container
        as="main"
        fluid
        responsive
        css={{
          width: '100%',
          zIndex: 0,
          margin: 0,
          minHeight: '100vh',
          height: 'fit-content',
          ...(location.pathname === '/' || location.pathname.split('/')[2]?.match(/^\d+$/)
            ? {
                paddingTop: '2px',
                paddingLeft: 0,
                paddingRight: 0,
                '@xsMax': {
                  paddingBottom: '65px',
                },
              }
            : {
                paddingTop: '94px',
                paddingLeft: '88px',
                paddingRight: 0,
                '@xsMax': {
                  paddingLeft: 0,
                  paddingBottom: '65px',
                },
              }),
        }}
      >
        {children}
      </Container>
      <Copyright />
      <BottomNav />
      {/* TODO add a search button (fixed position) to the right drawer for searching */}
    </Container>
  );
};

export default Layout;
