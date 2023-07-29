/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react';
import { NavLink, useLocation, useSearchParams } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { tv } from 'tailwind-variants';

import { useLayout } from '~/store/layout/useLayout';
import { Sheet, SheetContent, SheetTrigger } from '~/components/elements/Sheet';
import Category from '~/assets/icons/CategoryIcon';
import Discover from '~/assets/icons/DiscoverIcon';
import History from '~/assets/icons/HistoryIcon';
import Home from '~/assets/icons/HomeIcon';
import LogIn from '~/assets/icons/LogInIcon';
import LogOut from '~/assets/icons/LogOutIcon';
import Menu from '~/assets/icons/MenuIcon';
import Settings from '~/assets/icons/SettingsIcon';

interface IBottomNavProps {
  user?: User | undefined;
}

const BottomNav = (props: IBottomNavProps) => {
  const { user } = props;
  const { t } = useTranslation();
  const [openMore, setOpenMore] = useState(false);
  const location = useLocation();
  const [search] = useSearchParams();
  const scrollDirection = useLayout((state) => state.scrollDirection);
  const bottomNavItemStyles = tv({
    base: 'flex flex-col items-center justify-center gap-y-2 rounded-small bg-transparent text-xs font-medium text-foreground',
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
      name: 'lists',
      icon: Category,
      path: '/lists',
    },
    {
      name: 'watch-history',
      icon: History,
      path: '/watch-history',
    },
    ...(user
      ? [
          {
            name: 'logout',
            icon: LogOut,
            path: `/sign-out?ref=${ref}`,
          },
        ]
      : [
          {
            name: 'login',
            icon: LogIn,
            path: `/sign-in?ref=${ref}`,
          },
        ]),
    {
      name: 'settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: scrollDirection === 'down' ? 65 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 z-[4000] flex h-16 w-full flex-row flex-nowrap items-center justify-around border-t border-default-200 bg-background/[0.6] py-2 drop-shadow-md backdrop-blur-2xl backdrop-contrast-125 backdrop-saturate-200 sm:hidden"
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
            {t('home')}
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
            {t('discover')}
          </>
        )}
      </NavLink>
      <Sheet open={openMore} onOpenChange={(open) => setOpenMore(open)}>
        <SheetTrigger asChild>
          <button type="button" className={bottomNavItemStyles()}>
            <Menu />
            {t('more')}
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          size="content"
          hideCloseButton
          swipeDownToClose
          open={openMore}
          onOpenChange={() => setOpenMore(!openMore)}
        >
          <div className="my-4 grid grid-cols-3 items-center justify-center gap-x-3 gap-y-5 p-2 xs:grid-cols-4">
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
                    {t(item.name)}
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
