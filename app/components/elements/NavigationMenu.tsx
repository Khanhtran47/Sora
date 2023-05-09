/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @typescript-eslint/indent */
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cnBase, tv } from 'tailwind-variants';

import ChevronRight from '~/assets/icons/ChevronRightIcon';

const NavigationMenuViewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className = '', ...props }, ref) => (
  <NavigationMenuPrimitive.Viewport
    className={cnBase(
      'data-[state=open]:fadeIn data-[state=closed]:fadeOut relative h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[12px] border border-border bg-background/60 shadow-lg backdrop-blur-md transition-[width,_height] duration-300 data-[orientation=horizontal]:mt-1.5 data-[orientation=vertical]:ml-[-8px] data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut sm:w-[var(--radix-navigation-menu-viewport-width)]',
      className,
    )}
    ref={ref}
    {...props}
  />
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenu = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    viewportPositionClassName?: string;
  }
>(({ className = '', children, viewportPositionClassName, orientation, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cnBase('relative z-10 flex flex-1 items-center justify-center', className)}
    {...props}
  >
    {children}
    <div
      data-orientation={orientation}
      className={cnBase(
        `absolute flex justify-center data-[orientation=vertical]:left-full
      data-[orientation=horizontal]:top-full data-[orientation=horizontal]:left-0`,
        viewportPositionClassName,
      )}
    >
      <NavigationMenuViewport />
    </div>
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const navigationMenuListStyles = tv({
  base: 'group flex flex-1 list-none items-center justify-center data-[orientation=vertical]:flex-col',
});
const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className = '', ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={navigationMenuListStyles({ class: className })}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = tv({
  base: `text-md group inline-flex h-10 w-max items-center justify-center
  rounded-md bg-transparent px-4 py-2 font-medium text-foreground transition-colors hover:bg-primary-100 hover:text-primary hover:opacity-80 focus:bg-primary-100 focus:text-primary focus:outline-none disabled:pointer-events-none
  disabled:opacity-50 data-[state=open]:bg-primary-200 data-[active]:bg-primary-200 data-[active]:text-primary data-[state=open]:text-primary`,
  variants: {
    active: {
      true: 'bg-primary-200 text-primary',
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
        className="relative top-[1px] ml-auto h-5 w-5 duration-400 transition group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    ) : null}
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const navigationMenuContentStyle = tv({
  base: `absolute top-0
  left-0 w-full data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft
  data-[motion=to-end]:animate-exitToRight sm:w-auto`,
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
  base: `top-full z-[1] flex
  h-2.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=visible]:fade-in data-[state=hidden]:fade-out`,
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
