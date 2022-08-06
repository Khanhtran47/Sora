import * as React from 'react';
import { NavLink, Outlet } from '@remix-run/react';
import { Link as NextLink, Text, useTheme, Grid, Spacer } from '@nextui-org/react';

const searchPage = [
  { pageName: 'Search Movies', pageLink: 'movie' },
  { pageName: 'Search Tv shows', pageLink: 'tv' },
  // { pageName: 'Search People', pageLink: 'people' },
];

const SearchPage = () => {
  const { theme } = useTheme();
  return (
    <>
      <Grid.Container
        className="border-b"
        css={{
          borderColor: `${theme?.colors.primaryLightActive.value}`,
        }}
      >
        {searchPage?.map((page) => (
          <>
            <Grid key={page.pageName}>
              <NavLink
                to={`/search/${page.pageLink}`}
                end
                className={({ isActive }) =>
                  `${isActive ? `border-b-2 border-solid ${theme?.colors.primary.value}` : ''}`
                }
              >
                {({ isActive }) => (
                  <Text
                    h1
                    size={20}
                    css={{
                      textTransform: 'uppercase',
                    }}
                  >
                    <NextLink
                      block
                      color="primary"
                      css={{
                        height: '45px',
                        borderRadius: '14px 14px 0 0',
                        alignItems: 'center',
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
            </Grid>
            <Spacer y={1} />
          </>
        ))}
      </Grid.Container>

      <Outlet />
    </>
  );
};

export default SearchPage;
