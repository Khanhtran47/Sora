/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/indent */
import { useRef, useEffect, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import { tv } from 'tailwind-variants';
import { useLocation, useMatches, useNavigationType, useOutlet } from '@remix-run/react';
import { useMediaQuery } from '@react-hookz/web';
import { useScroll, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';
import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useHeaderStyle } from '~/store/layout/useHeaderStyle';

import { throttle } from '~/utils/function';

import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '~/components/elements/scroll-area/ScrollArea';
import TabLink from '~/components/elements/tab/TabLink';
import Header from './Header';
import SideBar from './SideBar';
// import Footer from './Footer';
import BottomNav from './BottomNav';
// import BreadCrumb from './BreadCrumb';
import GlobalPlayer from './GlobalPlayer';
import MobileHeader from './MobileHeader';

interface ILayout {
  user?: User;
}

const layoutStyles = tv({
  base: 'flex flex-nowrap justify-start max-w-full max-h-full min-h-screen bg-background transition-[padding] duration-200 font-[Inter]',
  variants: {
    boxed: {
      true: 'pt-[15px] min-h-[calc(100vh_-_115px)]',
      false: 'p-0',
    },
  },
  defaultVariants: {
    boxed: false,
  },
});

const contentAreaStyles = tv({
  base: 'grow flex flex-col justify-end bg-background-contrast-alpha ml-0 !rounded-none sm:!rounded-tl-xl overflow-hidden transition-[margin] duration-200 w-full',
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
  base: 'flex flex-col justify-start items-center w-[100vw] transition-[width,_height] duration-200 min-h-screen',
  variants: {
    mini: {
      true: 'sm:w-[calc(100vw_-_80px)]',
    },
    boxed: {
      true: 'sm:w-[calc(100vw_-_280px)]',
    },
    layoutPadding: {
      true: 'p-0 sm:px-5 mb-[70px]',
      false: 'p-0 mb-[70px]',
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
  base: 'h-[56px] w-[100vw] fixed z-[1000] flex items-end shadow-lg',
  variants: {
    miniSidebar: {
      true: 'sm:w-[calc(100vw_-_80px)] top-[56px]',
    },
    boxedSidebar: {
      true: 'sm:w-[calc(100vw_-_280px)] top-[71px]',
    },
  },
  compoundVariants: [
    {
      miniSidebar: true,
      boxedSidebar: true,
      class: 'sm:w-[calc(100vw_-_110px)] top-[79px]',
    },
    {
      miniSidebar: false,
      boxedSidebar: false,
      class: 'sm:w-[calc(100vw_-_250px)] top-[56px]',
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
  const navigationType = useNavigationType();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isMd = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const { sidebarMiniMode, sidebarBoxedMode, sidebarHoverMode } = useSoraSettings();
  const viewportRef = useRef<HTMLDivElement>(null);
  const {
    setScrollPosition,
    setScrollHeight,
    scrollDirection,
    setScrollDirection,
    setViewportRef,
  } = useLayoutScrollPosition((state) => state);
  const { scrollY } = useScroll({ container: viewportRef });
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
    [location.pathname],
  );
  const disableLayoutPadding = useMemo(
    () => matches.some((match) => match.handle?.disableLayoutPadding === true),
    [location.pathname],
  );
  const currentTabLinkPages = useMemo(
    () => matches.find((match) => match.handle?.showTabLink)?.handle?.tabLinkPages,
    [location.pathname],
  );
  const currentTabLinkTo = useMemo(
    () => matches.find((match) => match.handle?.showTabLink)?.handle?.tabLinkTo,
    [location.pathname],
  );
  const customHeaderBackgroundColor = useMemo(
    () => matches.some((match) => match?.handle?.customHeaderBackgroundColor === true),
    [location.pathname],
  );
  const customHeaderChangeColorOnScroll = useMemo(
    () => matches.some((match) => match?.handle?.customHeaderChangeColorOnScroll === true),
    [location.pathname],
  );
  const hideTabLinkWithLocation: boolean = useMemo(() => {
    const currentMatch = matches.find((match) => match.handle?.showTabLink);
    if (currentMatch?.handle?.hideTabLinkWithLocation)
      return currentMatch?.handle?.hideTabLinkWithLocation(location.pathname);
    return false;
  }, [location.pathname]);

  useEffect(() => {
    setHistoryBack([location.key]);
    setHistoryForward([location.key]);
  }, []);

  useEffect(() => {
    const preventScrollToTopRoute = matches.some(
      (match) => match.handle && match.handle.preventScrollToTop === true,
    );
    setScrollHeight(viewportRef.current?.scrollHeight || 0);
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
    let lastScrollPosition = viewportRef.current?.scrollTop || 0;

    const updateAtScroll = () => {
      const currentScrollPosition = scrollY.get();
      const direction = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
      if (
        direction !== scrollDirection &&
        (currentScrollPosition - lastScrollPosition > 20 ||
          currentScrollPosition - lastScrollPosition < -20)
      ) {
        setScrollDirection(direction);
      }
      setScrollPosition({
        x: 0,
        y: currentScrollPosition,
      });
      setViewportRef(viewportRef);
      lastScrollPosition = currentScrollPosition > 0 ? currentScrollPosition : 0;
    };
    const removeScrollYProgress = scrollY.onChange(throttle(updateAtScroll, 200));
    return () => {
      removeScrollYProgress();
    };
  }, []);

  useEffect(() => {
    if (isMd && !sidebarMiniMode.value) {
      sidebarMiniMode.set(true);
      if (!sidebarHoverMode.value) sidebarHoverMode.set(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMd, sidebarMiniMode.value, sidebarHoverMode.value]);

  return (
    <div className={layoutStyles({ boxed: sidebarBoxedMode.value })}>
      {isSm ? null : <SideBar />}
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
          <ScrollAreaViewport ref={viewportRef}>
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
