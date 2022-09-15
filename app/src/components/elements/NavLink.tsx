/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { NavLink as NavigationLink } from '@remix-run/react';
import { Text } from '@nextui-org/react';

import useMediaQuery from '~/hooks/useMediaQuery';

export interface INavLinkProps {
  linkTo: string;
  linkName?: string;
  style?: React.CSSProperties;
  isIcon?: boolean;
  isLogo?: boolean;
  icon?: React.ReactNode;
}

const TextNavLink = ({
  linkTo,
  linkName,
  style,
}: {
  linkTo: string;
  linkName?: string;
  style?: React.CSSProperties;
}) => (
  <NavigationLink to={linkTo} style={style}>
    {({ isActive }) => (
      <Text
        h2
        size={18}
        color="primary"
        css={{
          textTransform: 'uppercase',
          padding: '0.25rem 0.5rem',
          borderRadius: '14px',
          transition: 'opacity 0.25s ease 0s, background 0.25s ease 0s',
          margin: 0,
          '@sm': {
            fontSize: '20px',
          },
          '&:hover': {
            opacity: '0.8',
            backgroundColor: '$primaryLightHover',
          },
          ...(isActive && {
            background: '$primaryLightActive',
          }),
        }}
      >
        {linkName}
      </Text>
    )}
  </NavigationLink>
);

const IconNavLink = ({
  linkTo,
  icon,
  style,
}: {
  linkTo: string;
  icon: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <NavigationLink to={linkTo} style={style}>
    {({ isActive }) => (
      <Text
        as="div"
        color="primary"
        css={{
          margin: 0,
          textTransform: 'uppercase',
          padding: '0.25rem 0.5rem',
          borderRadius: '14px',
          transition: 'opacity 0.25s ease 0s, background 0.25s ease 0s',
          '@sm': {
            fontSize: '20px',
          },
          '&:hover': {
            opacity: '0.8',
            backgroundColor: '$primaryLightHover',
          },
          ...(isActive && {
            background: '$primaryLightActive',
          }),
        }}
      >
        {icon}
      </Text>
    )}
  </NavigationLink>
);

const LogoNavLink = ({ linkTo }: { linkTo: string }) => {
  const isMd = useMediaQuery(960);
  return (
    <NavigationLink to={linkTo}>
      <Text
        h1
        size={isMd ? 30 : 36}
        css={{
          margin: 0,
          textGradient: '45deg, $blue600 -20%, $pink600 50%',
          mr: 2,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          textDecoration: 'none',
        }}
        weight="bold"
      >
        LOGO
      </Text>
    </NavigationLink>
  );
};

const NavLink: React.FC<INavLinkProps> = (props: INavLinkProps) => {
  const { linkTo, linkName, style, isIcon = false, icon, isLogo = false } = props;

  if (isIcon) return <IconNavLink linkTo={linkTo} icon={icon} style={style} />;
  if (isLogo) return <LogoNavLink linkTo={linkTo} />;
  return <TextNavLink linkTo={linkTo} linkName={linkName} style={style} />;
};

export default NavLink;
