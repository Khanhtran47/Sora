import * as React from 'react';
import { NavLink, Link } from '@remix-run/react';
import {
  Avatar,
  Button,
  Link as NextLink,
  Text,
  Grid,
  Row,
  Dropdown,
  Switch,
  Tooltip,
  useTheme,
  styled,
  Spacer,
} from '@nextui-org/react';
import { useTheme as useRemixTheme } from 'next-themes';
import type { User } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';

/* Components */

/* Assets */
import kleeCute from '../assets/images/klee.jpg';
import SunIcon from '../assets/icons/SunIcon.js';
import MoonIcon from '../assets/icons/MoonIcon.js';
import MenuIcon from '../assets/icons/MenuIcon.js';
import ArrowLeftIcon from '../assets/icons/ArrowLeftIcon.js';
import SearchIcon from '../assets/icons/SearchIcon.js';
import GlobalIcon from '../assets/icons/GlobalIcon.js';

interface IHeaderProps {
  open: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  user?: User;
}

export const handle = {
  i18n: 'header',
};

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

const searchDropdown = [
  { pageName: 'searchMovie', pageLink: 'search/movie' },
  { pageName: 'searchTv', pageLink: 'search/tv' },
  { pageName: 'searchPeople', pageLink: 'search/people' },
];

const languages = ['en', 'fr', 'vi'];

const AppBar = styled(Grid.Container, {
  // TODO: add transition on opening/closing drawer
  zIndex: 999,
  position: 'fixed',
});

const DropdownPage = ({
  pagesDropdown,
}: {
  pagesDropdown: {
    pageName: string;
    pageLink: string;
  }[];
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation('header');

  return (
    <Grid.Container
      css={{
        width: 'inherit',
        padding: '0.75rem',
        maxWidth: '200px',
      }}
    >
      {pagesDropdown.map((page) => (
        <Row key={page.pageName}>
          <NavLink to={`/${page.pageLink}`} end>
            {({ isActive }) => (
              <Text
                h1
                size={18}
                css={{
                  textTransform: 'uppercase',
                  display: 'none',
                  '@sm': {
                    display: 'flex',
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
                  {t(page.pageName)}
                </NextLink>
              </Text>
            )}
          </NavLink>
        </Row>
      ))}
    </Grid.Container>
  );
};

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { t } = useTranslation('header');
  const { setTheme } = useRemixTheme();
  const { isDark, theme } = useTheme();
  const { open, handleDrawerOpen, handleDrawerClose, user } = props;

  return (
    <AppBar
      justify="space-between"
      alignItems="center"
      color="inherit"
      className={`flex justify-between backdrop-blur-md border-b ${
        isDark ? 'bg-black/70 border-b-slate-700' : ' border-b-slate-300 bg-white/70'
      }`}
      gap={2}
      wrap="nowrap"
      css={{
        width: '100%',
        height: 80,
        padding: 0,
        margin: 0,
      }}
    >
      {/* button and logo */}
      <Grid
        xs={3}
        alignItems="center"
        css={{
          '@xsMax': {
            justifyContent: 'space-between',
          },
        }}
      >
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
      </Grid>

      {/* link page */}
      <Grid sm={6} alignItems="center">
        {pages.map((page) => (
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
                  <NextLink
                    block
                    color="primary"
                    css={{
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
          </Tooltip>
        ))}
      </Grid>

      {/* Avatar */}
      <Grid xs={6} sm={3} justify="flex-end" alignItems="center">
        {/* Search */}
        <Tooltip placement="bottom" content={<DropdownPage pagesDropdown={searchDropdown || []} />}>
          <NavLink to="/search" end style={{ marginTop: '3px' }}>
            {({ isActive }) => (
              <NextLink
                block
                color="primary"
                css={{
                  ...(isActive && {
                    background: `${theme?.colors.primaryLightActive.value}`,
                  }),
                }}
              >
                <SearchIcon fill="currentColor" filled />
              </NextLink>
            )}
          </NavLink>
        </Tooltip>
        <Spacer y={1} />

        {/* Language selector */}
        <Dropdown placement="bottom-left">
          <Dropdown.Trigger>
            <Avatar squared icon={<GlobalIcon fill="currentColor" />} />
          </Dropdown.Trigger>
          <Dropdown.Menu color="primary" aria-label="Languages">
            {languages.map((lng) => (
              <Dropdown.Item key={lng}>
                <Link key={lng} to={`/?lng=${lng}`}>
                  {t(lng)}
                </Link>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Spacer y={1} />

        {/* Dark/Light mode switcher */}
        <Switch
          checked={isDark}
          size="md"
          onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          iconOn={<MoonIcon filled />}
          iconOff={<SunIcon filled />}
          css={{
            padding: 0,
            '@xsMax': {
              display: 'none',
            },
          }}
        />
        <Spacer y={1} />
        {user ? (
          <Dropdown placement="bottom-left">
            <Dropdown.Trigger>
              <Avatar
                size="md"
                alt="Klee Cute"
                src={kleeCute}
                color="primary"
                bordered
                css={{ cursor: 'pointer' }}
              />
            </Dropdown.Trigger>
            <Dropdown.Menu color="secondary" aria-label="Avatar Actions">
              <Dropdown.Item key="profile" css={{ height: '$18' }}>
                <Text b color="inherit" css={{ d: 'flex' }}>
                  {t('signedInAs')}
                </Text>
                <Text b color="inherit" css={{ d: 'flex' }}>
                  {user?.email ?? 'klee@example.com'}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="settings" withDivider>
                {t('settings')}
              </Dropdown.Item>
              <Dropdown.Item key="analytics" withDivider>
                {t('analytics')}
              </Dropdown.Item>
              <Dropdown.Item key="system">{t('system')}</Dropdown.Item>
              <Dropdown.Item key="configurations">{t('configs')}</Dropdown.Item>
              <Dropdown.Item key="help_and_feedback" withDivider>
                {t('help&feedback')}
              </Dropdown.Item>
              <Dropdown.Item key="logout" color="error" withDivider>
                <Link to="/sign-out">
                  <Text color="error">{t('logout')}</Text>
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <NavLink to="/sign-in" end>
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
          </NavLink>
        )}
      </Grid>
    </AppBar>
  );
};

export default Header;
