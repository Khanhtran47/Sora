/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { useMatches, useLocation, NavLink, useNavigate } from '@remix-run/react';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';

import { H2 } from '~/components/styles/Text.styles';

import Arrow from '~/assets/icons/ArrowIcon';
import Search from '~/assets/icons/SearchIcon';

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
  const customHeaderBackgroundColor = useMemo(
    () => matches.some((match) => match?.handle?.customHeaderBackgroundColor === true),
    [location.pathname],
  );
  const customHeaderChangeColorOnScroll = useMemo(
    () => matches.some((match) => match?.handle?.customHeaderChangeColorOnScroll === true),
    [location.pathname],
  );
  const handleBackButton = () => {
    if (historyBack.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const { scrollDirection, scrollPosition } = useLayoutScrollPosition((state) => state);
  const { backgroundColor, startChangeScrollPosition } = useHeaderStyle((state) => state);
  const headerBackgroundColor = useMemo(() => {
    if (customHeaderBackgroundColor) {
      return backgroundColor;
    }
    return 'var(--nextui-colors-backgroundContrastAlpha)';
  }, [customHeaderBackgroundColor, backgroundColor]);

  const headerBackgroundOpacity = useMemo(() => {
    switch (customHeaderChangeColorOnScroll) {
      case true:
        if (startChangeScrollPosition === 0) {
          return 0;
        }
        if (
          scrollPosition.y > startChangeScrollPosition &&
          scrollPosition.y < startChangeScrollPosition + 100 &&
          scrollPosition.y > 80 &&
          startChangeScrollPosition > 0
        ) {
          return (scrollPosition.y - startChangeScrollPosition) / 100;
        }
        if (scrollPosition.y > startChangeScrollPosition + 100) {
          return 1;
        }
        return 0;
      case false:
        return scrollPosition.y < 80 ? scrollPosition.y / 80 : 1;
      default:
        return scrollPosition.y < 80 ? scrollPosition.y / 80 : 1;
    }
  }, [customHeaderChangeColorOnScroll, scrollPosition.y, startChangeScrollPosition]);

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
    <div className="h-[64px] w-[100vw] fixed top-0 z-[1000] px-3 py-2 flex flex-row justify-between items-center sm:hidden shadow-none">
      <div
        className="absolute top-0 left-0 w-full z-[-1] backdrop-blur-md"
        style={{
          opacity: headerBackgroundOpacity,
          backgroundColor: headerBackgroundColor,
          height: isShowTabLink && !hideTabLinkWithLocation ? 112 : 64,
        }}
      >
        {customHeaderBackgroundColor ? (
          <div className="w-full h-full pointer-events-none bg-background-light" />
        ) : null}
      </div>
      <Button
        auto
        light
        rounded
        css={{ backgroundColor: '$backgroundAlpha' }}
        icon={<Arrow direction="left" />}
        onPress={() => handleBackButton()}
      />
    </div>
  );
};

export default MobileHeader;
