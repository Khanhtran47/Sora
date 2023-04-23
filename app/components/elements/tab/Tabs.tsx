import React from 'react';
import { styled, type CSS } from '@nextui-org/react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';

import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '~/components/elements/scroll-area/ScrollArea';

export const Tabs = styled(TabsPrimitive.Root, {
  display: 'flex',
  columnGap: '$5',
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
  },
});

export const TabsTrigger = styled(TabsPrimitive.Trigger, {
  flexShrink: 0,
  display: 'flex',
  lineHeight: 1,
  fontSize: '$md',
  fontWeight: '$semibold',
  height: 50,
  p: '$md',
  userSelect: 'none',
  outline: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$slate11',
  border: '1px solid transparent',
  borderRadius: '$xs',
  zIndex: '10',
  '&:hover': {
    opacity: '0.8',
    // color: '$primarySolidHover',
    backgroundColor: '$primaryLightActive',
  },
  '&[data-disabled]': {
    color: '$neutral',
    cursor: 'not-allowed',
  },
  '&[data-state="active"]': {
    color: '$primary',
    backgroundColor: '$primaryLightActive',
  },
  '&[data-orientation="vertical"]': {
    justifyContent: 'flex-start',
    borderBottomColor: 'transparent',
    '&:hover': {
      opacity: '0.8',
      color: '$primarySolidHover',
    },
    '&[data-state="active"]': {
      backgroundColor: '$primaryLightActive',
    },
  },
  '&:focus': { backgroundColor: '$primaryLightActive' },
});

const StyledTabsList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: 'flex',
  rowGap: '$5',
  '&:focus': {
    outline: 'none',
  },
  '&[data-orientation="horizontal"]': {
    padding: '5px',
  },
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    padding: '5px',
  },
});

type TabsListPrimitiveProps = React.ComponentProps<typeof TabsPrimitive.List>;
type TabsListProps = TabsListPrimitiveProps & { css?: CSS };

export const TabsList = React.forwardRef<React.ElementRef<typeof StyledTabsList>, TabsListProps>(
  (props, forwardedRef) => (
    <ScrollArea
      type="scroll"
      scrollHideDelay={100}
      css={{
        height: 'auto',
        minWidth: 200,
        // backgroundColor: '$backgroundContrastLight',
        // borderRight: '1px solid $border',
        borderTopLeftRadius: '$sm',
        borderBottomLeftRadius: '$sm',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: 'none',
        '@xsMax': {
          width: '100%',
          height: 61,
          maxWidth: 'calc(100vw - 1.5rem)',
          borderBottom: '1px solid $border',
          borderRight: 'none',
          borderBottomLeftRadius: 0,
        },
      }}
    >
      <ScrollAreaViewport>
        <StyledTabsList {...props} ref={forwardedRef} />
      </ScrollAreaViewport>
      <ScrollAreaScrollbar
        orientation="horizontal"
        css={{
          padding: 0,
          margin: 2,
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
        }}
      >
        <ScrollAreaThumb
          css={{ backgroundColor: '$accents8', '&:hover': { background: '$accents6' } }}
        />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollArea>
  ),
);

TabsList.displayName = 'TabsList';

export const TabsContent = styled(TabsPrimitive.Content, {
  flexGrow: 1,
  // backgroundColor: '$backgroundContrastLight',
  minHeight: '75vh',
  borderBottomLeftRadius: '$sm',
  borderBottomRightRadius: '$sm',
  borderTopRightRadius: 0,
  borderTopLeftRadius: 0,
  '@xs': {
    px: 10,
    borderTopRightRadius: '$sm',
    borderBottomLeftRadius: 0,
  },
  '@md': {
    px: 20,
  },
  outline: 'none',
  '&:focus': {
    borderColor: '$primaryLightActive',
  },
});

export const Underline = styled(motion.div, {
  position: 'absolute',
  backgroundColor: '$primary',
  borderRadius: '4px',
  overflow: 'hidden',
});
