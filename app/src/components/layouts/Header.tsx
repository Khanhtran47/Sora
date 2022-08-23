/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { NavLink, Link, useNavigate } from '@remix-run/react';
import {
  Avatar,
  Button,
  Link as NextLink,
  Text,
  Grid,
  Row,
  Switch,
  Tooltip,
  Popover,
  useTheme,
  styled,
  Divider,
} from '@nextui-org/react';
import { useTheme as useRemixTheme } from 'next-themes';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { Player } from '@lottiefiles/react-lottie-player';
import type { AnimationItem } from 'lottie-web';
import { useTranslation } from 'react-i18next';

/* Components */

/* Assets */
import kleeCute from '../../assets/images/klee.jpg';
import SunIcon from '../../assets/icons/SunIcon.js';
import MoonIcon from '../../assets/icons/MoonIcon.js';
import MenuIcon from '../../assets/icons/MenuIcon.js';
import ArrowLeftIcon from '../../assets/icons/ArrowLeftIcon.js';
import SearchIcon from '../../assets/icons/SearchIcon.js';
import GlobalIcon from '../../assets/icons/GlobalIcon.js';
import menuNavBlack from '../../assets/lotties/lottieflow-menu-nav-11-6-000000-easey.json';
import menuNavWhite from '../../assets/lotties/lottieflow-menu-nav-11-6-FFFFFF-easey.json';
import arrowLeftBlack from '../../assets/lotties/lottieflow-arrow-08-1-000000-easey.json';
import arrowLeftWhite from '../../assets/lotties/lottieflow-arrow-08-1-FFFFFF-easey.json';

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
    pageLink: 'people',
    pageDescription: 'description',
  },
];

const searchDropdown = [
  { pageName: 'searchMovie', pageLink: 'search/movie' },
  { pageName: 'searchTv', pageLink: 'search/tv' },
  { pageName: 'searchPeople', pageLink: 'search/people' },
];

