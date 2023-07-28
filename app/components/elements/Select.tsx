import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '~/utils';

import ChevronDown from '~/assets/icons/ChevronDownIcon';
import ChevronUp from '~/assets/icons/ChevronUpIcon';
import Tick from '~/assets/icons/TickIcon';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between gap-3 rounded-medium bg-default !px-3 !py-2 text-sm text-default-foreground placeholder:text-default-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    container?: HTMLElement;
  }
>(({ className, children, container, position, ...props }, ref) => (
  <SelectPrimitive.Portal container={container}>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-[9999] min-w-[8rem] overflow-hidden rounded-medium border border-default-200 bg-content1 text-default-foreground shadow-xl shadow-default/10 animate-in fade-in-80',
        position === 'popper' ? 'translate-y-1' : '!p-1.5',
        className,
      )}
      position={position}
      {...props}
    >
      {position === 'item-aligned' ? (
        <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-content1 text-default-foreground">
          <ChevronUp className="h-4 w-4" />
        </SelectPrimitive.ScrollUpButton>
      ) : null}
      <SelectPrimitive.Viewport
        className={cn(
          '!p-1',
          position === 'popper'
            ? 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
            : '',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      {position === 'item-aligned' ? (
        <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-default text-default-foreground">
          <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.ScrollDownButton>
      ) : null}
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('!py-1.5 !pl-8 !pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-small !py-1.5 !pl-8 !pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-default data-[highlighted]:text-default-foreground data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Tick className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-primary-700', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
