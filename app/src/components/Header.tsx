import * as React from 'react';
import { Link } from '@remix-run/react';
import { Avatar, Button, Text, Grid, Dropdown, Image, styled } from '@nextui-org/react';

import { useClerk, useUser, SignedIn, SignedOut } from '@clerk/remix';
/* Components */

/* Assets */
import kleeCute from '../assets/images/klee.jpg';
import menuIcon from '../assets/icons/menu-line.svg';

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
  const { user } = useUser();
  const { signOut } = useClerk();
  const { open, handleDrawerOpen } = props;

  const handleDropdownSelect = (key: React.Key) => {
    if (key === 'logout') {
      signOut();
    }
  };

  return (
    <AppBar
      justify="space-between"
      alignItems="center"
      color="inherit"
      className="backdrop-blur-md bg-white/30 border-b border-b-black flex justify-between"
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
          <Image src={menuIcon} alt="Menu Icon" />
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
      <Grid xs={3} sm={3} justify="flex-end">
        <SignedIn>
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
            <Dropdown.Menu
              color="secondary"
              aria-label="Avatar Actions"
              onAction={handleDropdownSelect}
            >
              <Dropdown.Item key="profile" css={{ height: '$18' }}>
                <Text b color="inherit" css={{ d: 'flex' }}>
                  Signed in as
                </Text>
                <Text b color="inherit" css={{ d: 'flex' }}>
                  {user && user.username ? user.username : 'klee@example.com'}
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
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in">Sign In</Link>
        </SignedOut>
      </Grid>
    </AppBar>
  );
};

export default Header;
