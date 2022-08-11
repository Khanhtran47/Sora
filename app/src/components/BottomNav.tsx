import { NavLink } from '@remix-run/react';
import { Link, Text, Container, useTheme } from '@nextui-org/react';

const pages = [
  {
    pageName: 'Movies',
    pageLink: 'movies/discover',
  },
  {
    pageName: 'TV Shows',
    pageLink: 'tv-shows/discover',
  },
  {
    pageName: 'People',
    pageLink: 'people/popular',
  },
];

const BottomNav = () => {
  const { isDark, theme } = useTheme();

  return (
    <Container
      fluid
      display="flex"
      justify="space-between"
      alignItems="center"
      wrap="nowrap"
      className={`backdrop-blur-md border-t ${
        isDark ? 'bg-black/70 border-t-slate-700' : ' border-t-slate-300 bg-white/70'
      }`}
      css={{
        position: 'fixed',
        bottom: 0,
        height: 65,
        padding: 0,
        margin: 0,
        zIndex: 999,
        '@xs': {
          display: 'none',
        },
      }}
    >
      {pages.map((page) => (
        <NavLink to={`/${page.pageLink}`} key={page.pageName}>
          {({ isActive }) => (
            <Text
              h1
              size={20}
              css={{
                textTransform: 'uppercase',
              }}
            >
              <Link
                block
                color="primary"
                css={{
                  ...(isActive && {
                    background: `${theme?.colors.primaryLightActive.value}`,
                  }),
                }}
              >
                {page.pageName}
              </Link>
            </Text>
          )}
        </NavLink>
      ))}
    </Container>
  );
};

export default BottomNav;
