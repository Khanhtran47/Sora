import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cnBase } from 'tailwind-variants';

import {
  ScrollArea,
  ScrollBar,
  ScrollCorner,
  ScrollViewport,
} from '~/components/elements/ScrollArea';

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cnBase('flex data-[orientation=horizontal]:flex-col', className)}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <ScrollArea
    type="scroll"
    scrollHideDelay={100}
    className="h-[61px] w-full rounded-bl-none sm:h-auto sm:w-[200px] sm:min-w-[200px] sm:rounded-l-sm sm:rounded-r-none"
  >
    <ScrollViewport>
      <TabsPrimitive.List
        ref={ref}
        className={cnBase(
          'bg-content1 inline-flex w-full shrink-0 gap-y-3 rounded-lg p-[5px] focus:outline-none data-[orientation=vertical]:flex-col',
          className,
        )}
        {...props}
      />
    </ScrollViewport>
    <ScrollBar />
    <ScrollCorner />
  </ScrollArea>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cnBase(
      'text-default-500 data-[state=active]:bg-default data-[state=active]:text-default-foreground z-10 inline-flex h-[50px] shrink-0 select-none items-center justify-center rounded-md p-3 outline-none hover:opacity-70 data-[disabled]:cursor-not-allowed data-[orientation=vertical]:justify-start data-[disabled]:text-gray-500 data-[disabled]:opacity-70',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cnBase(
      'min-h-[75vh] grow rounded-md outline-none sm:rounded-bl-none sm:rounded-tr-md sm:px-[10px] xl:px-5',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
