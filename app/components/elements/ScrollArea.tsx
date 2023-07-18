import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '~/utils';
import { tv } from 'tailwind-variants';

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollViewport = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaViewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaViewport>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaViewport
    className={cn('h-full w-full rounded-[inherit]', className)}
    ref={ref}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.ScrollAreaViewport>
));
ScrollViewport.displayName = ScrollAreaPrimitive.ScrollAreaViewport.displayName;

const scrollbarStyles = tv({
  base: 'z-[9999] flex touch-none select-none p-[1px]',
  variants: {
    orientation: {
      vertical: 'h-full w-[7px]',
      horizontal: 'h-[7px] flex-col',
    },
  },
});
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={scrollbarStyles({ orientation, className })}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-default-800 duration-150 ease-out transition-background hover:bg-default-600" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

const ScrollCorner = ScrollAreaPrimitive.ScrollAreaCorner;

export { ScrollArea, ScrollBar, ScrollViewport, ScrollCorner };
