import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

/* Components */
import Header from './Header';
import LeftDrawer from './LeftDrawer';
import DrawerHeader from './DrawerHeader';
import Copyright from './Copyright';

function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <LeftDrawer open={open} handleDrawerClose={handleDrawerClose} theme={theme} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
        <Copyright />
      </Box>
      {/* TODO add a search button (fixed position) to the right drawer for searching */}
    </Box>
  );
}

export default Layout;
