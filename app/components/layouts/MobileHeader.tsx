import { useLocation, NavLink, useNavigate } from '@remix-run/react';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { useHeaderOptions } from '~/hooks/useHeader';
import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

import { H2 } from '~/components/styles/Text.styles';

import Arrow from '~/assets/icons/ArrowIcon';
import Search from '~/assets/icons/SearchIcon';

const MobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { historyBack } = useHistoryStack((state) => state);
  const {
    isShowMobileHeader,
    isShowTabLink,
    hideTabLinkWithLocation,
    customHeaderBackgroundColor,
    currentMiniTitle,
    headerBackgroundColor,
    headerBackgroundOpacity,
  } = useHeaderOptions();
  const handleBackButton = () => {
    if (historyBack.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const { scrollDirection } = useLayoutScrollPosition((state) => state);

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
    <div className="h-[64px] w-[100vw] fixed top-0 z-[1000] px-3 py-2 flex flex-row justify-start items-center sm:hidden shadow-none gap-x-3">
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
        css={{ backgroundColor: '$backgroundAlpha', flexBasis: 40, flexShrink: 0 }}
        icon={<Arrow direction="left" />}
        onPress={() => handleBackButton()}
      />
      <div className="flex flex-row justify-between items-center">
        {currentMiniTitle ? (
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: headerBackgroundOpacity, y: (1 - headerBackgroundOpacity) * 60 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-semibold line-clamp-1"
          >
            {currentMiniTitle.title}
          </motion.span>
        ) : null}
      </div>
    </div>
  );
};

export default MobileHeader;
