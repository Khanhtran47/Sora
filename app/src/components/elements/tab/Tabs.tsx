import React from 'react';
import { styled, CSS } from '@nextui-org/react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '~/src/components/elements/scroll-area/ScrollArea';

export const Tabs = styled(TabsPrimitive.Root, {
  display: 'flex',
  boxShadow: '$sm',
  borderRadius: '$sm',
  backgroundColor: '$backgroundContrast',
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
  borderTopLeftRadius: '$xs',
  borderTopRightRadius: '$xs',
  zIndex: '10',
  '&:first-child': { borderTopLeftRadius: '$xs' },
  '&:last-child': { borderTopRightRadius: '$xs' },
  '&:hover': {
    opacity: '0.8',
    color: '$primarySolidHover',
  },
  '&[data-disabled]': {
    color: '$neutral',
    cursor: 'not-allowed',
  },
  '&[data-state="active"]': {
    color: '$primary',
    backgroundColor: '$backgroundContrast',
  },
  '&[data-orientation="vertical"]': {
    justifyContent: 'flex-start',
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '$xs',
    borderBottomColor: 'transparent',
    '&:hover': {
      opacity: '0.8',
      color: '$primarySolidHover',
    },
    '&[data-state="active"]': {
      backgroundColor: '$backgroundContrast',
    },
  },
  '&:focus': { backgroundColor: '$backgroundContrast' },
});

const StyledTabsList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: 'flex',
  '&:focus': {
    outline: 'none',
  },
  '&[data-orientation="horizontal"]': {
    padding: '5px 5px 0 5px',
  },
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    padding: '5px 0 5px 5px',
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
        backgroundColor: '$backgroundAlpha',
        borderRight: '1px solid $border',
        '@xsMax': {
          width: '100%',
          height: 55,
          maxWidth: 'calc(100vw - 1.5rem)',
          borderBottom: '1px solid $border',
          borderRight: 'none',
        },
      }}
    >
      <ScrollAreaViewport>
        <StyledTabsList {...props} ref={forwardedRef} />
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollArea>
  ),
);

TabsList.displayName = 'TabsList';

export const TabsContent = styled(TabsPrimitive.Content, {
  flexGrow: 1,
  py: 20,
  px: 5,
  '@xs': {
    px: 10,
  },
  '@md': {
    px: 20,
  },
  outline: 'none',
  '&:focus': {
    borderColor: '$primaryLightActive',
  },
});
