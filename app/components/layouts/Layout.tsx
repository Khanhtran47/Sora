/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/indent */
import { useState, useRef, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { tv } from 'tailwind-variants';
import { useLocation, useMatches, useNavigationType } from '@remix-run/react';
import { useMediaQuery } from '@react-hookz/web';
import { useElementScroll } from 'framer-motion';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';
import { useHistoryStack } from '~/store/layout/useHistoryStack';

import { throttle } from '~/utils/function';

import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '~/components/elements/scroll-area/ScrollArea';

/* Components */
import Header from './Header';
import SideBar from './SideBar';
// import Footer from './Footer';
import BottomNav from './BottomNav';
// import BreadCrumb from './BreadCrumb';
import GlobalPlayer from './GlobalPlayer';
import MobileHeader from './MobileHeader';

interface ILayout {
  children: React.ReactNode;
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
      true: 'p-0 sm:px-5 mt-[72px] mb-[70px]',
      false: 'p-0 mt-[72px] sm:mt-0 mb-[70px]',
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
  ],
  defaultVariants: {
    mini: false,
    boxed: false,
    layoutPadding: true,
  },
});

const Layout = (props: ILayout) => {
  const { children, user } = props;
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const matches = useMatches();
  const navigationType = useNavigationType();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const { sidebarMiniMode, sidebarBoxedMode } = useSoraSettings();
  const viewportRef = useRef<HTMLDivElement>(null);
  const { setScrollPosition, setScrollHeight, scrollDirection, setScrollDirection } =
    useLayoutScrollPosition((state) => state);
  const { scrollY } = useElementScroll(viewportRef);
  const { historyBack, historyForward, setHistoryBack, setHistoryForward } = useHistoryStack(
    (state) => state,
  );

  useEffect(() => {
    setHistoryBack([location.key]);
    setHistoryForward([location.key]);
  }, []);

  useEffect(() => {
    const preventScrollToTopRoute = matches.some(
      (match) => match.handle && match.handle.preventScrollToTop,
    );
    setScrollHeight(viewportRef.current?.scrollHeight || 0);
    if (preventScrollToTopRoute) {
      return;
    }
    viewportRef.current?.scrollTo(0, 0);
  }, [location.key]);

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
      lastScrollPosition = currentScrollPosition > 0 ? currentScrollPosition : 0;
    };
    const removeScrollYProgress = scrollY.onChange(throttle(updateAtScroll, 80));
    return () => {
      removeScrollYProgress();
    };
  }, []);

  return (
    <div className={layoutStyles({ boxed: sidebarBoxedMode.value })}>
      {isSm ? null : <SideBar open={open} setOpen={setOpen} />}
      <div
        className={contentAreaStyles({
          mini: sidebarMiniMode.value,
          boxed: sidebarBoxedMode.value,
        })}
      >
        {isSm ? (
          <MobileHeader />
        ) : (
          <Header
            // open={open}
            user={user}
            // setOpen={setOpen}
          />
        )}
        <ScrollArea
          type={isSm ? 'scroll' : 'always'}
          scrollHideDelay={500}
          css={{
            width: '100%',
            height: sidebarBoxedMode.value ? 'calc(100vh - 15px)' : '100vh',
            borderRadius: 0,
          }}
        >
          <ScrollAreaViewport ref={viewportRef}>
            <main
              className={scrollAreaViewportStyles({
                mini: sidebarMiniMode.value,
                boxed: sidebarBoxedMode.value,
                layoutPadding: !matches.some((match) => match.handle?.disableLayoutPadding),
              })}
            >
              {/* <BreadCrumb /> */}
              <GlobalPlayer />
              {children}
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
