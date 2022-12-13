import type { MetaFunction } from '@remix-run/node';
import { NavLink, useLocation } from '@remix-run/react';
import { Container, Spacer } from '@nextui-org/react';
import { motion } from 'framer-motion';

import useMediaQuery from '~/hooks/useMediaQuery';

import { H2, H6 } from '~/src/components/styles/Text.styles';
// import Flex from '~/src/components/styles/Flex.styles';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/src/components/elements/tab/Tabs';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '~/src/components/elements/scroll-area/ScrollArea';

export const meta: MetaFunction = () => ({
  title: 'Settings',
  description: 'Settings',
  'og:title': 'Settings',
  'og:description': 'Settings',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/settings" aria-label="Settings Page">
      Settings
    </NavLink>
  ),
};

const Settings = () => {
  const location = useLocation();
  const isSm = useMediaQuery('(max-width: 650px)');
  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          padding: '0 $sm',
          '@xs': {
            padding: 0,
          },
        }}
      >
        <H2 h2 css={{ '@xsMax': { fontSize: '1.75rem !important' } }}>
          Settings
        </H2>
        <Spacer y={1} />
        <Tabs defaultValue="general-tab" orientation={isSm ? 'horizontal' : 'vertical'}>
          <ScrollArea
            type="scroll"
            scrollHideDelay={100}
            css={{
              height: '100%',
              '@xsMax': {
                width: '100%',
                height: 50,
                maxWidth: 'calc(100vw - 1.5rem)',
              },
            }}
          >
            <ScrollAreaViewport>
              <TabsList>
                <TabsTrigger value="general-tab">General</TabsTrigger>
                <TabsTrigger value="appearance-tab">Appearance</TabsTrigger>
                <TabsTrigger value="account-tab">Account</TabsTrigger>
                <TabsTrigger value="player-tab">Player</TabsTrigger>
                <TabsTrigger value="about-tab">About</TabsTrigger>
              </TabsList>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="horizontal">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
            <ScrollAreaCorner />
          </ScrollArea>
          <TabsContent value="general-tab">
            <H6>Panel 1</H6>
          </TabsContent>
          <TabsContent value="appearance-tab">
            <H6>Panel 2</H6>
          </TabsContent>
          <TabsContent value="account-tab">
            <H6>Panel 3</H6>
          </TabsContent>
          <TabsContent value="player-tab">
            <H6>Panel 4</H6>
          </TabsContent>
          <TabsContent value="about-tab">
            <H6>Panel 5</H6>
          </TabsContent>
        </Tabs>
      </Container>
    </motion.main>
  );
};

export default Settings;
