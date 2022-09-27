/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Container } from '@nextui-org/react';
import { useLocation, RouteMatch } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';

/* Components */
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

const Layout = ({ children, user, matches }: ILayout) => {
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
      className="!max-w-full"
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
      <LeftDrawer open={open} handleDrawerClose={handleDrawerClose} />
      <BreadCrumb matches={matches} />
      <Container
        className="!max-w-full"
        as="main"
        css={{
          zIndex: 0,
          margin: 0,
          minHeight: '100vh',
          height: 'fit-content',
          ...(location.pathname === '/' ||
          location.pathname === '/anime' ||
          location.pathname.split('/')[2]?.match(/^\d+$/)
            ? {
                paddingTop: '8px',
                paddingLeft: 0,
                paddingRight: 0,
                '@xsMax': {
                  paddingBottom: '65px',
                },
              }
            : {
                paddingTop: '100px',
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
    </Container>
  );
};

export default Layout;