const slideHorizontalAnimation = {
  left: {
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  right: {
    x: -290,
    transition: {
      duration: 0.3,
    },
  },
};

const languages = ['en', 'fr', 'vi'];

const AppBar = styled(Grid.Container, {
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

const MultiLevelDropdown = ({ user }: { user: User | undefined }) => {
  const { isDark } = useTheme();
  const { setTheme } = useRemixTheme();
  const navigate = useNavigate();
  const [isLeftMenu, setIsLeftMenu] = React.useState(true);
  const [isLanguageTab, setIsLanguageTab] = React.useState(false);
  const [isDisplayTab, setIsDisplayTab] = React.useState(false);
  return (
    <motion.div
      className="dropdown"
      initial="left"
      animate={isLeftMenu ? 'left' : 'right'}
      variants={slideHorizontalAnimation}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: '100%',
        position: 'relative',
        transition: 'height 0.3s',
        width: '590px',
        transform: `${isLeftMenu ? 'none' : ' translateZ(0px) translateX(-290px)'}`,
      }}
    >
      <motion.div>
        <Grid.Container
          css={{
            flexDirection: 'column',
          }}
        >
          <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
            <Button
              light
              color="primary"
              size="md"
              css={{ w: 260, h: 50 }}
              icon={
                <Avatar
                  size="md"
                  alt="Klee Cute"
                  src={kleeCute}
                  color="primary"
                  bordered
                  css={{ cursor: 'pointer' }}
                />
              }
            >
              {user ? (
                <Text
                  color="inherit"
                  h3
                  size={14}
                  css={{
                    marginLeft: '3.5rem',
                    '@sm': {
                      fontSize: '16px',
                    },
                  }}
                >
                  {user?.email ?? 'klee@example.com'}
                </Text>
              ) : (
                <NavLink to="/sign-in">
                  <Text
                    color="inherit"
                    h3
                    size={14}
                    css={{
                      textTransform: 'uppercase',
                      '@sm': {
                        fontSize: '20px',
                      },
                    }}
                  >
                    Sign In
                  </Text>
                </NavLink>
              )}
            </Button>
            <Divider x={1} css={{ width: 260, margin: '10px 40px 0 0' }} />
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
            <Button
              flat
              color="primary"
              size="md"
              onClick={() => {
                setIsLanguageTab(true);
                setIsLeftMenu(false);
              }}
              css={{ w: 260, h: 50 }}
              icon={<GlobalIcon />}
            >
              Language
            </Button>
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
            <Button
              flat
              color="primary"
              size="md"
              onClick={() => {
                setIsDisplayTab(true);
                setIsLeftMenu(false);
              }}
              css={{ w: 260, h: 50 }}
            >
              Display
            </Button>
          </Grid>
          <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
            {user ? (
              <Button flat color="error" size="md" css={{ w: 260, h: 50 }}>
                <Link to="/sign-out">
                  <Text color="error">Log out</Text>
                </Link>
              </Button>
            ) : (
              <Button flat color="primary" size="md" css={{ w: 260, h: 50 }}>
                <NavLink to="/sign-up">Sign Up</NavLink>
              </Button>
            )}
          </Grid>
        </Grid.Container>
      </motion.div>
      <motion.div>
        <Grid.Container
          css={{
            flexDirection: 'column',
          }}
        >
          {isLanguageTab && (
            <>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  light
                  color="primary"
                  size="md"
                  onClick={() => {
                    setIsLanguageTab(false);
                    setIsLeftMenu(true);
                  }}
                  css={{ w: 260, h: 50 }}
                  icon={
                    <Player
                      src={isDark ? arrowLeftWhite : arrowLeftBlack}
                      hover
                      autoplay={false}
                      speed={0.75}
                      className="w-8 h-8"
                      loop
                    />
                  }
                >
                  Language
                </Button>
              </Grid>
              {languages.map((lng) => (
                <Grid
                  key={lng}
                  css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}
                >
                  <Button
                    flat
                    color="primary"
                    size="md"
                    onClick={() => {
                      setIsLanguageTab(false);
                      setIsLeftMenu(true);
                      navigate(`/?lng=${lng}`);
                    }}
                    css={{ w: 260, h: 50 }}
                  >
                    {lng}
                  </Button>
                </Grid>
              ))}
            </>
          )}
          {isDisplayTab && (
            <>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  light
                  color="primary"
                  size="md"
                  onClick={() => {
                    setIsDisplayTab(false);
                    setIsLeftMenu(true);
                  }}
                  css={{ w: 260, h: 50 }}
                  icon={
                    <Player
                      src={isDark ? arrowLeftWhite : arrowLeftBlack}
                      hover
                      autoplay={false}
                      speed={0.75}
                      className="w-8 h-8"
                      loop
                    />
                  }
                >
                  Display
                </Button>
              </Grid>
              <Grid
                direction="row"
                justify="space-around"
                alignItems="center"
                css={{
                  display: 'flex',
                  width: 280,
                  minHeight: 65,
                }}
              >
                <Text>Light mode</Text>
                <Switch
                  checked={isDark}
                  size="md"
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                  iconOn={<MoonIcon filled />}
                  iconOff={<SunIcon filled />}
                  css={{ padding: 0 }}
                />
                <Text>Dark mode</Text>
              </Grid>
            </>
          )}
        </Grid.Container>
      </motion.div>
    </motion.div>
  );
};

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { t } = useTranslation('header');
  const { isDark, theme } = useTheme();
  const { open, handleDrawerOpen, handleDrawerClose, user } = props;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [lottie, setLottie] = React.useState<AnimationItem>();

  React.useEffect(() => {
    if (isDropdownOpen) {
      lottie?.playSegments([0, 80], true);
    } else {
      lottie?.playSegments([80, 156], true);
    }
  }, [isDropdownOpen]);

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
        height: 64,
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
        <Popover placement="bottom-right" isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <Popover.Trigger>
            <Button auto light>
              <Player
                lottieRef={(instance) => {
                  setLottie(instance);
                }}
                src={isDark ? menuNavWhite : menuNavBlack}
                autoplay={false}
                keepLastFrame
                speed={2.7}
                className="w-8 h-8"
              />
            </Button>
          </Popover.Trigger>
          <Popover.Content
            css={{
              display: 'block',
              opacity: 1,
              transform: 'none',
              overflow: 'hidden',
              transition: 'height 0.5s',
              width: 280,
              zIndex: 999,
            }}
          >
            <MultiLevelDropdown user={user} />
          </Popover.Content>
        </Popover>
      </Grid>
    </AppBar>
  );
};

export default Header;
