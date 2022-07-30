import * as React from 'react';
import { NavLink, Link } from '@remix-run/react';
import {
  Avatar,
  Button,
  Link as NextLink,
  Text,
  Grid,
  Dropdown,
  Switch,
  useTheme,
  styled,
} from '@nextui-org/react';
import { useTheme as useRemixTheme } from 'next-themes';
import type { User } from '@supabase/supabase-js';

/* Components */

/* Assets */
import kleeCute from '../assets/images/klee.jpg';
import SunIcon from '../assets/icons/SunIcon.js';
import MoonIcon from '../assets/icons/MoonIcon.js';
import MenuIcon from '../assets/icons/MenuIcon.js';
import ArrowLeftIcon from '../assets/icons/ArrowLeftIcon.js';

interface IHeaderProps {
  open: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  user?: User;
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

const AppBar = styled(Grid.Container, {
  // TODO: add transition on opening/closing drawer
  zIndex: 999,
  position: 'fixed',
});

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { setTheme } = useRemixTheme();
  const { isDark, theme } = useTheme();
  console.log(theme);
  const { open, handleDrawerOpen, handleDrawerClose, user } = props;
  return (
    <AppBar
      justify="space-between"
      alignItems="center"
      color="inherit"
      className={`flex justify-between backdrop-blur-md border-b ${
        isDark ? 'bg-black/70 border-b-slate-700' : ' border-b-slate-300 bg-white/70'
      }`}
      gap={2}
      wrap="nowrap"
      css={{
        height: 80,
        paddingBottom: 0,
      }}
    >
      {/* button and logo */}
      <Grid
        xs={8}
        sm={3}
        alignItems="center"
        css={{
          '@xsMax': {
            justifyContent: 'space-between',
          },
        }}
      >
        <Button
          onClick={open ? handleDrawerClose : handleDrawerOpen}
          light
          auto
          css={{
            paddingRight: 8,
            paddingLeft: 8,
            marginRight: 12,
          }}
        >
          {open ? <ArrowLeftIcon /> : <MenuIcon />}
        </Button>
        <NavLink to="/">
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
        </NavLink>
        <NavLink to="/">
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
        </NavLink>
      </Grid>

      {/* link page */}
      <Grid sm={6} alignItems="center">
        {pages.map((page) => (
          <NavLink to={`/${page.pageLink}`} key={page.pageName} end style={{ marginRight: '10px' }}>
            {({ isActive }) => (
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
                <NextLink
                  block
                  color="primary"
                  css={{
                    ...(isActive && {
                      background: `${theme?.colors.primaryLightActive.value}`,
                    }),
                  }}
                >
                  {page.pageName}
                </NextLink>
              </Text>
            )}
          </NavLink>
        ))}
      </Grid>

      {/* Avatar */}
      <Grid xs={3} sm={3} justify="flex-end" alignItems="center" alignContent="center">
        <Switch
          checked={isDark}
          size="lg"
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          shadow
          color="primary"
          iconOn={<MoonIcon filled />}
          iconOff={<SunIcon filled />}
          css={{
            marginRight: '30px',
            '@xsMax': {
              display: 'none',
            },
          }}
        />
        {user ? (
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
                  {user?.email ?? 'klee@example.com'}
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
                <Link to="/sign-out">
                  <Text color="error">Log Out</Text>
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button bordered color="gradient" auto>
            <Link to="/sign-in">
              <Text>Sign In</Text>
            </Link>
          </Button>
        )}
      </Grid>
    </AppBar>
  );
};

export default Header;
