import { useRef } from 'react';
import { useDebouncedEffect } from '@react-hookz/web';
import { NavLink, useLocation } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '~/components/elements/scroll-area/ScrollArea';
import { H5 } from '~/components/styles/Text.styles';

import { Underline } from './Tabs';

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
  return (
    <ScrollArea
      type="scroll"
      scrollHideDelay={100}
      css={{
        height: 55,
        width: '100%',
        borderBottom: '1px solid $border',
        boxShadow: 'unset',
        borderRadius: 0,
        zIndex: 2,
      }}
    >
      <ScrollAreaViewport>
        <div className="flex shrink-0 p-[6px] focus:outline-none">
          {pages?.map((page) => (
            <NavLink
              key={page.pageLink}
              to={`${linkTo}${page.pageLink}`}
              className="relative z-10 flex h-12 shrink-0 items-center justify-center rounded-xl p-4 text-sm font-semibold text-text outline-none hover:text-primary-solid-hover hover:opacity-80 focus:bg-background-contrast"
            >
              {({ isActive }) => (
                <>
                  <H5
                    h5
                    weight="bold"
                    // transform="uppercase"
                  >
                    {t(page.pageName)}
                  </H5>
                  {isActive ? (
                    <Underline
                      ref={underlineRef}
                      layoutId="underline"
                      css={{
                        height: 4,
                        width: '50%',
                        bottom: 0,
                      }}
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar
        orientation="horizontal"
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
  );
};

export default TabLink;
