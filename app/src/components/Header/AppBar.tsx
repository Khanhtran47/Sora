import * as React from 'react';
import { Grid, styled } from '@nextui-org/react';

const AppBarContainer = styled(Grid.Container, {
  // TODO: add transition on opening/closing drawer
  zIndex: 999,
  position: 'fixed',
});

interface IAppBarProps {
  children: React.ReactNode;
  className: string;
}

const AppBar = ({ children, className }: IAppBarProps) => (
  <AppBarContainer
    justify="space-between"
    alignItems="center"
    color="inherit"
    className={className}
    gap={2}
    wrap="nowrap"
    css={{
      width: '100%',
      height: 80,
      padding: 0,
      margin: 0,
    }}
  >
    {children}
  </AppBarContainer>
);

export default AppBar;
