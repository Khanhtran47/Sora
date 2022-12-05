/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { NavLink as NavigationLink } from '@remix-run/react';
import { H2, H5 } from '~/src/components/styles/Text.styles';

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
  <NavigationLink to={linkTo} style={style} aria-label={linkName}>
    {({ isActive }) => (
      <H5
        h5
        weight="bold"
        color="primary"
        css={{
          textTransform: 'uppercase',
          padding: '0.25rem 0.5rem',
          borderRadius: '14px',
          transition: 'opacity 0.25s ease 0s, background 0.25s ease 0s',
          margin: 0,
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
      </H5>
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
  <NavigationLink to={linkTo} style={style} aria-label="Icon Nav Link">
    {({ isActive }) => (
      <H5
        h5
        as="div"
        color="primary"
        css={{
          margin: 0,
          textTransform: 'uppercase',
          padding: '0.25rem 0.5rem',
          borderRadius: '14px',
          transition: 'opacity 0.25s ease 0s, background 0.25s ease 0s',
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
      </H5>
    )}
  </NavigationLink>
);

const LogoNavLink = ({ linkTo }: { linkTo: string }) => (
  <NavigationLink to={linkTo} aria-label="Homepage">
    <H2
      h2
      css={{
        margin: 0,
        textGradient: '45deg, $primary, $secondary 50%',
        mr: 2,
        fontFamily: 'monospace',
        letterSpacing: '.3rem',
        textDecoration: 'none',
      }}
      weight="bold"
    >
      SORA
    </H2>
  </NavigationLink>
);

const NavLink: React.FC<INavLinkProps> = (props: INavLinkProps) => {
  const { linkTo, linkName, style, isIcon = false, icon, isLogo = false } = props;

  if (isIcon) return <IconNavLink linkTo={linkTo} icon={icon} style={style} />;
  if (isLogo) return <LogoNavLink linkTo={linkTo} />;
  return <TextNavLink linkTo={linkTo} linkName={linkName} style={style} />;
};

export default NavLink;
