/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Button, Grid, Row, Tooltip, Popover, Spacer } from '@nextui-org/react';
import type { User } from '@supabase/supabase-js';
import type { AnimationItem } from 'lottie-web';
import { useTranslation } from 'react-i18next';

import useMediaQuery from '~/hooks/useMediaQuery';
import useScrollDirection from '~/hooks/useScrollDirection';

import { pages, searchDropdown } from '~/src/constants/navPages';

/* Components */
import NavLink from '../elements/NavLink';
import MultiLevelDropdown from './MultiLevelDropdown';
import { AppBar, PlayerStyled } from './Layout.styles';

/* Assets */
import MenuIcon from '../../assets/icons/MenuIcon.js';
import SearchIcon from '../../assets/icons/SearchIcon.js';
// import menuNavBlack from '../../assets/lotties/lottieflow-menu-nav-11-6-000000-easey.json';
// import menuNavWhite from '../../assets/lotties/lottieflow-menu-nav-11-6-FFFFFF-easey.json';
// import arrowLeftBlack from '../../assets/lotties/lottieflow-arrow-08-1-000000-easey.json';
// import arrowLeftWhite from '../../assets/lotties/lottieflow-arrow-08-1-FFFFFF-easey.json';
import dropdown from '../../assets/lotties/lottieflow-dropdown-03-0072F5-easey.json';

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

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { t } = useTranslation('header');
  const { open, user, setOpen } = props;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [lottie, setLottie] = React.useState<AnimationItem>();
  const isSm = useMediaQuery('(max-width: 650px)');
  const isMd = useMediaQuery('(max-width: 960px)');
  const scrollDirection = useScrollDirection();

  React.useEffect(() => {
    if (isDropdownOpen) {
      lottie?.playSegments([0, 50], true);
    } else {
      lottie?.playSegments([50, 96], true);
    }
  }, [isDropdownOpen]);

  return (
    <AppBar
      justify="space-between"
      alignItems="center"
      color="inherit"
      className="flex backdrop-blur-md transition-all duration-500"
      gap={2}
      wrap="nowrap"
      css={{
        backgroundColor: '$backgroundAlpha',
        width: '100%',
        top: isSm && scrollDirection === 'down' ? -64 : 0,
        height: 64,
        padding: 0,
        margin: 0,
      }}
    >
      {/* button and logo */}
      <Grid
        xs={3}
        alignItems="center"
        css={{
          '@xsMax': {
            justifyContent: 'space-between',
          },
        }}
      >
        {isMd ? (
          <button
            type="button"
            aria-label="Menu Icon"
            onClick={() => setOpen(!open)}
            style={{
              paddingRight: 8,
              paddingLeft: 8,
              marginRight: 12,
            }}
          >
            <MenuIcon />
          </button>
        ) : null}
        <NavLink linkTo="/" isLogo />
      </Grid>

      {/* link page */}
      <Grid
        sm={6}
        alignItems="center"
        direction="row"
        justify="center"
        css={{
          display: 'flex',
        }}
      >
        {!isSm &&
          pages.map((page) => (
            <Tooltip
              key={page.pageName}
              hideArrow
              placement="bottom"
              content={<DropdownPage pagesDropdown={page?.pageDropdown || []} />}
            >
              <NavLink
                linkTo={`/${page.pageLink}`}
                linkName={t(page.pageName)}
                style={{ marginRight: '10px' }}
              />
            </Tooltip>
          ))}
      </Grid>

      <Grid xs={6} sm={3} justify="flex-end" alignItems="center">
        {/* Search */}
        <Tooltip
          hideArrow
          placement="bottomEnd"
          content={<DropdownPage pagesDropdown={searchDropdown || []} />}
        >
          <NavLink
            linkTo="/search"
            isIcon
            style={{ marginTop: '3px', color: 'var(--nextui-colors-primary)' }}
            icon={<SearchIcon fill="currentColor" filled />}
          />
        </Tooltip>
        {/* Dropdown setting */}
        <Popover
          shouldFlip
          triggerType="menu"
          placement="bottom-right"
          isOpen={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
        >
          <Popover.Trigger>
            <Button auto light aria-label="dropdown" css={{ padding: '0 $xs' }}>
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
      </Grid>
    </AppBar>
  );
};

export default Header;
