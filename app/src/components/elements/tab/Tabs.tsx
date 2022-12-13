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
  borderTopLeftRadius: '$sm',
  borderTopRightRadius: '$sm',
  zIndex: '10',
  '&:first-child': { borderTopLeftRadius: '$sm' },
  '&:last-child': { borderTopRightRadius: '$sm' },
  '&:hover': {
    opacity: '0.8',
    color: '$primarySolidHover',
    borderBottomColor: '$primary',
  },
  '&[data-state="active"]': {
    color: '$primary',
    borderBottomColor: '$primary',
    backgroundColor: '$backgroundContrast',
  },
  '&[data-orientation="vertical"]': {
    justifyContent: 'flex-start',
    borderTopRightRadius: 0,
    borderBottomLeftRadius: '$sm',
    borderBottomColor: 'transparent',
    '&:hover': {
      opacity: '0.8',
      color: '$primarySolidHover',
      borderRightColor: '$primary',
    },
    '&[data-state="active"]': {
      borderRightColor: '$primary',
      backgroundColor: '$backgroundContrast',
    },
  },
  '&:focus': { borderColor: '$primaryLightActive' },
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
  },
  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    borderRight: '1px solid $border',
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
