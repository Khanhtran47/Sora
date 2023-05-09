import { Button } from '@nextui-org/react';
import { NavLink, useLocation, useNavigate } from '@remix-run/react';
import { motion, useTransform } from 'framer-motion';

import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayout } from '~/store/layout/useLayout';
import { useHeaderOptions } from '~/hooks/useHeader';
import { H2 } from '~/components/styles/Text.styles';
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
    <div className="fixed top-0 z-[1000] flex h-[64px] w-[100vw] flex-row items-center justify-start gap-x-3 px-3 py-2 shadow-none sm:hidden">
      <motion.div
        className="absolute top-0 left-0 z-[-1] w-full backdrop-blur-md"
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
      <Button
        auto
        light
        rounded
        css={{ backgroundColor: '$backgroundAlpha', flexBasis: 40, flexShrink: 0 }}
        icon={<Arrow direction="left" />}
        onPress={() => handleBackButton()}
      />
      <div className="flex flex-row items-center justify-between">
        {currentMiniTitle ? (
          <motion.span
            style={{ opacity, y }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-start justify-center"
          >
            <div className="flex flex-col items-start justify-center">
              <span className="text-xl font-semibold line-clamp-1">{currentMiniTitle.title}</span>
              {currentMiniTitle.subtitle ? (
                <span className="text-xs font-medium opacity-75 line-clamp-1">
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
