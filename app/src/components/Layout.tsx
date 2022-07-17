/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Container } from '@nextui-org/react';
import { useLocation } from '@remix-run/react';

/* Components */
import Header from './Header';
import LeftDrawer from './LeftDrawer';
import Copyright from './Copyright';
import BottomNav from './BottomNav';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Header
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />
      <LeftDrawer open={open} />
      <Container
        fluid
        responsive
        css={{
          zIndex: 0,
          margin: 0,
          ...(location.pathname !== '/'
            ? {
                paddingTop: '94px',
                paddingLeft: '88px',
              }
            : {
                paddingTop: '2px',
                paddingLeft: 0,
                paddingRight: 0,
              }),
        }}
      >
        {children}
        <Copyright />
      </Container>
      <BottomNav />
      {/* TODO add a search button (fixed position) to the right drawer for searching */}
    </>
  );
};

export default Layout;
