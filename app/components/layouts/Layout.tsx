/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef } from 'react';
import { useMediaQuery, useThrottledCallback } from '@react-hookz/web';
import { useLocation, useMatches, useNavigationType, useOutlet, useParams } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { Toaster } from 'sonner';
import { tv } from 'tailwind-variants';

import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayout } from '~/store/layout/useLayout';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '~/components/elements/scroll-area/ScrollArea';
import TabLink from '~/components/elements/tab/TabLink';

import ActionButtons from './ActionButtons';
// import Footer from './Footer';
import BottomNav from './BottomNav';
// import BreadCrumb from './BreadCrumb';
import GlobalPlayer from './GlobalPlayer';
import Header from './Header';
import MobileHeader from './MobileHeader';
import SideBar from './SideBar';

interface ILayout {
  user?: User;
}

const layoutStyles = tv({
  base: 'flex max-h-full min-h-screen max-w-full flex-nowrap justify-start bg-background-alpha font-[Inter] transition-[padding] duration-200',
  variants: {
    boxed: {
      true: 'min-h-[calc(100vh_-_115px)] pt-[15px]',
      false: 'p-0',
    },
  },
  defaultVariants: {
    boxed: false,
  },
});

const contentAreaStyles = tv({
  base: 'ml-0 flex w-full grow flex-col justify-end overflow-hidden !rounded-none bg-background transition-[margin] duration-200 sm:!rounded-tl-xl',
  variants: {
    mini: {
      true: 'sm:ml-[80px]',
    },
    boxed: {
      true: 'sm:ml-[280px]',
    },
  },
  compoundVariants: [
    {
      mini: true,
      boxed: true,
      class: 'sm:ml-[110px]',
    },
    {
      mini: false,
      boxed: false,
      class: 'sm:ml-[250px]',
    },
  ],
  defaultVariants: {
    mini: false,
    boxed: false,
  },
});

const scrollAreaViewportStyles = tv({
  base: 'flex min-h-screen w-[100vw] flex-col items-center justify-start transition-[width,_height] duration-200',
  variants: {
    mini: {
      true: 'sm:w-[calc(100vw_-_80px)]',
    },
    boxed: {
      true: 'sm:w-[calc(100vw_-_280px)]',
    },
    layoutPadding: {
      true: 'mb-[70px] p-0 sm:px-5',
      false: 'mb-[70px] p-0',
    },
    isShowTabLink: {
      true: 'mt-[128px]',
      false: 'mt-[72px]',
    },
  },
  compoundVariants: [
    {
      mini: true,
      boxed: true,
      class: 'sm:w-[calc(100vw_-_110px)]',
    },
    {
      mini: false,
      boxed: false,
      class: 'sm:w-[calc(100vw_-_250px)]',
    },
    {
      layoutPadding: false,
      isShowTabLink: false,
      class: 'mt-0',
    },
    {
      layoutPadding: true,
      isShowTabLink: false,
      class: 'mt-[72px]',
    },
  ],
  defaultVariants: {
    mini: false,
    boxed: false,
    layoutPadding: true,
    isShowTabLink: false,
  },
});

const tabLinkWrapperStyles = tv({
  base: 'fixed z-[1000] flex h-[56px] w-[100vw] items-end shadow-lg',
  variants: {
    miniSidebar: {
      true: 'top-[56px] sm:w-[calc(100vw_-_80px)]',
    },
    boxedSidebar: {
      true: 'top-[71px] sm:w-[calc(100vw_-_280px)]',
    },
  },
  compoundVariants: [
    {
      miniSidebar: true,
      boxedSidebar: true,
      class: 'top-[79px] sm:w-[calc(100vw_-_110px)]',
    },
    {
      miniSidebar: false,
      boxedSidebar: false,
      class: 'top-[56px] sm:w-[calc(100vw_-_250px)]',
    },
  ],
  defaultVariants: {
    miniSidebar: false,
    boxedSidebar: false,
  },
});

