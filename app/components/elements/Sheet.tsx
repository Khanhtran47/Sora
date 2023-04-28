import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, type PanInfo } from 'framer-motion';
import { cnBase, tv, type VariantProps } from 'tailwind-variants';

import Close from '~/assets/icons/CloseIcon';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cnBase(
      'fixed inset-0 z-[9998] bg-background-alpha backdrop-blur-lg transition-all duration-300 data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sheetContentStyles = tv({
  base: 'fixed inset-y-0 z-[9999] w-[250px] bg-background-contrast !p-1 shadow-lg shadow-background-alpha will-change-transform focus:outline-none sm:!p-6',
  variants: {
    side: {
      top: 'bottom-auto w-full rounded-b-xl animate-in slide-in-from-top duration-300',
      right: 'right-0 h-full rounded-l-xl animate-in slide-in-from-right duration-300',
      bottom: 'bottom-0 top-auto w-full rounded-t-xl animate-in slide-in-from-bottom duration-300',
      left: 'left-0 h-full rounded-r-xl animate-in slide-in-from-left duration-300',
    },
    size: {
      content: '',
      default: '',
      sm: '',
      lg: '',
      xl: '',
      full: '',
    },
  },
  compoundVariants: [
    {
      side: ['top', 'bottom'],
      size: 'content',
      class: 'max-h-screen min-h-[150px]',
    },
    {
      side: ['top', 'bottom'],
      size: 'default',
      class: 'h-1/3 min-h-[150px]',
    },
    {
      side: ['top', 'bottom'],
      size: 'sm',
      class: 'h-1/4 min-h-[150px]',
    },
    {
      side: ['top', 'bottom'],
      size: 'lg',
      class: 'h-1/2 min-h-[150px]',
    },
    {
      side: ['top', 'bottom'],
      size: 'xl',
      class: 'h-5/6 min-h-[150px]',
    },
    {
      side: ['top', 'bottom'],
      size: 'full',
      class: 'h-screen',
    },
    {
      side: ['right', 'left'],
      size: 'content',
      class: 'max-w-screen min-w-[250px]',
    },
    {
      side: ['right', 'left'],
      size: 'default',
      class: 'w-1/3 min-w-[250px]',
    },
    {
      side: ['right', 'left'],
      size: 'sm',
      class: 'w-1/4 min-w-[250px]',
    },
    {
      side: ['right', 'left'],
      size: 'lg',
      class: 'w-1/2 min-w-[250px]',
    },
    {
      side: ['right', 'left'],
      size: 'xl',
      class: 'w-5/6 min-w-[250px]',
    },
    {
      side: ['right', 'left'],
      size: 'full',
      class: 'w-screen',
    },
  ],
  defaultVariants: {
    side: 'right',
    size: 'default',
  },
});

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetContentStyles> {
  hideCloseButton?: boolean;
  swipeDownToClose?: boolean;
  open?: boolean;
  onOpenChange?: () => void;
  container?: HTMLElement;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      children,
      hideCloseButton,
      swipeDownToClose,
      open,
      onOpenChange,
      container,
      className,
      side,
      size,
      ...props
    },
    forwardedRef,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 100 && open && onOpenChange && swipeDownToClose) {
        onOpenChange();
      }
    };
    return (
      <DialogPrimitive.Portal container={container}>
        <SheetOverlay />
        <DialogPrimitive.Content
          className={cnBase(sheetContentStyles({ side, size }), className)}
          {...props}
          ref={forwardedRef}
          asChild
        >
          <motion.div
            drag={swipeDownToClose ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            {swipeDownToClose ? (
              <div className="!m-[1rem_auto_0] h-1 w-[75px] rounded-md bg-border" />
            ) : null}
            {!hideCloseButton ? (
              <DialogPrimitive.Close className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-light-active focus:ring-offset-2 disabled:pointer-events-none">
                <Close className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            ) : null}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
              className={swipeDownToClose ? 'mt-2' : ''}
            >
              {children}
            </motion.div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);

SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cnBase('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cnBase('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cnBase('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cnBase('text-muted-foreground text-sm', className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
