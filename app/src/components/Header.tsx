import * as React from 'react';
import { Link } from '@remix-run/react';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Button, Text, Grid, Dropdown } from '@nextui-org/react';

/* Components */
import AppBar from './AppBar';

/* Assets */
import kleeCute from '../assets/images/klee.jpg';

interface IHeaderProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

const pages = [
  {
    pageName: 'Movies',
    pageLink: 'list-movies',
  },
  {
    pageName: 'TV Shows',
    pageLink: 'list-tv-shows',
  },
  {
    pageName: 'Animes',
    pageLink: 'list-animes',
  },
];

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { open, handleDrawerOpen } = props;
  const [, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <AppBar
      justify="space-between"
      alignItems="center"
      open={open}
      color="inherit"
      className="backdrop-blur-md bg-white/30"
      gap={2}
      wrap="nowrap"
      css={{
        height: 80,
        paddingBottom: 0,
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
          <Link to={`/${page.pageLink}`} key={page.pageName}>
            <Button onClick={handleCloseNavMenu} light auto>
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
            </Button>
          </Link>
        ))}
      </Grid>

      {/* Avatar */}
      <Grid xs={3} sm={3} justify="flex-end">
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
