import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '~/utils';
import { motion, type PanInfo } from 'framer-motion';
import { tv, type VariantProps } from 'tailwind-variants';

import Close from '~/assets/icons/CloseIcon';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetPortal = ({ className, ...props }: SheetPrimitive.DialogPortalProps) => (
  <SheetPrimitive.Portal className={cn(className)} {...props} />
);
SheetPortal.displayName = SheetPrimitive.Portal.displayName;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-[9998] cursor-pointer bg-background/[0.6] backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetContentStyles = tv({
  base: 'fixed inset-y-0 z-[9999] w-[250px] bg-content1 !p-1 shadow-large transition ease-in-out will-change-transform focus:outline-none data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out sm:!p-6',
  variants: {
    side: {
      top: 'bottom-auto w-full rounded-b-large data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
      right:
        'right-0 h-full rounded-l-large data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
      bottom:
        'bottom-0 top-auto w-full rounded-t-large data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      left: 'left-0 h-full rounded-r-large data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
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
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetContentStyles> {
  hideCloseButton?: boolean;
  swipeDownToClose?: boolean;
  open?: boolean;
  onOpenChange?: () => void;
  container?: HTMLElement;
  classNames?: {
    portal?: string;
    overlay?: string;
    content?: string;
    closeButton?: string;
  };
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
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
      classNames,
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
      <SheetPortal container={container} className={cn(classNames?.portal)}>
        <SheetOverlay className={classNames?.overlay} />
        <SheetPrimitive.Content
          className={cn(
            sheetContentStyles({ side, size }),
            className ? className : classNames?.content,
          )}
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
              <div className="!m-[1rem_auto_0] h-1 w-[75px] rounded-small bg-default-foreground" />
            ) : null}
            {!hideCloseButton ? (
              <SheetPrimitive.Close className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-small opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 disabled:pointer-events-none">
                <Close className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
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
        </SheetPrimitive.Content>
      </SheetPortal>
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
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('font-semibold text-default-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
