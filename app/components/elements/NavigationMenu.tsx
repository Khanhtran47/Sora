/* eslint-disable @typescript-eslint/indent */
import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { tv } from 'tailwind-variants';

import ChevronRight from '~/assets/icons/ChevronRightIcon';

const navigationMenuViewportStyle = tv({
  base: `origin-[top_center] data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut
  data-[state=open]:fadeIn data-[state=closed]:fadeOut relative data-[orientation=horizontal]:mt-1.5
  data-[orientation=vertical]:ml-[-8px] h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden
  rounded-[12px] border border-border shadow-lg transition-[width,_height] duration-300 bg-background-contrast-alpha
  sm:w-[var(--radix-navigation-menu-viewport-width)] backdrop-blur-md`,
});
const NavigationMenuViewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {
    orientation: NavigationMenuPrimitive.Orientation | undefined;
  }
>(({ className = '', orientation, ...props }, ref) => (
  <div
    data-orientation={orientation}
    className={`absolute flex justify-center data-[orientation=vertical]:left-full
      data-[orientation=horizontal]:top-full data-[orientation=horizontal]:left-0`}
  >
    <NavigationMenuPrimitive.Viewport
      className={navigationMenuViewportStyle({ class: className })}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const navigationMenuStyles = tv({
  base: 'relative z-10 flex flex-1 items-center justify-center',
});
const NavigationMenu = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className = '', children, orientation, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={navigationMenuStyles({ class: className })}
    {...props}
  >
    {children}
    <NavigationMenuViewport orientation={orientation} />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const navigationMenuListStyles = tv({
  base: 'group flex flex-1 data-[orientation=vertical]:flex-col list-none items-center justify-center',
});
const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> & {
    orientation: NavigationMenuPrimitive.Orientation | undefined;
  }
>(({ className = '', orientation, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={navigationMenuListStyles({ class: className })}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = tv({
  base: `inline-flex items-center justify-center rounded-md text-md font-medium transition-colors
  focus:outline-none focus:bg-primary-light-hover disabled:opacity-50 disabled:pointer-events-none
  bg-transparent hover:bg-primary-light-hover text-text data-[state=open]:bg-primary-light-active
  data-[active]:bg-primary-light-active h-10 group w-max hover:text-primary data-[active]:text-primary
  hover:opacity-80 focus:text-primary px-4 py-2 data-[state=open]:text-primary`,
  variants: {
    active: {
      true: 'bg-primary-light-active text-primary',
      false: '',
    },
  },
});

const NavigationMenuTrigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
    showArrow?: boolean;
  }
>(({ className = '', children, showArrow, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={navigationMenuTriggerStyle({ class: `group ${className}` })}
    {...props}
  >
    {children}{' '}
    {showArrow ? (
      <ChevronRight
        className="relative top-[1px] ml-auto h-5 w-5 transition duration-400 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    ) : null}
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const navigationMenuContentStyle = tv({
  base: `data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight
  data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0
  w-full sm:w-auto`,
});
const NavigationMenuContent = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className = '', ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={navigationMenuContentStyle({ class: className })}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const navigationMenuIndicatorStyle = tv({
  base: `data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=visible]:fade-in
  data-[state=hidden]:fade-out top-full z-[1] flex h-2.5 items-end justify-center overflow-hidden`,
});
const NavigationMenuIndicator = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className = '', ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={navigationMenuIndicatorStyle({ class: className })}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-slate-200 shadow-md dark:bg-slate-800" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
