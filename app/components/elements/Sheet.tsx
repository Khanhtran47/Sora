import * as React from 'react';
import { cn } from '@nextui-org/theme';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, type PanInfo } from 'framer-motion';
import { tv, type VariantProps } from 'tailwind-variants';

import Close from '~/assets/icons/CloseIcon';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-[9998] cursor-pointer bg-background/[0.6] backdrop-blur-2xl backdrop-contrast-125 backdrop-saturate-200 duration-300 transition-all data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sheetContentStyles = tv({
  base: 'bg-content1 shadow-background/[0.6] fixed inset-y-0 z-[9999] w-[250px] !p-1 shadow-lg will-change-transform focus:outline-none sm:!p-6',
  variants: {
    side: {
      top: 'animate-in slide-in-from-top bottom-auto w-full rounded-b-xl duration-300',
      right: 'animate-in slide-in-from-right right-0 h-full rounded-l-xl duration-300',
      bottom: 'animate-in slide-in-from-bottom bottom-0 top-auto w-full rounded-t-xl duration-300',
      left: 'animate-in slide-in-from-left left-0 h-full rounded-r-xl duration-300',
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
    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 100 && open && onOpenChange && swipeDownToClose && side === 'bottom') {
        onOpenChange();
      }
    };
    return (
      <DialogPrimitive.Portal container={container}>
        <SheetOverlay />
        <DialogPrimitive.Content
          className={cn(sheetContentStyles({ side, size }), className)}
          {...props}
          ref={forwardedRef}
          asChild
        >
          <motion.div
            drag={swipeDownToClose && side === 'bottom' ? 'y' : false}
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 300 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
          >
            {swipeDownToClose && side === 'bottom' ? (
              <div className="bg-default-foreground !m-[1rem_auto_0] h-1 w-[75px] rounded-md" />
            ) : null}
            {!hideCloseButton ? (
              <DialogPrimitive.Close className="ring-offset-background focus:ring-primary-200 absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
                <Close className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            ) : null}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
              className={swipeDownToClose && side === 'bottom' ? '!mt-2' : ''}
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
  <div className={cn('flex flex-col gap-y-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse gap-y-2 sm:flex-row sm:justify-end sm:gap-x-2', className)}
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
    className={cn('font-semibold text-default-foreground', className)}
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
    className={cn('text-muted-foreground text-sm', className)}
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
