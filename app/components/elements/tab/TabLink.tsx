import { useRef } from 'react';
import { useDebouncedEffect, useMediaQuery } from '@react-hookz/web';
import { NavLink, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import {
  ScrollArea,
  ScrollBar,
  ScrollCorner,
  ScrollViewport,
} from '~/components/elements/ScrollArea';
import { H5 } from '~/components/styles/Text.styles';

interface ITabProps {
  pages?: {
    pageName: string;
    pageLink: string;
  }[];
  linkTo?: string;
}

const TabLink = (props: ITabProps) => {
  const { pages, linkTo } = props;
  const { t } = useTranslation();
  const location = useLocation();
  const underlineRef = useRef<HTMLDivElement>(null);
  useDebouncedEffect(
    // need to debounce this because the scrollIntoView is called before the underline is rendered
    () => {
      if (underlineRef.current) {
        underlineRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    },
    [location],
    350,
  );
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  return (
    <ScrollArea
      type={isSm ? 'scroll' : 'hover'}
      scrollHideDelay={100}
      style={{
        height: 55,
        width: '100%',
        borderBottom: '1px solid $border',
        borderRadius: 0,
        zIndex: 2,
      }}
    >
      <ScrollViewport>
        <div className="flex shrink-0 p-[6px] focus:outline-none">
          {pages?.map((page) => (
            <NavLink
              key={page.pageLink}
              to={`${linkTo}${page.pageLink}`}
              className="relative z-10 flex h-12 shrink-0 items-center justify-center rounded-xl p-4 text-sm font-semibold text-foreground outline-none hover:text-primary-700 hover:opacity-80 focus:bg-neutral"
            >
              {({ isActive }) => (
                <>
                  <H5 h5 weight="bold">
                    {t(page.pageName)}
                  </H5>
                  {isActive ? (
                    <motion.div
                      ref={underlineRef}
                      layoutId="underline"
                      className="absolute bottom-0 h-1 w-1/2 overflow-hidden rounded-md bg-primary"
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </ScrollViewport>
      <ScrollBar orientation="horizontal" />
      <ScrollCorner />
    </ScrollArea>
  );
};

export default TabLink;
