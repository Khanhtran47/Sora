/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef } from 'react';
import {
  useMediaQuery,
  // useThrottledCallback
} from '@react-hookz/web';
import { useLocation, useMatches, useNavigationType, useOutlet, useParams } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useHydrated } from 'remix-utils';
import { Toaster } from 'sonner';
import { tv } from 'tailwind-variants';

import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayout } from '~/store/layout/useLayout';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import {
  ScrollArea,
  ScrollBar,
  ScrollCorner,
  ScrollViewport,
} from '~/components/elements/ScrollArea';
import TabLink from '~/components/elements/tab/TabLink';

import ActionButtons from './ActionButtons';
import BottomNav from './BottomNav';
import GlobalPlayer from './GlobalPlayer';
import Header from './Header';
import MobileHeader from './MobileHeader';
import SideBar from './SideBar';
import TailwindIndicator from './TailwindIndicator';

interface ILayout {
  user?: User;
}

const layoutStyles = tv({
  base: 'bg-content1/[0.3] flex max-h-full min-h-screen max-w-full flex-nowrap justify-start transition-[padding] duration-200',
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
  base: 'bg-background shadow-foreground/10 ml-0 flex w-full grow flex-col justify-end overflow-hidden !rounded-none shadow-xl transition-[margin] duration-200 sm:!rounded-tl-xl',
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
  base: 'shadow-default/10 fixed z-[1000] flex h-[56px] w-[100vw] items-end shadow-md',
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
  const isHydrated = useHydrated();
  const navigationType = useNavigationType();
  const { theme } = useTheme();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isMd = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const { sidebarMiniMode, sidebarBoxedMode, sidebarHoverMode } = useSoraSettings();
  const viewportRef = useRef<HTMLDivElement>(null);
  const {
    setViewportRef,
    setScrollY,
    setScrollYProgress,
    // scrollDirection,
    // setScrollDirection,
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

  // let lastScrollY = viewportRef.current?.scrollTop || 0;

  // const handleScroll = useThrottledCallback(
  //   (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
  //     if (isSm) {
  //       // @ts-ignore
  //       const scrollY = e?.target?.scrollTop || 0;
  //       const direction = scrollY > lastScrollY ? 'down' : 'up';
  //       if (
  //         direction !== scrollDirection &&
  //         (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
  //       ) {
  //         setScrollDirection(direction);
  //       }
  //       lastScrollY = scrollY > 0 ? scrollY : 0;
  //     }
  //   },
  //   [scrollDirection, isSm, viewportRef],
  //   50,
  // );

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
        {<TailwindIndicator />}
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
        {isHydrated ? <ActionButtons /> : null}
        <ScrollArea
          type={isSm ? 'scroll' : 'always'}
          scrollHideDelay={500}
          className={`w-full ${sidebarBoxedMode.value ? 'h-[calc(100vh-15px)]' : 'h-screen'}`}
          key="scroll-area-main"
        >
          <ScrollViewport ref={viewportRef}>
            <main
              className={scrollAreaViewportStyles({
                mini: sidebarMiniMode.value,
                boxed: sidebarBoxedMode.value,
                layoutPadding: !disableLayoutPadding,
                isShowTabLink: isShowTabLink && !hideTabLinkWithLocation,
              })}
            >
              <GlobalPlayer />
              {isHydrated ? (
                <Toaster
                  // @ts-ignore
                  theme={theme}
                  position="bottom-right"
                  richColors
                  closeButton
                  toastOptions={{
                    style: {
                      // @ts-ignore
                      '--normal-bg': 'hsl(var(--theme-default))',
                      '--normal-text': 'hsl(var(--theme-default-foreground))',
                      '--normal-border': 'hsl(var(--theme-border))',
                      '--success-bg': 'hsl(var(--theme-success))',
                      '--success-border': 'hsl(var(--theme-border))',
                      '--success-text': 'hsl(var(--theme-success-foreground))',
                      '--error-bg': 'hsl(var(--theme-danger))',
                      '--error-border': 'hsl(var(--theme-border))',
                      '--error-text': 'hsl(var(--theme-danger-foreground))',
                      '--gray1': 'hsl(var(--theme-default-50))',
                      '--gray2': 'hsl(var(--theme-default-100))',
                      '--gray4': 'hsl(var(--theme-default-300))',
                      '--gray5': 'hsl(var(--theme-default-400))',
                      '--gray12': 'hsl(var(--theme-default-900))',
                    },
                  }}
                />
              ) : null}
              <AnimatePresence mode="wait" initial={false}>
                {outlet}
              </AnimatePresence>
            </main>
            {/* <Footer /> */}
            {isSm ? <BottomNav user={user} /> : null}
          </ScrollViewport>
          <ScrollBar />
          <ScrollCorner />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Layout;
