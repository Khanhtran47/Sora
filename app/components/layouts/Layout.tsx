/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { Container } from '@nextui-org/react';
import type { User } from '@supabase/supabase-js';

import { useMediaQuery } from '@react-hookz/web';

/* Components */
import Flex from '../styles/Flex.styles';
import Header from './Header';
import LeftDrawer from './LeftDrawer';
import Footer from './Footer';
import BottomNav from './BottomNav';
import BreadCrumb from './BreadCrumb';
import GlobalPlayer from './GlobalPlayer';

interface ILayout {
  children: React.ReactNode;
  user?: User;
}

const Layout = (props: ILayout) => {
  const { children, user } = props;
  const [open, setOpen] = React.useState(false);
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });

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
      <LeftDrawer open={open} setOpen={setOpen} />
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
            borderBottomLeftRadius: '$xl',
            width: 'calc(100% - 65px)',
          },
        }}
      >
        <Header open={open} user={user} setOpen={setOpen} />
        <Container
          as="main"
          fluid
          css={{
            zIndex: 0,
            minHeight: '100vh',
            padding: 0,
            margin: 0,
            '@xs': {
              paddingLeft: '20px',
              paddingRight: '20px',
            },
          }}
        >
          <BreadCrumb />
          <GlobalPlayer />
          {children}
        </Container>
        <Footer />
        {isSm ? <BottomNav /> : null}
      </Flex>
    </Container>
  );
};

export default Layout;
