/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Button, Grid, Row, Tooltip, Popover, Spacer, styled } from '@nextui-org/react';
import type { User } from '@supabase/supabase-js';
import type { AnimationItem } from 'lottie-web';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'react-device-detect';
import { tv } from 'tailwind-variants';
import { useMediaQuery } from '@react-hookz/web';
import { useScroll } from 'framer-motion';

import { pages, searchDropdown } from '~/constants/navPages';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import useScrollDirection from '~/hooks/useScrollDirection';

/* Components */
import NavLink from '~/components/elements/NavLink';
import MultiLevelDropdown from '~/components/layouts/MultiLevelDropdown';
import { AppBar, PlayerStyled } from '~/components/layouts/Layout.styles';

/* Assets */
import MenuIcon from '~/assets/icons/MenuIcon';
import SearchIcon from '~/assets/icons/SearchIcon';
// import menuNavBlack from '~/assets/lotties/lottieflow-menu-nav-11-6-000000-easey.json';
// import menuNavWhite from '~/assets/lotties/lottieflow-menu-nav-11-6-FFFFFF-easey.json';
// import arrowLeftBlack from '~/assets/lotties/lottieflow-arrow-08-1-000000-easey.json';
// import arrowLeftWhite from '~/assets/lotties/lottieflow-arrow-08-1-FFFFFF-easey.json';
import dropdown from '~/assets/lotties/lottieflow-dropdown-03-0072F5-easey.json';

interface IHeaderProps {
  open: boolean;
  user?: User;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handle = {
  i18n: 'header',
};

const DropdownPage = ({
  pagesDropdown,
}: {
  pagesDropdown: {
    pageName: string;
    pageLink: string;
  }[];
}) => {
  const { t } = useTranslation('header');

  return (
    <Grid.Container
      css={{
        padding: '0.75rem',
        width: '200px',
      }}
    >
      {pagesDropdown.map((page) => (
        <>
          <Row key={page.pageName}>
            <NavLink linkTo={`/${page.pageLink}`} linkName={t(page.pageName)} />
          </Row>
          <Spacer y={0.5} />
        </>
      ))}
    </Grid.Container>
  );
};

const ButtonStyled = styled('button', {
  paddingRight: 8,
  paddingLeft: 8,
  marginRight: 12,
  display: 'block',
  '@sm': {
    display: 'none',
  },
});

const headerStyles = tv({
  base: 'h-[64px] w-[100vw] fixed z-50 py-3 px-5 flex flex-row justify-between items-center',
  variants: {
    miniSidebar: {
      true: 'sm:w-[calc(100vw_-_80px)] top-0',
    },
    boxedSidebar: {
      true: 'sm:w-[calc(100vw_-_280px)] top-[15px]',
    },
  },
  compoundVariants: [
    {
      miniSidebar: true,
      boxedSidebar: true,
      class: 'sm:w-[calc(100vw_-_110px)] top-[15px]',
    },
    {
      miniSidebar: false,
      boxedSidebar: false,
      class: 'sm:w-[calc(100vw_-_250px)] top-0',
    },
  ],
  defaultVariants: {
    miniSidebar: false,
    boxedSidebar: false,
  },
});

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { t } = useTranslation('header');
  const { open, user, setOpen } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lottie, setLottie] = useState<AnimationItem>();
  const isSm = useMediaQuery('(max-width: 650px)');
  const scrollDirection = useScrollDirection();
  const { sidebarMiniMode, sidebarBoxedMode, sidebarSheetMode } = useSoraSettings();

  useEffect(() => {
    if (isDropdownOpen) {
      lottie?.playSegments([0, 50], true);
    } else {
      lottie?.playSegments([50, 96], true);
    }
  }, [isDropdownOpen]);

  return (
    <div
      className={headerStyles({
        miniSidebar: sidebarMiniMode.value,
        boxedSidebar: sidebarBoxedMode.value,
      })}
    >
      <div>nav button</div>
      <div>dynamic content</div>
      <Popover
        shouldFlip
        triggerType="menu"
        placement="bottom-right"
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
      >
        <Popover.Trigger>
          <Button type="button" auto light aria-label="dropdown" css={{ padding: '0 $xs' }}>
            <PlayerStyled
              lottieRef={(instance) => {
                setLottie(instance);
              }}
              src={dropdown}
              autoplay={false}
              keepLastFrame
              speed={2.7}
              className="w-8 h-8"
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          css={{
            display: 'block',
            opacity: 1,
            transform: 'none',
            overflow: 'hidden',
            transition: 'height 0.5s',
            width: 240,
            zIndex: 999,
            borderWidth: 0,
          }}
        >
          <MultiLevelDropdown user={user} />
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default Header;
