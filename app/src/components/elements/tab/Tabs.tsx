import React from 'react';
import { styled, CSS } from '@nextui-org/react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

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
  backgroundColor: '$backgroundAlpha',
  '&:focus': {
    outline: 'none',
  },
  '&[data-orientation="horizontal"]': {
    borderBottom: '1px solid $border',
    padding: '5px 5px 0 5px',
  },
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    borderRight: '1px solid $border',
    padding: '5px 0 5px 5px',
  },
});

type TabsListPrimitiveProps = React.ComponentProps<typeof TabsPrimitive.List>;
type TabsListProps = TabsListPrimitiveProps & { css?: CSS };

export const TabsList = React.forwardRef<React.ElementRef<typeof StyledTabsList>, TabsListProps>(
  (props, forwardedRef) => <StyledTabsList {...props} ref={forwardedRef} />,
);

TabsList.displayName = 'TabsList';

export const TabsContent = styled(TabsPrimitive.Content, {
  flexGrow: 1,
  padding: 20,
  outline: 'none',
  '&:focus': {
    borderColor: '$primaryLightActive',
  },
});
