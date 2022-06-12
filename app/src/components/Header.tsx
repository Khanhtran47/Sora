import * as React from 'react';
import { Link } from 'remix';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Tooltip, Button, Text } from '@nextui-org/react';

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
    pageLink: '/list-movies',
  },
  {
    pageName: 'TV Shows',
    pageLink: '/list-tv-shows',
  },
  {
    pageName: 'Animes',
    pageLink: '/list-animes',
  },
];
const settings = ['Profile', 'Account', 'Logout'];

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { open, handleDrawerOpen } = props;
  const [, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar
      fluid
      responsive={false}
      display="flex"
      alignItems="center"
      open={open}
      color="inherit"
      className="backdrop-blur-sm bg-white/30 py-2"
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
          marginRight: 3,
          ...(open && { display: 'none' }),
        }}
      >
        <MenuIcon />
      </IconButton>
      <Link to="/">
        <Text
          h6
          size={34}
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
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {pages.map((page) => (
          <Link to={page.pageLink} key={page.pageName}>
            <Button onClick={handleCloseNavMenu} light auto>
              {page.pageName}
            </Button>
          </Link>
        ))}
      </Box>

      <Box sx={{ flexGrow: 0 }}>
        <Tooltip
          content="Open settings"
          rounded
          color="primary"
          placement="left"
          css={{ zIndex: 99999 }}
        >
          <Avatar
            size="md"
            alt="Klee Cute"
            src={kleeCute}
            color="primary"
            bordered
            onClick={handleOpenUserMenu}
            css={{ cursor: 'pointer' }}
          />
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </AppBar>
  );
};

export default Header;
