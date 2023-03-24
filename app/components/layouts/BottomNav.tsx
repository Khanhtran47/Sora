import { useState } from 'react';
import { NavLink } from '@remix-run/react';
import { tv } from 'tailwind-variants';
import { motion } from 'framer-motion';

import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

import { Sheet, SheetTrigger, SheetContent } from '~/components/elements/Sheet';

import Home from '~/assets/icons/HomeIcon';
import Discover from '~/assets/icons/DiscoverIcon';
import Menu from '~/assets/icons/MenuIcon';
import Settings from '~/assets/icons/SettingsIcon';
import History from '~/assets/icons/HistoryIcon';
import Category from '~/assets/icons/CategoryIcon';

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
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

const BottomNav = () => {
  const [openMore, setOpenMore] = useState(false);
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

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: scrollDirection === 'down' ? 65 : 0 }}
      transition={{ duration: 0.5 }}
      className="w-full fixed bottom-0 flex flex-row justify-around items-center flex-nowrap py-2 bg-background-alpha h-16 backdrop-blur-md sm:hidden border-t border-border drop-shadow-md"
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
