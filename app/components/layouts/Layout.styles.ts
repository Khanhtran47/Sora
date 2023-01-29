import { Grid, Container, styled } from '@nextui-org/react';
import { Player } from '@lottiefiles/react-lottie-player';

export const drawerWidth = 250;

export const AppBar = styled(Grid.Container, {
  zIndex: 990,
  position: 'sticky',
  '@sm': {
    borderTopLeftRadius: '$xl',
  },
});

export const openedMixin = () => ({
  width: drawerWidth,
  transitionProperty: 'all',
  transitionDuration: '225ms',
  transitionTimingFunction: 'ease-out',
  transitionDelay: '0ms',
  overflowX: 'hidden',
  borderTopRightRadius: '$xl',
  borderBottomRightRadius: '$xl',
});

export const closedMixin = () => ({
  transitionProperty: 'all',
  transitionDuration: '195ms',
  transitionTimingFunction: 'ease-in',
  transitionDelay: '0ms',
  overflowX: 'hidden',
  width: 0,
  '@sm': {
    width: 65,
  },
});

export const Drawer = styled(Container, {
  flexGrow: 0,
  flexBasis: 'auto',
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  margin: 0,
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 999,
});

export const PlayerStyled = styled(Player, {
  '& path': {
    stroke: '$primary',
  },
});
