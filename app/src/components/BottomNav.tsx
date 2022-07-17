import { NavLink } from '@remix-run/react';
import { Button, Text, Container, useTheme } from '@nextui-org/react';

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

const BottomNav = () => {
  const { isDark } = useTheme();

  return (
    <Container
      fluid
      display="flex"
      justify="space-between"
      alignItems="center"
      className={`backdrop-blur-md border-t ${
        isDark ? 'bg-black/30 border-t-slate-700' : ' border-t-slate-300 bg-white/30'
      }`}
      css={{
        position: 'fixed',
        bottom: 0,
        height: 65,
        zIndex: 999,
        '@xs': {
          display: 'none',
        },
      }}
    >
      {pages.map((page) => (
        <Button light auto key={page.pageName}>
          <NavLink to={`/${page.pageLink}`}>
            <Text
              h1
              size={18}
              css={{
                textTransform: 'uppercase',
              }}
            >
              {page.pageName}
            </Text>
          </NavLink>
        </Button>
      ))}
    </Container>
  );
};

export default BottomNav;
