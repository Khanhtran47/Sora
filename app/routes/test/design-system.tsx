import type { MetaFunction } from '@remix-run/node';
import { NavLink, useLocation } from '@remix-run/react';
import { Container, Spacer, Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';

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
  title: 'Design System',
  description: 'This page for testing the design system',
  'og:title': 'Design System',
  'og:description': 'This page for testing the design system',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/design-system" aria-label="Design system Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Design System
        </Badge>
      )}
    </NavLink>
  ),
};

const DesignSystem = () => {
  const location = useLocation();
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
        <H2 h2>Design System</H2>
        <Spacer y={1} />
        <Tabs defaultValue="tab-one" orientation="horizontal">
          <ScrollArea
            css={{
              width: '100%',
              height: 50,
              maxWidth: 'calc(100vw - 1.5rem)',
              '@xs': {
                maxWidth: 'calc(100vw - 40px)',
              },
            }}
          >
            <ScrollAreaViewport>
              <TabsList>
                <TabsTrigger value="tab-one">General</TabsTrigger>
                <TabsTrigger value="tab-two">Hosting</TabsTrigger>
                <TabsTrigger value="tab-three">Editor</TabsTrigger>
                <TabsTrigger value="tab-four">Billing</TabsTrigger>
                <TabsTrigger value="tab-five">SEO</TabsTrigger>
                <TabsTrigger value="tab-six">Forms</TabsTrigger>
                <TabsTrigger value="tab-seven">Fonts</TabsTrigger>
                <TabsTrigger value="tab-eight">Backups</TabsTrigger>
                <TabsTrigger value="tab-nine">Integrations</TabsTrigger>
                <TabsTrigger value="tab-ten">Custom code</TabsTrigger>
              </TabsList>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="horizontal">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
            <ScrollAreaCorner />
          </ScrollArea>
          <TabsContent value="tab-one">
            <H6>Panel 1</H6>
          </TabsContent>
          <TabsContent value="tab-two">
            <H6>Panel 2</H6>
          </TabsContent>
          <TabsContent value="tab-three">
            <H6>Panel 3</H6>
          </TabsContent>
          <TabsContent value="tab-four">
            <H6>Panel 4</H6>
          </TabsContent>
          <TabsContent value="tab-five">
            <H6>Panel 5</H6>
          </TabsContent>
          <TabsContent value="tab-six">
            <H6>Panel 6</H6>
          </TabsContent>
          <TabsContent value="tab-seven">
            <H6>Panel 7</H6>
          </TabsContent>
          <TabsContent value="tab-eight">
            <H6>Panel 8</H6>
          </TabsContent>
          <TabsContent value="tab-nine">
            <H6>Panel 9</H6>
          </TabsContent>
          <TabsContent value="tab-ten">
            <H6>Panel 10</H6>
          </TabsContent>
        </Tabs>
      </Container>
    </motion.main>
  );
};

export default DesignSystem;
