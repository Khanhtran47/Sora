/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import { styled, keyframes, VariantProps, CSS, css, Button } from '@nextui-org/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, PanInfo } from 'framer-motion';

import Close from '~/assets/icons/CloseIcon';

const overlayStyles = css({
  backgroundColor: 'rgba(0, 0, 0, .15)',
});

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;

const fadeIn = keyframes({
  from: { opacity: '0' },
  to: { opacity: '1' },
});

const fadeOut = keyframes({
  from: { opacity: '1' },
  to: { opacity: '0' },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, overlayStyles, {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 9998,

  '&[data-state="open"]': {
    animation: `${fadeIn} 150ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },

  '&[data-state="closed"]': {
    animation: `${fadeOut} 150ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },
});

const slideIn = keyframes({
  from: { transform: '$$transformValue' },
  to: { transform: 'translate3d(0,0,0)' },
});

const slideOut = keyframes({
  from: { transform: 'translate3d(0,0,0)' },
  to: { transform: '$$transformValue' },
});

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: '$backgroundContrast',
  boxShadow: '$backgroundAlpha 0 0 38px -10px',
  position: 'fixed',
  top: 0,
  bottom: 0,
  width: 250,
  zIndex: 9999,
  padding: '$4',
  outline: 'none',

  // Among other things, prevents text alignment inconsistencies when dialog can't be centered in the viewport evenly.
  // Affects animated and non-animated dialogs alike.
  willChange: 'transform',

  // '&:focus': {
  //   outline: 'none',
  // },

  '&[data-state="open"]': {
    animation: `${slideIn} 300ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },

  '&[data-state="closed"]': {
    animation: `${slideOut} 300ms cubic-bezier(0.22, 1, 0.36, 1)`,
  },

  variants: {
    side: {
      top: {
        $$transformValue: 'translate3d(0,-100%,0)',
        width: '100%',
        height: 'auto',
        minHeight: 100,
        bottom: 'auto',
        borderBottomLeftRadius: '$lg',
        borderBottomRightRadius: '$lg',
        borderBottom: '1px solid $border',
      },
      right: {
        $$transformValue: 'translate3d(100%,0,0)',
        right: 0,
        borderTopLeftRadius: '$lg',
        borderBottomLeftRadius: '$lg',
        borderLeft: '1px solid $border',
      },
      bottom: {
        $$transformValue: 'translate3d(0,100%,0)',
        width: '100%',
        height: 'auto',
        minHeight: 100,
        bottom: 0,
        top: 'auto',
        borderTopLeftRadius: '$lg',
        borderTopRightRadius: '$lg',
        borderTop: '1px solid $border',
      },
      left: {
        $$transformValue: 'translate3d(-100%,0,0)',
        left: 0,
        borderTopRightRadius: '$lg',
        borderBottomRightRadius: '$lg',
        borderRight: '1px solid $border',
      },
    },
  },

  defaultVariants: {
    side: 'right',
  },
});

const StyledCloseButton = styled(DialogPrimitive.Close, {
  position: 'absolute',
  top: '$2',
  right: '$2',
});

const Handle = styled('div', {
  width: '75px',
  height: '4px',
  backgroundColor: '$border',
  borderRadius: '$sm',
  margin: '1rem auto 0 !important',
});

type SheetContentVariants = VariantProps<typeof StyledContent>;
type DialogContentPrimitiveProps = React.ComponentProps<typeof DialogPrimitive.Content>;
type SheetContentProps = DialogContentPrimitiveProps &
  SheetContentVariants & {
    css?: CSS;
    hideCloseButton?: boolean;
    swipeDownToClose?: boolean;
    open?: boolean;
    onOpenChange?: () => void;
    container?: HTMLElement;
  };

const SheetContent = React.forwardRef<React.ElementRef<typeof StyledContent>, SheetContentProps>(
  (
    { children, hideCloseButton, swipeDownToClose, open, onOpenChange, container, ...props },
    forwardedRef,
  ) => {
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 100 && open && onOpenChange && swipeDownToClose) {
        onOpenChange();
      }
    };
    return (
      <DialogPrimitive.Portal container={container}>
        <StyledOverlay />
        <StyledContent {...props} ref={forwardedRef} asChild>
          <motion.div
            drag={swipeDownToClose ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            {swipeDownToClose ? <Handle /> : null}
            {!hideCloseButton ? (
              <StyledCloseButton asChild>
                <Button type="button" auto light icon={<Close />} />
              </StyledCloseButton>
            ) : null}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
            >
              {children}
            </motion.div>
          </motion.div>
        </StyledContent>
      </DialogPrimitive.Portal>
    );
  },
);

SheetContent.displayName = 'SheetContent';

const SheetClose = DialogPrimitive.Close;
const SheetTitle = DialogPrimitive.Title;
const SheetDescription = DialogPrimitive.Description;

export { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle, SheetDescription };
