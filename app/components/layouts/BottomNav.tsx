import { NavLink } from '@remix-run/react';
// import { Button } from '@nextui-org/react';
import { tv } from 'tailwind-variants';
import { motion } from 'framer-motion';

// import { useMediaQuery } from '@react-hookz/web';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

import Home from '~/assets/icons/HomeIcon';
import Discover from '~/assets/icons/DiscoverIcon';
import Menu from '~/assets/icons/MenuIcon';

const BottomNav = () => {
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
      <button type="button" className={bottomNavItemStyles()}>
        <Menu />
        More
      </button>
    </motion.div>
  );
};

export default BottomNav;
