import * as React from 'react';
import { NavLink as RemixNavLink } from '@remix-run/react';
import { Spacer, Grid, Container, Row, Button, styled } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

import { H5 } from '~/src/components/styles/Text.styles';
import NavLink from '../elements/NavLink';

/* icons */
import MenuIcon from '../../assets/icons/MenuIcon.js';
import ArrowLeftIcon from '../../assets/icons/ArrowLeftIcon.js';
import TrendingIcon from '../../assets/icons/TrendingIcon.js';
import NewReleaseIcon from '../../assets/icons/NewReleaseIcon.js';
import TopRatedIcon from '../../assets/icons/TopRatedIcon.js';
import HistoryIcon from '../../assets/icons/HistoryIcon.js';
import TwoUsers from '../../assets/icons/TwoUsersIcon.js';
import CategoryIcon from '../../assets/icons/CategoryIcon.js';

const drawerWidth = 250;

interface ILeftDrawerProps {
  open: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}

export const handle = {
  i18n: 'left-drawer',
};

const leftDrawerLink = [
  {
    pageName: 'trending',
    pageLink: 'trending',
  },
  {
    pageName: 'people',
    pageLink: 'people',
  },
  {
    pageName: 'Collections',
    pageLink: 'collections',
  },
  {
    pageName: 'newReleases',
    pageLink: 'new-releases',
  },
  {
    pageName: 'imdbTop',
    pageLink: 'imdb-top',
  },
  {
    pageName: 'history',
    pageLink: 'watch-history',
  },
];

const iconItem = (index: number, filled: boolean) => {
  let icon;
  switch (index) {
    case 0:
      icon = <TrendingIcon filled={filled} />;
      break;
    case 1:
      icon = <TwoUsers filled={filled} />;
      break;
    case 2:
      icon = <CategoryIcon filled={filled} />;
      break;
    case 3:
      icon = <NewReleaseIcon filled={filled} />;
      break;
    case 4:
      icon = <TopRatedIcon filled={filled} />;
      break;
    case 5:
      icon = <HistoryIcon />;
      break;
    default:
  }
  return icon;
};

const openedMixin = () => ({
  width: drawerWidth,
  transitionProperty: 'all',
  transitionDuration: '225ms',
  transitionTimingFunction: 'ease-out',
  transitionDelay: '0ms',
  overflowX: 'hidden',
  borderTopRightRadius: '$xl',
  borderBottomRightRadius: '$xl',
});

const closedMixin = () => ({
  transitionProperty: 'all',
  transitionDuration: '195ms',
  transitionTimingFunction: 'ease-in',
  transitionDelay: '0ms',
  overflowX: 'hidden',
  width: 0,
  '@sm': {
    width: 65,
  },
});

const Drawer = styled(Container, {
  flexGrow: 0,
  flexBasis: 'auto',
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  margin: 0,
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 999,
});

const LeftDrawer: React.FC<ILeftDrawerProps> = (props: ILeftDrawerProps) => {
  const { t } = useTranslation('left-drawer');
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { open, handleDrawerClose, handleDrawerOpen } = props;

  /**
   * If the drawer is open and the user clicks outside of the drawer, close the drawer.
   * @param {any} event - any - this is the event that is triggered when the user clicks outside of the
   * drawer.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = (event: any) => {
    if (open && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      handleDrawerClose();
    }
  };

  /* Adding an event listener to the document for handling click outside drawer */
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return (
    <Drawer
      css={{
        backgroundColor: '$backgroundContrast',
        ...(open && {
          ...openedMixin(),
        }),
        ...(!open && {
          ...closedMixin(),
        }),
        paddingLeft: 0,
        paddingRight: 0,
      }}
      as="nav"
      ref={wrapperRef}
    >
      <Row justify="center" align="center" css={{ height: '65px' }}>
        <Button
          onClick={open ? handleDrawerClose : handleDrawerOpen}
          light
          auto
          aria-label="Menu Icon"
          icon={open ? <ArrowLeftIcon /> : <MenuIcon />}
          css={{
            marginRight: open ? 20 : 0,
          }}
        />
        {open ? <NavLink linkTo="/" isLogo /> : null}
      </Row>
      <Row>
        <Grid.Container>
          {leftDrawerLink.map((page, index: number) => (
            <Grid key={page.pageName} css={{ marginTop: '10px' }} xs={12}>
              <RemixNavLink
                to={`/${page.pageLink}`}
                className="flex flex-row"
                onClick={handleDrawerClose}
                style={{
                  display: 'block',
                  minHeight: 65,
                  minWidth: 65,
                  justifyContent: open ? 'initial' : 'center',
                  alignItems: 'center',
                }}
                aria-label={page.pageName}
              >
                {({ isActive }) => (
                  <AnimatePresence>
                    <H5
                      h5
                      color="primary"
                      css={{
                        margin: 0,
                        display: 'flex',
                        minHeight: 65,
                        minWidth: 65,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        borderRadius: '14px',
                        transition: 'opacity 0.25s ease 0s, background 0.25s ease 0s',
                        '&:hover': {
                          opacity: '0.8',
                          backgroundColor: '$primaryLightHover',
                        },
                        ...(open && {
                          width: drawerWidth,
                        }),
                        ...(isActive && {
                          background: '$primaryLightActive',
                        }),
                        paddingLeft: 20,
                      }}
                    >
                      {isActive ? iconItem(index, true) : iconItem(index, false)}
                      {open && (
                        <>
                          <Spacer />
                          <motion.div
                            initial={{ opacity: 0, x: '-20%' }}
                            animate={{ opacity: 1, x: '0' }}
                            exit={{ opacity: 0, x: '-20%' }}
                            transition={{ duration: 0.225, ease: 'easeOut' }}
                          >
                            {t(page.pageName)}
                          </motion.div>
                        </>
                      )}
                    </H5>
                  </AnimatePresence>
                )}
              </RemixNavLink>
            </Grid>
          ))}
        </Grid.Container>
      </Row>
    </Drawer>
  );
};

export default LeftDrawer;
