import { Loading, styled } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { ClientOnly } from 'remix-utils';

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

const TabList = styled('div', {
  display: 'flex',
  flexShrink: 0,
  padding: '5px',
  '&:focus': {
    outline: 'none',
  },
});

const TabsTrigger = styled(NavLink, {
  flexShrink: 0,
  display: 'flex',
  lineHeight: 1,
  fontSize: '$md',
  fontWeight: '$semibold',
  height: 50,
  p: '$md',
  userSelect: 'none',
  outline: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$sm',
  color: '$slate11',
  zIndex: '10',
  '&:hover': {
    opacity: '0.8',
    color: '$primarySolidHover',
  },
  '&:focus': { backgroundColor: '$backgroundContrast' },
});

const TabLink = (props: ITabProps) => {
  const { pages, linkTo } = props;
  const { t } = useTranslation();
  return (
    <ClientOnly fallback={<Loading type="default" />}>
      {() => (
        <ScrollArea
          type="scroll"
          scrollHideDelay={100}
          css={{
            height: 55,
            width: '100%',
            maxWidth: 'calc(100% - 2rem)',
            borderBottom: '1px solid $border',
            boxShadow: 'unset',
          }}
        >
          <ScrollAreaViewport>
            <TabList>
              {pages?.map((page) => (
                <TabsTrigger
                  key={page.pageLink}
                  to={`${linkTo}${page.pageLink}`}
                  css={{ position: 'relative' }}
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
                </TabsTrigger>
              ))}
            </TabList>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="horizontal">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
          <ScrollAreaCorner />
        </ScrollArea>
      )}
    </ClientOnly>
  );
};

export default TabLink;
