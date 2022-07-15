import * as React from 'react';
import { Link } from '@remix-run/react';
import { Avatar, Button, Text, Grid, Dropdown, Switch, useTheme, styled } from '@nextui-org/react';
import useDarkMode from 'use-dark-mode';

/* Components */

/* Assets */
import kleeCute from '../assets/images/klee.jpg';
import SunIcon from '../assets/icons/SunIcon.js';
import MoonIcon from '../assets/icons/MoonIcon.js';
import MenuIcon from '../assets/icons/MenuIcon.js';

interface IHeaderProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

const pages = [
  {
    pageName: 'Movies',
    pageLink: 'movies/list',
  },
  {
    pageName: 'TV Shows',
    pageLink: 'tv-shows/list',
  },
  {
    pageName: 'Animes',
    pageLink: 'animes/list',
  },
];

const drawerWidth = 240;

const AppBar = styled(Grid.Container, {
  // TODO: add transition on opening/closing drawer
  zIndex: 999,
  position: 'fixed',
});

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const darkMode = useDarkMode(false);
  const { isDark } = useTheme();
  const { open, handleDrawerOpen } = props;
  return (
    <AppBar
      justify="space-between"
      alignItems="center"
      color="inherit"
      className={`flex justify-between backdrop-blur-md border-b border-b-slate-400 ${
        isDark ? 'bg-black/30 border-b-slate-700' : ' border-b-slate-300 bg-white/30'
      }`}
      gap={2}
      wrap="nowrap"
      css={{
        height: 80,
        paddingBottom: 0,
        ...(open && {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transitionProperty: 'width',
          transitionDuration: '225ms',
          transitionTimingFunction: 'ease-in',
          transitionDelay: '0ms',
        }),
        ...(!open && {
          transitionProperty: 'width',
          transitionDuration: '195ms',
          transitionTimingFunction: 'ease-out',
          transitionDelay: '0ms',
        }),
      }}
    >
      {/* button and logo */}
      <Grid xs={8} sm={3} alignItems="center">
        <Button
          onClick={handleDrawerOpen}
          light
          auto
          css={{
            paddingRight: 8,
            paddingLeft: 8,
            marginRight: 12,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </Button>
        <Link to="/">
          <Text
            h6
            size={36}
            css={{
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              display: 'none',
              '@sm': {
                display: 'flex',
              },
            }}
            weight="bold"
          >
            LOGO
          </Text>
        </Link>
        <Link to="/">
          <Text
            h5
            size={30}
            css={{
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              display: 'flex',
              '@sm': {
                display: 'none',
              },
            }}
            weight="bold"
          >
            LOGO
          </Text>
        </Link>
      </Grid>

      {/* link page */}
      <Grid sm={6}>
        {pages.map((page) => (
          <Button light auto key={page.pageName}>
            <Link to={`/${page.pageLink}`}>
              <Text
                h1
                size={20}
                css={{
                  textTransform: 'uppercase',
                  display: 'none',
                  '@sm': {
                    display: 'flex',
                  },
                }}
              >
                {page.pageName}
              </Text>
            </Link>
          </Button>
        ))}
      </Grid>

      {/* Avatar */}
      <Grid xs={3} sm={3} justify="flex-end" alignItems="center" alignContent="center">
        <Switch
          checked={isDark}
          size="lg"
          onChange={() => darkMode.toggle()}
          shadow
          color="primary"
          iconOn={<MoonIcon filled />}
          iconOff={<SunIcon filled />}
          css={{
            marginRight: '30px',
          }}
        />
        <Dropdown placement="bottom-left">
          <Dropdown.Trigger>
            <Avatar
              size="md"
              alt="Klee Cute"
              src={kleeCute}
              color="primary"
              bordered
              css={{ cursor: 'pointer' }}
            />
          </Dropdown.Trigger>
          <Dropdown.Menu color="secondary" aria-label="Avatar Actions">
            <Dropdown.Item key="profile" css={{ height: '$18' }}>
              <Text b color="inherit" css={{ d: 'flex' }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: 'flex' }}>
                klee@example.com
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
              My Settings
            </Dropdown.Item>
            <Dropdown.Item key="analytics" withDivider>
              Analytics
            </Dropdown.Item>
            <Dropdown.Item key="system">System</Dropdown.Item>
            <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
            <Dropdown.Item key="help_and_feedback" withDivider>
              Help & Feedback
            </Dropdown.Item>
            <Dropdown.Item key="logout" color="error" withDivider>
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid>
    </AppBar>
  );
};

export default Header;
