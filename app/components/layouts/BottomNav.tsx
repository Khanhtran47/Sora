/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react';
import { NavLink, useLocation, useSearchParams } from '@remix-run/react';
import { tv } from 'tailwind-variants';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';

import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

import { Sheet, SheetTrigger, SheetContent } from '~/components/elements/Sheet';

import Home from '~/assets/icons/HomeIcon';
import Discover from '~/assets/icons/DiscoverIcon';
import Menu from '~/assets/icons/MenuIcon';
import Settings from '~/assets/icons/SettingsIcon';
import History from '~/assets/icons/HistoryIcon';
import Category from '~/assets/icons/CategoryIcon';
import LogIn from '~/assets/icons/LogInIcon';
import LogOut from '~/assets/icons/LogOutIcon';

interface IBottomNavProps {
  user?: User | undefined;
}

const BottomNav = (props: IBottomNavProps) => {
  const { user } = props;
  const [openMore, setOpenMore] = useState(false);
  const location = useLocation();
  const [search] = useSearchParams();
  const scrollDirection = useLayoutScrollPosition((state) => state.scrollDirection);
  const bottomNavItemStyles = tv({
    base: 'flex flex-col justify-center items-center gap-y-2 text-xs font-medium rounded-md bg-transparent text-text',
    variants: {
      active: {
        true: 'text-primary',
        false: '',
      },
    },
  });
  const ref = (search.get('ref') || location.pathname + location.search)
    .replace('?', '_0x3F_')
    .replace('&', '_0x26');

  const moreNavItems = [
    {
      name: 'Collections',
      icon: Category,
      path: '/collections',
    },
    {
      name: 'History',
      icon: History,
      path: '/watch-history',
    },
    ...(user
      ? [
          {
            name: 'Logout',
            icon: LogOut,
            path: `/sign-out?ref=${ref}`,
          },
        ]
      : [
          {
            name: 'Login',
            icon: LogIn,
            path: `/sign-in?ref=${ref}`,
          },
        ]),
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: scrollDirection === 'down' ? 65 : 0 }}
      transition={{ duration: 0.5 }}
      className="w-full fixed bottom-0 flex flex-row justify-around items-center flex-nowrap py-2 bg-background-alpha h-16 backdrop-blur-md sm:hidden border-t border-border drop-shadow-md z-[1000]"
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          bottomNavItemStyles({
            active: isActive,
          })
        }
      >
        {({ isActive }) => (
          <>
            <Home filled={isActive} />
            Home
          </>
        )}
      </NavLink>
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          bottomNavItemStyles({
            active: isActive,
          })
        }
      >
        {({ isActive }) => (
          <>
            <Discover filled={isActive} />
            Discover
          </>
        )}
      </NavLink>
      <Sheet open={openMore} onOpenChange={(open) => setOpenMore(open)}>
        <SheetTrigger asChild>
          <button type="button" className={bottomNavItemStyles()}>
            <Menu />
            More
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          hideCloseButton
          swipeDownToClose
          open={openMore}
          onOpenChange={() => setOpenMore(!openMore)}
        >
          <div className="grid grid-cols-3 xs:grid-cols-4 gap-x-3 gap-y-5 justify-center p-2 my-4">
            {moreNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  bottomNavItemStyles({
                    active: isActive,
                  })
                }
                onClick={() => setOpenMore(false)}
              >
                {({ isActive }) => (
                  <>
                    <item.icon filled={isActive} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default BottomNav;
