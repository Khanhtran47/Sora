import * as React from 'react';
import { Link } from '@remix-run/react';
import { Button, Text, Grid, Container, Image, styled } from '@nextui-org/react';

/* icons */
import arrowLeftIcon from '../assets/icons/arrow-left-s-line.svg';
import trendingIcon from '../assets/icons/fire-line.svg';
import recommendIcon from '../assets/icons/thumb-up-line.svg';
import newReleaseIcon from '../assets/icons/new-release-line.svg';
import topRatedIcon from '../assets/icons/trophy-line.svg';
import historyIcon from '../assets/icons/history-line.svg';

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
  const { open, handleDrawerClose } = props;
  const iconItem = (index: number) => {
    let icon;
    switch (index) {
      case 0:
        // TODO: using Image (next-ui/react) instead of img
        // https://github.com/Khanhtran47/react-movie/pull/30#issuecomment-1159779493
        icon = <img src={trendingIcon} alt="Trending Icon" />;
        break;
      case 1:
        icon = <img src={recommendIcon} alt="Recommendation Icon" />;
        break;
      case 2:
        icon = <img src={newReleaseIcon} alt="New Release Icon" />;
        break;
      case 3:
        icon = <img src={topRatedIcon} alt="Top Rated Icon" />;
        break;
      case 4:
        icon = <img src={historyIcon} alt="History Icon" />;
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
      className="backdrop-blur-md bg-white/30 px-0 border-r border-r-black"
    >
      <Button onClick={handleDrawerClose} light auto>
        <Image src={arrowLeftIcon} alt="Arrow Left Icon" />
      </Button>
      <Grid.Container
        css={{
          paddingTop: '8px',
        }}
      >
        {leftDrawerLink.map((page, index: number) => (
          <Grid key={page.pageName} className="border-b border-b-black w-full">
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