const Layout = (props: ILayout) => {
  const { user } = props;
  const location = useLocation();
  const matches = useMatches();
  const outlet = useOutlet();
  const params = useParams();
  const navigationType = useNavigationType();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isMd = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const { sidebarMiniMode, sidebarBoxedMode, sidebarHoverMode } = useSoraSettings();
  const viewportRef = useRef<HTMLDivElement>(null);
  const {
    setViewportRef,
    setScrollY,
    setScrollYProgress,
    scrollDirection,
    setScrollDirection,
    isShowOverlay,
  } = useLayout((state) => state);
  const { scrollY, scrollYProgress } = useScroll({ container: viewportRef });
  const { historyBack, historyForward, setHistoryBack, setHistoryForward } = useHistoryStack(
    (state) => state,
  );
  const {
    backgroundColor,
    setBackgroundColor,
    setStartChangeScrollPosition,
    startChangeScrollPosition,
  } = useHeaderStyle((headerState) => headerState);
  const isShowTabLink = useMemo(
    () => matches.some((match) => match.handle?.showTabLink === true),
    [matches],
  );
  const disableLayoutPadding = useMemo(
    () => matches.some((match) => match.handle?.disableLayoutPadding === true),
    [matches],
  );
  const currentTabLinkPages = useMemo(
    () => matches.find((match) => match.handle?.showTabLink)?.handle?.tabLinkPages,
    [matches],
  );
  const currentTabLinkTo = useMemo(
    () => matches.find((match) => match.handle?.showTabLink)?.handle?.tabLinkTo(params),
    [matches],
  );
  const customHeaderBackgroundColor = useMemo(
    () => matches.some((match) => match?.handle?.customHeaderBackgroundColor === true),
    [matches],
  );
  const customHeaderChangeColorOnScroll = useMemo(
    () => matches.some((match) => match?.handle?.customHeaderChangeColorOnScroll === true),
    [matches],
  );
  const hideTabLinkWithLocation: boolean = useMemo(() => {
    const currentMatch = matches.find((match) => match.handle?.showTabLink);
    if (currentMatch?.handle?.hideTabLinkWithLocation)
      return currentMatch?.handle?.hideTabLinkWithLocation(location.pathname);
    return false;
  }, [matches, location.pathname]);

  useEffect(() => {
    setHistoryBack([location.key]);
    setHistoryForward([location.key]);
    setViewportRef(viewportRef);
    setScrollY(scrollY);
    setScrollYProgress(scrollYProgress);
  }, []);

  useEffect(() => {
    const preventScrollToTopRoute = matches.some(
      (match) => match.handle && match.handle.preventScrollToTop === true,
    );
    if (!preventScrollToTopRoute) {
      viewportRef.current?.scrollTo(0, 0);
    }
    if (!customHeaderBackgroundColor && backgroundColor !== '') {
      setBackgroundColor('');
    }
    if (!customHeaderChangeColorOnScroll && startChangeScrollPosition !== 0) {
      setStartChangeScrollPosition(0);
    }
  }, [location]);

  useEffect(() => {
    if (navigationType === 'PUSH') {
      setHistoryBack([...historyBack, location.key]);
      setHistoryForward([location.key]);
    } else if (navigationType === 'POP') {
      // detect if user is going back or forward
      if (historyBack.length > 0 && historyBack[historyBack.length - 2] === location.key) {
        // going back
        setHistoryBack([...historyBack.slice(0, historyBack.length - 1)]);
        setHistoryForward([...historyForward, location.key]);
      } else if (
        historyForward.length > 0 &&
        historyForward[historyForward.length - 2] === location.key
      ) {
        // going forward
        setHistoryForward([...historyForward.slice(0, historyForward.length - 1)]);
        setHistoryBack([...historyBack, location.key]);
      }
    } else if (navigationType === 'REPLACE') {
      setHistoryBack([...historyBack.slice(0, historyBack.length - 1), location.key]);
      setHistoryForward([...historyForward.slice(0, historyForward.length - 1)]);
    }
  }, [location.key, navigationType]);

  useEffect(() => {
    if (isMd && !sidebarMiniMode.value) {
      sidebarMiniMode.set(true);
      if (!sidebarHoverMode.value) sidebarHoverMode.set(false);
    }
    if (isSm && sidebarBoxedMode.value === true) {
      sidebarBoxedMode.set(false);
    }
  }, [isMd, isSm, sidebarMiniMode.value, sidebarHoverMode.value, sidebarBoxedMode.value]);

  let lastScrollY = viewportRef.current?.scrollTop || 0;

  const handleScroll = useThrottledCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      if (isSm) {
        const scrollY = e.currentTarget.scrollTop;
        const direction = scrollY > lastScrollY ? 'down' : 'up';
        if (
          direction !== scrollDirection &&
          (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
        ) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      }
    },
    [scrollDirection, isSm],
    130,
  );

  return (
    <div className={layoutStyles({ boxed: sidebarBoxedMode.value })}>
      {isSm ? null : <SideBar />}
      {isShowOverlay ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9998] bg-[rgba(0,_0,_0,_.85)]"
        />
      ) : null}
      <div
        className={contentAreaStyles({
          mini: sidebarMiniMode.value,
          boxed: sidebarBoxedMode.value,
        })}
      >
        {isSm ? <MobileHeader /> : <Header user={user} />}
        {isShowTabLink && !hideTabLinkWithLocation ? (
          <div
            className={tabLinkWrapperStyles({
              miniSidebar: sidebarMiniMode.value,
              boxedSidebar: sidebarBoxedMode.value,
            })}
          >
            <TabLink pages={currentTabLinkPages} linkTo={currentTabLinkTo} />
          </div>
        ) : null}
        <ActionButtons />
        <ScrollArea
          type={isSm ? 'scroll' : 'always'}
          scrollHideDelay={500}
          css={{
            width: '100%',
            height: sidebarBoxedMode.value ? 'calc(100vh - 15px)' : '100vh',
            borderRadius: 0,
          }}
          key="scroll-area-main"
        >
          <ScrollAreaViewport ref={viewportRef} onScroll={(e) => handleScroll(e)}>
            <main
              className={scrollAreaViewportStyles({
                mini: sidebarMiniMode.value,
                boxed: sidebarBoxedMode.value,
                layoutPadding: !disableLayoutPadding,
                isShowTabLink: isShowTabLink && !hideTabLinkWithLocation,
              })}
            >
              {/* <BreadCrumb /> */}
              <GlobalPlayer />
              <Toaster
                position="bottom-right"
                richColors
                closeButton
                toastOptions={{
                  style: {
                    // @ts-ignore
                    '--normal-bg': 'var(--nextui-colors-backgroundContrast)',
                    '--normal-text': 'var(--nextui-colors-text)',
                    '--normal-border': 'var(--nextui-colors-border)',
                    '--success-bg': 'var(--nextui-colors-backgroundContrast)',
                    '--success-border': 'var(--nextui-colors-border)',
                    '--success-text': 'var(--nextui-colors-success)',
                    '--error-bg': 'var(--nextui-colors-backgroundContrast)',
                    '--error-border': 'var(--nextui-colors-border)',
                    '--error-text': 'var(--nextui-colors-error)',
                    '--gray1': 'var(--nextui-colors-accents0)',
                    '--gray2': 'var(--nextui-colors-accents1)',
                    '--gray4': 'var(--nextui-colors-accents3)',
                    '--gray5': 'var(--nextui-colors-accents4)',
                    '--gray12': 'var(--nextui-colors-accents9)',
                  },
                }}
              />
              <AnimatePresence exitBeforeEnter initial={false}>
                {outlet}
              </AnimatePresence>
            </main>
            {/* <Footer /> */}
            {isSm ? <BottomNav user={user} /> : null}
          </ScrollAreaViewport>
          <ScrollAreaScrollbar
            orientation="vertical"
            css={{
              padding: 0,
              margin: 2,
              backgroundColor: 'transparent',
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            <ScrollAreaThumb
              css={{ backgroundColor: '$accents8', '&:hover': { background: '$accents6' } }}
            />
          </ScrollAreaScrollbar>
          <ScrollAreaCorner />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
