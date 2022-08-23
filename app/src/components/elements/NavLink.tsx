import { NavLink as NavigationLink } from '@remix-run/react';
import { Text, Link as NextLink, useTheme } from '@nextui-org/react';

export interface INavLinkProps {}

const NavLink = (props: INavLinkProps) => {
  const { theme } = useTheme();
  return (
    <NavigationLink to="/sign-in" end>
      {({ isActive }) => (
        <Text
          h1
          size={14}
          css={{
            textTransform: 'uppercase',
            '@sm': {
              fontSize: '20px',
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
            {t('sign-in')}
          </NextLink>
        </Text>
      )}
    </NavigationLink>
  );
};

export default NavLink;
