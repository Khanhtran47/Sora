/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Link, useLocation, useNavigate } from '@remix-run/react';
import {
  Avatar,
  Button,
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

import useMediaQuery from '~/hooks/useMediaQuery';
import useScrollDirection from '~/hooks/useScrollDirection';

/* Components */
import NavLink from '../elements/NavLink';

/* Assets */
import kleeCute from '../../assets/images/klee.jpg';
import SunIcon from '../../assets/icons/SunIcon.js';
import MoonIcon from '../../assets/icons/MoonIcon.js';
import MenuIcon from '../../assets/icons/MenuIcon.js';
import ArrowLeftIcon from '../../assets/icons/ArrowLeftIcon.js';
import SearchIcon from '../../assets/icons/SearchIcon.js';
import GlobalIcon from '../../assets/icons/GlobalIcon.js';
// import menuNavBlack from '../../assets/lotties/lottieflow-menu-nav-11-6-000000-easey.json';
// import menuNavWhite from '../../assets/lotties/lottieflow-menu-nav-11-6-FFFFFF-easey.json';
// import arrowLeftBlack from '../../assets/lotties/lottieflow-arrow-08-1-000000-easey.json';
// import arrowLeftWhite from '../../assets/lotties/lottieflow-arrow-08-1-FFFFFF-easey.json';
import arrowLeft from '../../assets/lotties/lottieflow-arrow-08-1-0072F5-easey.json';
import dropdown from '../../assets/lotties/lottieflow-dropdown-03-0072F5-easey.json';

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
          <NavLink linkTo={`/${page.pageLink}`} linkName={t(page.pageName)} />
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
  const { t } = useTranslation('header');

  const location = useLocation();

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
                <Link to="/sign-in">
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
                </Link>
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
                  <Text h4 color="error">
                    Log out
                  </Text>
                </Link>
              </Button>
            ) : (
              <Button flat color="primary" size="md" css={{ w: 260, h: 50 }}>
                <Link to="/sign-up">Sign Up</Link>
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
                      src={arrowLeft}
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
                <Divider x={1} css={{ width: 260, margin: '10px 40px 0 0' }} />
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
                      navigate(`${location.pathname}?lng=${lng}`);
                    }}
                    css={{ w: 260, h: 50 }}
                  >
                    {t(lng)}
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
                      src={arrowLeft}
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
                <Divider x={1} css={{ width: 260, margin: '10px 40px 0 0' }} />
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
                <Text h5>Light mode</Text>
                <Switch
                  checked={isDark}
                  size="md"
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                  iconOn={<MoonIcon filled />}
                  iconOff={<SunIcon filled />}
                  css={{ padding: 0 }}
                />
                <Text h5>Dark mode</Text>
              </Grid>
              <Grid css={{ margin: '10px 0 0 10px', width: 280, minHeight: 65, display: 'block' }}>
                <Button
                  flat
                  color="primary"
                  size="md"
                  onClick={() => {
                    setTheme('dark');
                    setTheme('green');
                  }}
                  css={{ w: 260, h: 50 }}
                >
                  Green Theme
                </Button>
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
  const { open, handleDrawerOpen, handleDrawerClose, user } = props;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [lottie, setLottie] = React.useState<AnimationItem>();
  const isSm = useMediaQuery(650);
  const scrollDirection = useScrollDirection();

  React.useEffect(() => {
    if (isDropdownOpen) {
      lottie?.playSegments([0, 50], true);
    } else {
      lottie?.playSegments([50, 96], true);
    }
  }, [isDropdownOpen]);

  return (
    <AppBar
      justify="space-between"
      alignItems="center"
      color="inherit"
      className="flex justify-between backdrop-blur-md border-b transition-all duration-500"
      gap={2}
      wrap="nowrap"
      css={{
        backgroundColor: '$backgroundAlpha',
        borderBottomColor: '$border',
        width: '100%',
        top: isSm && scrollDirection === 'down' ? -64 : 0,
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
          aria-label="menu"
          css={{
            paddingRight: 8,
            paddingLeft: 8,
            marginRight: 12,
          }}
        >
          {open ? <ArrowLeftIcon /> : <MenuIcon />}
        </Button>
        <NavLink linkTo="/" isLogo />
      </Grid>

      {/* link page */}
      <Grid
        sm={6}
        alignItems="center"
        direction="row"
        justify="center"
        css={{
          display: 'flex',
        }}
      >
        {!isSm &&
          pages.map((page) => (
            <Tooltip
              key={page.pageName}
              placement="bottom"
              {...(page?.pageDropdown && {
                content: <DropdownPage pagesDropdown={page?.pageDropdown || []} />,
              })}
              {...(page?.pageDescription && { content: t(page?.pageDescription) })}
            >
              <NavLink
                linkTo={`/${page.pageLink}`}
                linkName={t(page.pageName)}
                style={{ marginRight: '10px' }}
              />
            </Tooltip>
          ))}
      </Grid>

      <Grid xs={6} sm={3} justify="flex-end" alignItems="center">
        {/* Search */}
        <Tooltip placement="bottom" content={<DropdownPage pagesDropdown={searchDropdown || []} />}>
          <NavLink
            linkTo="/search"
            isIcon
            style={{ marginTop: '3px' }}
            icon={<SearchIcon fill="currentColor" filled />}
          />
        </Tooltip>
        {/* Dropdown setting */}
        <Popover placement="bottom-right" isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <Popover.Trigger>
            <Button auto light aria-label="dropdown">
              <Player
                lottieRef={(instance) => {
                  setLottie(instance);
                }}
                src={dropdown}
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
