import { forwardRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cnBase } from 'tailwind-variants';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    container?: HTMLElement | undefined;
  }
>(({ className, align = 'center', sideOffset = 4, container, ...props }, ref) => (
  <PopoverPrimitive.Portal container={container}>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cnBase(
        'z-[9999] min-h-[50px] min-w-[100px] overflow-hidden rounded-xl border border-border bg-content1 p-1 text-neutral-foreground shadow-lg shadow-neutral/10 outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
