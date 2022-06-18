import * as React from 'react';
import { Container } from '@nextui-org/react';

/* Components */
import Header from './Header';
import LeftDrawer from './LeftDrawer';
import Copyright from './Copyright';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Container fluid display="flex" wrap="wrap" direction="row" className="px-0 m-0">
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <LeftDrawer open={open} handleDrawerClose={handleDrawerClose} />
      <Container css={{ paddingTop: '94px', paddingLeft: '88px', zIndex: 0 }}>
        <main>
          {children}
          <Copyright />
        </main>
      </Container>
      {/* TODO add a search button (fixed position) to the right drawer for searching */}
    </Container>
  );
};

export default Layout;
