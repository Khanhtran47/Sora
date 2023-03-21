/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/indent */
import { useState, useRef, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { tv } from 'tailwind-variants';
import { useLocation, useMatches } from '@remix-run/react';
import { useMediaQuery } from '@react-hookz/web';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useElementScroll } from 'framer-motion';

import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';

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

interface ILayout {
  children: React.ReactNode;
  user?: User;
}

const layoutStyles = tv({
  base: 'flex flex-nowrap justify-start max-w-full max-h-full min-h-screen bg-background transition-[padding] duration-200',
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
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const { sidebarMiniMode, sidebarBoxedMode } = useSoraSettings();
  const viewportRef = useRef<HTMLDivElement>(null);
  const { setScrollPosition, setScrollHeight } = useLayoutScrollPosition((state) => state);
  const { scrollYProgress } = useElementScroll(viewportRef);

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
    if (viewportRef.current) {
      scrollYProgress.onChange((value) => {
        setScrollPosition({
          x: 0,
          y: value,
        });
      });
    }
  }, [scrollYProgress]);

  return (
    <div className={layoutStyles({ boxed: sidebarBoxedMode.value })}>
      {isSm ? null : <SideBar open={open} setOpen={setOpen} />}
      <div
        className={contentAreaStyles({
          mini: sidebarMiniMode.value,
          boxed: sidebarBoxedMode.value,
        })}
      >
        {isSm ? null : (
          <Header
            // open={open}
            user={user}
            // setOpen={setOpen}
          />
        )}
        <ScrollArea
          type="always"
          scrollHideDelay={1000}
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
            {isSm ? <BottomNav /> : null}
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
