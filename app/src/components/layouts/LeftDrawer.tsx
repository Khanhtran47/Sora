import * as React from 'react';
import { NavLink } from '@remix-run/react';
import { Spacer, Text, Grid, Container, Row, styled } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

/* icons */
import TrendingIcon from '../../assets/icons/TrendingIcon.js';
import RecommendIcon from '../../assets/icons/RecommendIcon.js';
import NewReleaseIcon from '../../assets/icons/NewReleaseIcon.js';
import TopRatedIcon from '../../assets/icons/TopRatedIcon.js';
import HistoryIcon from '../../assets/icons/HistoryIcon.js';

const drawerWidth = 240;

interface ILeftDrawerProps {
  open: boolean;
  handleDrawerClose: () => void;
}

export const handle = {
  i18n: 'left-drawer',
};

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
  height: '100%',
  position: 'fixed',
  zIndex: 990,
});

const LeftDrawer: React.FC<ILeftDrawerProps> = (props: ILeftDrawerProps) => {
  const { t } = useTranslation('left-drawer');
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { open, handleDrawerClose } = props;

  const iconItem = (index: number, filled: boolean) => {
    let icon;
    switch (index) {
      case 0:
        icon = <TrendingIcon filled={filled} />;
        break;
      case 1:
        icon = <RecommendIcon filled={filled} />;
        break;
      case 2:
        icon = <NewReleaseIcon filled={filled} />;
        break;
      case 3:
        icon = <TopRatedIcon filled={filled} />;
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
      pageName: 'trending',
      pageLink: 'trending',
    },
    {
      pageName: 'recommendations',
      pageLink: 'recommendations',
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
        backgroundColor: '$backgroundAlpha',
        borderRightColor: '$border',
        ...(open && {
          ...openedMixin(),
        }),
        ...(!open && {
          ...closedMixin(),
        }),
        paddingLeft: 0,
        paddingRight: 0,
      }}
      className="backdrop-blur-md px-0 border-r"
      as="nav"
      ref={wrapperRef}
    >
      <Row
        css={{
          marginTop: 64,
        }}
      >
        <Grid.Container>
          {leftDrawerLink.map((page, index: number) => (
            <Grid key={page.pageName} css={{ marginTop: '10px' }} xs={12}>
              <NavLink
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
              >
                {({ isActive }) => (
                  <Text
                    h4
                    size={18}
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
                      '@sm': {
                        fontSize: '20px',
                      },
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
                        {t(page.pageName)}
                      </>
                    )}
                  </Text>
                )}
              </NavLink>
            </Grid>
          ))}
        </Grid.Container>
      </Row>
    </Drawer>
  );
};

export default LeftDrawer;
