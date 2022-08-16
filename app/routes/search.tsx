import * as React from 'react';
import { NavLink, Outlet } from '@remix-run/react';
import { Link as NextLink, Text, useTheme, Grid, Spacer } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

const searchPage = [
  { pageName: 'searchMovies', pageLink: 'movie' },
  { pageName: 'searchTv', pageLink: 'tv' },
  { pageName: 'searchPeople', pageLink: 'people' },
];

const SearchPage = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
                      {t(page.pageName)}
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
