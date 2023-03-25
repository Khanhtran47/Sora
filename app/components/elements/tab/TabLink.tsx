import { NavLink } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { H5 } from '~/components/styles/Text.styles';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '~/components/elements/scroll-area/ScrollArea';
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
      }}
    >
      <ScrollAreaViewport>
        <div className="flex shrink-0 p-[6px] focus:outline-none">
          {pages?.map((page) => (
            <NavLink
              key={page.pageLink}
              to={`${linkTo}${page.pageLink}`}
              className="flex shrink-0 relative text-sm font-semibold h-12 p-4 outline-none items-center justify-center rounded-xl z-10 text-text hover:opacity-80 hover:text-primary-solid-hover focus:bg-background-contrast"
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
