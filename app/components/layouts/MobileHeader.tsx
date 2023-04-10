import { useMemo } from 'react';
import { useMatches, useLocation, NavLink, useNavigate } from '@remix-run/react';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { tv } from 'tailwind-variants';

import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

import { H2 } from '~/components/styles/Text.styles';

import Arrow from '~/assets/icons/ArrowIcon';
import Search from '~/assets/icons/SearchIcon';

const mobileHeaderStyles = tv({
  base: 'h-[64px] w-[100vw] fixed top-0 z-[1000] px-3 py-2 flex flex-row justify-between items-center sm:hidden shadow-none',
  variants: {
    backgroundColor: {
      light: 'bg-background-contrast-alpha',
      none: 'bg-transparent',
    },
  },
  defaultVariants: {
    backgroundColor: 'none',
  },
});

const MobileHeader = () => {
  const matches = useMatches();
  const location = useLocation();
  const navigate = useNavigate();
  const { historyBack } = useHistoryStack((state) => state);
  const isShowMobileHeader = !matches.some((match) => match.handle?.hideMobileHeader === true);
  const isShowTabLink = useMemo(
    () => matches.some((match) => match.handle?.showTabLink === true),
    [matches],
  );
  const hideTabLinkWithLocation: boolean = useMemo(() => {
    const currentMatch = matches.find((match) => match.handle?.showTabLink);
    if (currentMatch?.handle?.hideTabLinkWithLocation)
      return currentMatch?.handle?.hideTabLinkWithLocation(location.pathname);
    return false;
  }, [matches, location.pathname]);
  const backgroundColor = useMemo(() => {
    const currentMatch = matches.find((match) => match.handle?.backgroundColor !== undefined);
    if (currentMatch?.handle?.backgroundColor) return currentMatch?.handle?.backgroundColor;
    return 'none';
  }, [matches]);
  const handleBackButton = () => {
    if (historyBack.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const scrollDirection = useLayoutScrollPosition((state) => state.scrollDirection);

  if (!isShowMobileHeader) {
    return null;
  }
  if (location.pathname === '/') {
    return (
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: scrollDirection === 'down' ? -65 : 0 }}
        transition={{ duration: 0.5 }}
        className="h-[64px] w-full fixed top-0 z-[1000] px-6 flex flex-row justify-between items-center bg-background-contrast-alpha backdrop-blur-md sm:hidden shadow-lg"
      >
        <NavLink to="/" arial-label="home-page">
          <H2
            h2
            css={{
              textGradient: '45deg, $primary, $secondary 50%',
              fontFamily: 'monospace',
              letterSpacing: '0.3rem',
              textDecoration: 'none',
            }}
          >
            SORA
          </H2>
        </NavLink>
        <Button
          auto
          light
          color="primary"
          icon={<Search filled />}
          onPress={() => navigate('/search/movie')}
        />
      </motion.div>
    );
  }
  return (
    <div className={mobileHeaderStyles({ backgroundColor })}>
      <div
        className="absolute top-0 left-0 w-full z-[-1]"
        style={{
          height: isShowTabLink && !hideTabLinkWithLocation ? 112 : 64,
          backgroundColor:
            backgroundColor === 'none' ? 'var(--nextui-colors-backgroundContrast)' : 'transparent',
        }}
      />
      <Button auto light icon={<Arrow direction="left" />} onPress={() => handleBackButton()} />
    </div>
  );
};

export default MobileHeader;
