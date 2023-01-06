/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { styled, CSS, css } from '@nextui-org/react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import Box from '../../styles/Box.styles';

export const panelStyles = css({
  backgroundColor: '$backgroundConstrast',
  borderRadius: '$md',
  boxShadow: '$lg',
  overflow: 'hidden',
});

export const Panel = styled('div', panelStyles);

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const StyledContent = styled(PopoverPrimitive.Content, panelStyles, {
  minWidth: 100,
  minHeight: '$6',
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
