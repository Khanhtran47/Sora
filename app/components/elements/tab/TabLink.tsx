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
      className="z-[2] w-full border-b border-default-200"
    >
      <ScrollViewport>
        <div className="flex focus:outline-none">
          {pages?.map((page) => (
            <NavLink
              key={page.pageLink}
              to={`${linkTo}${page.pageLink}`}
              className="relative z-10 flex h-12 shrink-0 items-center justify-center rounded-large p-4 outline-none hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-focus"
            >
              {({ isActive }) => (
                <>
                  <h6 className="font-semibold">{t(page.pageName)}</h6>
                  {isActive ? (
                    <motion.div
                      ref={underlineRef}
                      layoutId="underline"
                      className="absolute bottom-0 h-1 w-1/2 overflow-hidden rounded-small bg-default-foreground"
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </ScrollViewport>
      <ScrollBar orientation="horizontal" className="opacity-30" />
      <ScrollCorner />
    </ScrollArea>
  );
};

export default TabLink;
