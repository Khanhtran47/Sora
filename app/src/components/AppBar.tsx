import { styled } from '@mui/material/styles';
import { Container } from '@nextui-org/react';

interface AppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  position: 'fixed',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

export default AppBar;
