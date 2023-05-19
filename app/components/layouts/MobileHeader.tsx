import { Button } from '@nextui-org/button';
import { NavLink, useLocation, useNavigate } from '@remix-run/react';
import { motion, useTransform } from 'framer-motion';

import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayout } from '~/store/layout/useLayout';
import { useHeaderOptions } from '~/hooks/useHeader';
import Arrow from '~/assets/icons/ArrowIcon';
import Search from '~/assets/icons/SearchIcon';

const MobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { historyBack } = useHistoryStack((state) => state);
  const { scrollY } = useLayout((state) => state);
  const { startChangeScrollPosition } = useHeaderStyle((state) => state);
  const {
    isShowMobileHeader,
    isShowTabLink,
    hideTabLinkWithLocation,
    customHeaderBackgroundColor,
    currentMiniTitle,
    headerBackgroundColor,
    customHeaderChangeColorOnScroll,
  } = useHeaderOptions();
  const opacity = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 80],
    [0, 0, customHeaderChangeColorOnScroll ? (startChangeScrollPosition ? 1 : 0) : 1],
  );
  const y = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 80],
    [60, 60, customHeaderChangeColorOnScroll ? (startChangeScrollPosition ? 0 : 60) : 0],
  );
  const handleBackButton = () => {
    if (historyBack.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const { scrollDirection } = useLayout((state) => state);

  if (!isShowMobileHeader) {
    return null;
  }
  if (location.pathname === '/') {
    return (
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: scrollDirection === 'down' ? -65 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-[1000] flex h-[64px] w-full flex-row items-center justify-between bg-neutral/60 px-6 shadow-lg backdrop-blur-md sm:hidden"
      >
        <NavLink
          to="/"
          arial-label="home-page"
          className="bg-gradient-to-tr from-primary to-secondary to-50% bg-clip-text text-3xl font-bold tracking-normal text-transparent md:text-4xl"
        >
          SORA
        </NavLink>
        <Button
          variant="light"
          color="primary"
          isIconOnly
          onPress={() => navigate('/search/movie')}
        >
          <Search filled />
        </Button>
      </motion.div>
    );
  }
  return (
    <div className="fixed top-0 z-[1000] flex h-[64px] w-[100vw] flex-row items-center justify-start gap-x-3 px-3 py-2 shadow-none sm:hidden">
      <motion.div
        className="absolute left-0 top-0 z-[-1] w-full backdrop-blur-md"
        style={{
          opacity,
          backgroundColor: headerBackgroundColor,
          height: isShowTabLink && !hideTabLinkWithLocation ? 112 : 64,
        }}
      >
        {customHeaderBackgroundColor ? (
          <div className="pointer-events-none h-full w-full bg-background/[0.2]" />
        ) : null}
      </motion.div>
      <Button variant="faded" radius="full" isIconOnly onPress={() => handleBackButton()}>
        <Arrow direction="left" />
      </Button>
      <div className="flex flex-row items-center justify-between">
        {currentMiniTitle ? (
          <motion.span
            style={{ opacity, y }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-start justify-center"
          >
            <div className="flex flex-col items-start justify-center">
              <span className="line-clamp-1 text-xl font-semibold">{currentMiniTitle.title}</span>
              {currentMiniTitle.subtitle ? (
                <span className="line-clamp-1 text-xs font-medium opacity-75">
                  {currentMiniTitle.subtitle}
                </span>
              ) : null}
            </div>
          </motion.span>
        ) : null}
      </div>
    </div>
  );
};

export default MobileHeader;
