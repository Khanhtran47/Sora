import { useMatches, useLocation, NavLink, useNavigate } from '@remix-run/react';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

import { H2 } from '~/components/styles/Text.styles';

import Arrow from '~/assets/icons/ArrowIcon';
import Search from '~/assets/icons/SearchIcon';

const MobileHeader = () => {
  const matches = useMatches();
  const location = useLocation();
  const navigate = useNavigate();
  const { historyBack } = useHistoryStack((state) => state);
  const isShowMobileHeader = !matches.some((match) => match.handle?.hideMobileHeader);
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
    <div className="h-[64px] w-[100vw] fixed top-0 z-[1000] px-3 py-2 flex flex-row justify-between items-center bg-background-contrast backdrop-blur-md sm:hidden shadow-lg">
      <Button auto light icon={<Arrow direction="left" />} onPress={() => handleBackButton()} />
    </div>
  );
};

export default MobileHeader;
