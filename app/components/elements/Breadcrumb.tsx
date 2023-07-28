import * as React from 'react';
import { NavLink } from '@remix-run/react';
import { cn } from '~/utils';

import ChevronRight from '~/assets/icons/ChevronRightIcon';

function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  ) as React.ReactElement[];
}

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  /* The visual separator between each breadcrumb item */
  separator?: React.ReactNode;
  /**
   * If `true`, adds a separator between each breadcrumb item.
   * @default true
   */
  addSeparator?: boolean;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      children,
      className,
      separator = <ChevronRight className="h-4 w-4" />,
      addSeparator = true,
      ...props
    },
    forwardedRef,
  ) => {
    const validChildren = getValidChildren(children);
    const clones = validChildren.map((child, index) => {
      if (child.type === BreadcrumbItem) {
        return React.cloneElement(child, {
          addSeparator,
          separator,
          isLastChild: validChildren.length === index + 1,
        });
      }
      if (child.type === React.Fragment) {
        const fragmentChildren = getValidChildren(child.props.children);
        const fragmentClones = fragmentChildren.map((fragmentChild, fragmentIndex) => {
          return React.cloneElement(fragmentChild, {
            addSeparator,
            separator,
            isLastChild:
              fragmentChildren.length === fragmentIndex + 1 && validChildren.length === index + 1,
          });
        });
        return fragmentClones;
      }
      return child;
    });

    return (
      <nav
        className={cn('relative break-words', className)}
        aria-label="breadcrumb"
        {...props}
        ref={forwardedRef}
      >
        <ol className="flex items-center">{clones}</ol>
      </nav>
    );
  },
);
Breadcrumb.displayName = 'Breadcrumb';

export interface BreadcrumbItemProps extends BreadcrumbProps {
  isLastChild?: boolean;
  to: string;
  classNames?: {
    navlink?: string;
    separator?: string;
  };
}

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (
    { children, className, classNames, isLastChild, separator, addSeparator, to, ...props },
    forwardedRef,
  ) => (
    <li className={cn('inline-flex items-center', className)} {...props} ref={forwardedRef}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            `text-sm font-medium ${
              isActive
                ? 'pointer-events-none aria-[current]:opacity-60'
                : 'underline-offset-4 hover:underline'
            } focus:outline-none focus:ring-2 focus:ring-focus`,
            classNames?.navlink,
          )
        }
        end
      >
        {children}
      </NavLink>
      {!isLastChild && addSeparator && (
        <BreadcrumbSeparator className={classNames?.separator}>{separator}</BreadcrumbSeparator>
      )}
    </li>
  ),
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export type BreadcrumbSeparatorProps = React.ComponentPropsWithoutRef<'span'>;

export const BreadcrumbSeparator = React.forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <span
        className={cn('mx-2 opacity-50', className)}
        role="presentation"
        {...props}
        ref={forwardedRef}
      />
    );
  },
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
