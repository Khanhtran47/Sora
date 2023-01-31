/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { styled, CSS, css, keyframes } from '@nextui-org/react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import Box from '~/components/styles/Box.styles';

export const panelStyles = css({
  backgroundColor: '$backgroundConstrast',
  borderRadius: '$md',
  boxShadow: '$lg',
  overflow: 'hidden',
});

export const Panel = styled('div', panelStyles);

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(40px) scale(0.5)' },
  '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-40px) scale(0.5)' },
  '100%': { opacity: 1, transform: 'translateX(0) scale(1)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-40px) scale(0.5)' },
  '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(40px) scale(0.5)' },
  '100%': { opacity: 1, transform: 'translateX(0) scale(1)' },
});

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const StyledContent = styled(PopoverPrimitive.Content, panelStyles, {
  minWidth: 100,
  minHeight: '$6',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
  '&:focus': {
    outline: 'none',
  },
});

type PopoverContentPrimitiveProps = React.ComponentProps<typeof PopoverPrimitive.Content>;
type PopoverContentProps = PopoverContentPrimitiveProps & {
  css?: CSS;
  hideArrow?: boolean;
  container?: HTMLElement;
};

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof StyledContent>,
  PopoverContentProps
>(({ children, hideArrow, container = document.body, ...props }, fowardedRef) => (
  <PopoverPrimitive.Portal container={container}>
    <StyledContent sideOffset={0} {...props} ref={fowardedRef}>
      {children}
      {!hideArrow && (
        <Box css={{ color: '$backgroundContrast' }}>
          <PopoverPrimitive.Arrow width={11} height={5} style={{ fill: 'currentColor' }} />
        </Box>
      )}
    </StyledContent>
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = 'PopoverContent';

const PopoverClose = PopoverPrimitive.Close;

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };
