import { Button, Text } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';

import ArrowLeftIcon from '~/src/assets/icons/ArrowLeftIcon.js';
import MenuIcon from '~/src/assets/icons/MenuIcon.js';

interface ILogoProps {
  open: boolean;
  handleDrawerClose: () => void;
  handleDrawerOpen: () => void;
}

const Logo = (props: ILogoProps) => {
  const { open, handleDrawerOpen, handleDrawerClose } = props;

  return (
    <>
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
    </>
  );
};

export default Logo;
