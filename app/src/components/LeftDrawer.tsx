import * as React from 'react';
import { NavLink } from '@remix-run/react';
import { Spacer, Link, Switch, Text, Grid, Container, useTheme, styled } from '@nextui-org/react';
import { useTheme as useRemixTheme } from 'next-themes';

/* icons */
import TrendingIcon from '../assets/icons/TrendingIcon.js';
import RecommendIcon from '../assets/icons/RecommendIcon.js';
import NewReleaseIcon from '../assets/icons/NewReleaseIcon.js';
import TopRatedIcon from '../assets/icons/TopRatedIcon.js';
import HistoryIcon from '../assets/icons/HistoryIcon.js';
import SunIcon from '../assets/icons/SunIcon.js';
import MoonIcon from '../assets/icons/MoonIcon.js';

const drawerWidth = 240;

interface ILeftDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
}

const openedMixin = () => ({
  width: drawerWidth,
  transitionProperty: 'width',
  transitionDuration: '225ms',
  transitionTimingFunction: 'ease-out',
  transitionDelay: '0ms',
  overflowX: 'hidden',
});

const closedMixin = () => ({
  transitionProperty: 'width',
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
  height: 'calc(100vh - 66px)',
  position: 'fixed',
  zIndex: 990,
});

const LeftDrawer: React.FC<ILeftDrawerProps> = (props: ILeftDrawerProps) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { setTheme } = useRemixTheme();
  const { isDark, theme } = useTheme();
  const { open, handleDrawerClose } = props;

  const iconItem = (index: number) => {
    let icon;
    switch (index) {
      case 0:
        icon = <TrendingIcon />;
        break;
      case 1:
        icon = <RecommendIcon />;
        break;
      case 2:
        icon = <NewReleaseIcon />;
        break;
      case 3:
        icon = <TopRatedIcon />;
        break;
      case 4:
        icon = <HistoryIcon />;
        break;
      default:
    }
    return icon;
  };

  const leftDrawerLink = [
    {
      pageName: 'Trending',
      pageLink: 'trending',
    },
    {
      pageName: 'Recommendations',
      pageLink: 'recommendations',
    },
    {
      pageName: 'New Releases',
      pageLink: 'new-releases',
    },
    {
      pageName: 'IMDB Top',
      pageLink: 'imdb-top',
    },
    {
      pageName: 'Watch History',
      pageLink: 'watch-history',
    },
  ];

  /**
   * If the drawer is open and the user clicks outside of the drawer, close the drawer.
   * @param {any} event - any - this is the event that is triggered when the user clicks outside of the
   * drawer.
   */
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
        ...(open && {
          ...openedMixin(),
        }),
        ...(!open && {
          ...closedMixin(),
        }),
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: '66px',
      }}
      className={`backdrop-blur-md px-0 border-r ${
        isDark ? 'bg-black/70 border-r-slate-700' : 'bg-white/70 border-r-slate-300'
      }`}
      as="nav"
      ref={wrapperRef}
    >
      <Grid.Container>
        {leftDrawerLink.map((page, index: number) => (
          <Grid key={page.pageName} css={{ marginTop: '10px' }} xs={12}>
            <NavLink
              to={`/${page.pageLink}`}
              className="flex flex-row"
              style={{
                display: 'block',
                minHeight: 65,
                minWidth: 65,
                justifyContent: open ? 'initial' : 'center',
                alignItems: 'center',
              }}
            >
              {({ isActive }) => (
                <Text
                  h4
                  size={18}
                  css={{
                    display: 'flex',
                    minHeight: 65,
                    minWidth: 65,
                    ...(open && {
                      width: drawerWidth,
                    }),
                  }}
                >
                  <Link
                    block
                    color="primary"
                    onClick={handleDrawerClose}
                    css={{
                      ...(isActive && {
                        background: `${theme?.colors.primaryLightActive.value}`,
                      }),
                      minHeight: 65,
                      minWidth: 65,
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      ...(open && {
                        width: drawerWidth,
                      }),
                      paddingLeft: 20,
                    }}
                  >
                    {iconItem(index)}
                    {open && (
                      <>
                        <Spacer />
                        {page.pageName}
                      </>
                    )}
                  </Link>
                </Text>
              )}
            </NavLink>
          </Grid>
        ))}
      </Grid.Container>
      <Switch
        checked={isDark}
        size="lg"
        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
        shadow
        color="primary"
        iconOn={<MoonIcon filled />}
        iconOff={<SunIcon filled />}
        css={{
          marginLeft: '90px',
          marginTop: '35vh',
          '@xs': {
            display: 'none',
          },
        }}
      />
    </Drawer>
  );
};

export default LeftDrawer;
