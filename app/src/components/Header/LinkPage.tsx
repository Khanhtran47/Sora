import { Tooltip, Text, Link, NextUITheme } from '@nextui-org/react';
import { NavLink } from '@remix-run/react';
import type { TFunction } from 'react-i18next';
import DropdownPage from './DropdownPage';

const pages = [
  {
    pageName: 'movies',
    pageLink: 'movies/discover',
    pageDropdown: [
      { pageName: 'popular', pageLink: 'movies/popular' },
      { pageName: 'topRated', pageLink: 'movies/top-rated' },
      { pageName: 'upcoming', pageLink: 'movies/upcoming' },
    ],
  },
  {
    pageName: 'tv',
    pageLink: 'tv-shows/discover',
    pageDropdown: [
      { pageName: 'popular', pageLink: 'tv-shows/popular' },
      { pageName: 'topRated', pageLink: 'tv-shows/top-rated' },
      { pageName: 'onTv', pageLink: 'tv-shows/on-tv' },
    ],
  },
  {
    pageName: 'people',
    pageLink: 'people/popular',
    pageDescription: 'description',
  },
];

interface ILinkPageProps {
  theme?: NextUITheme;
  t: TFunction<'header', undefined>;
}

const LinkPage = ({ theme, t }: ILinkPageProps) => (
  <>
    {pages.map((page) => (
      // @ts-expect-error: some type def might not be right
      <Tooltip
        key={page.pageName}
        placement="bottom"
        {...(page?.pageDropdown && {
          content: <DropdownPage pagesDropdown={page?.pageDropdown || []} />,
        })}
        {...(page?.pageDescription && { content: t(page?.pageDescription) })}
      >
        <NavLink to={`/${page.pageLink}`} end style={{ marginRight: '10px' }}>
          {({ isActive }) => (
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
              <Link
                block
                color="primary"
                css={{
                  ...(isActive && {
                    background: `${theme?.colors.primaryLightActive.value}`,
                  }),
                }}
              >
                {t(page.pageName)}
              </Link>
            </Text>
          )}
        </NavLink>
      </Tooltip>
    ))}
  </>
);

export default LinkPage;
