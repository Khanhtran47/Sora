import { useMediaQuery } from '@react-hookz/web';
import { NavLink } from '@remix-run/react';
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
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  return (
    <ScrollArea
      type={isSm ? 'scroll' : 'hover'}
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
              className="relative z-10 flex h-12 shrink-0 items-center justify-center rounded-xl p-4 text-sm font-semibold text-foreground outline-none hover:text-primary-700 hover:opacity-80 focus:bg-neutral"
            >
              {({ isActive }) => (
                <>
                  <H5 h5 weight="bold">
                    {t(page.pageName)}
                  </H5>
                  {isActive && (
                    <Underline
                      layoutId="underline"
                      css={{
                        height: 4,
                        width: '50%',
                        bottom: 0,
                      }}
                    />
                  )}
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
          margin: 0,
          bottom: '-5px !important',
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
          '&[data-orientation="horizontal"]': { h: 5 },
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
