import * as React from 'react';
import { Link } from '@remix-run/react';
import { Button, Text, Grid, Container, Image, useTheme, styled } from '@nextui-org/react';

/* icons */
import TrendingIcon from '../assets/icons/TrendingIcon.js';
import RecommendIcon from '../assets/icons/RecommendIcon.js';
import ArrowLeftIcon from '../assets/icons/ArrowLeftIcon.js';
import NewReleaseIcon from '../assets/icons/NewReleaseIcon.js';
import TopRatedIcon from '../assets/icons/TopRatedIcon.js';
import HistoryIcon from '../assets/icons/HistoryIcon.js';

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
  width: 57,
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
  zIndex: 10,
});

const LeftDrawer: React.FC<ILeftDrawerProps> = (props: ILeftDrawerProps) => {
  const { isDark } = useTheme();
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
        paddingTop: '20px',
      }}
      className={`backdrop-blur-md px-0 border-r ${
        isDark ? 'bg-black/30 border-r-slate-200' : 'bg-white/30 border-r-slate-900'
      }`}
    >
      <Button onClick={handleDrawerClose} light auto>
        <ArrowLeftIcon />
      </Button>
      <Grid.Container
        css={{
          paddingTop: '8px',
        }}
      >
        {leftDrawerLink.map((page, index: number) => (
          <Grid
            key={page.pageName}
            className={`border-b ${isDark ? 'border-b-slate-200' : 'border-b-slate-900'} w-full`}
          >
            <Button
              light
              auto
              css={{
                display: 'block',
                minHeight: 65,
                justifyContent: open ? 'initial' : 'center',
              }}
            >
              <Link to={`/${page.pageLink}`} className="flex flex-row">
                {iconItem(index)}
                <Text
                  h4
                  size={18}
                  css={{
                    marginLeft: '1.5rem',
                    opacity: open ? 1 : 0,
                  }}
                >
                  {page.pageName}
                </Text>
              </Link>
            </Button>
          </Grid>
        ))}
      </Grid.Container>
    </Drawer>
  );
};

export default LeftDrawer;
