/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { NavLink } from '@remix-run/react';
import { Spacer, Grid, Row, Button, Tooltip, Loading, Card, Link } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { tv, type VariantProps } from 'tailwind-variants';
import Image, { MimeType } from 'remix-image';

import { leftDrawerPages } from '~/constants/navPages';

import { H2, H4, H5, H6 } from '~/components/styles/Text.styles';
// import NavLink from '~/components/elements/NavLink';
import { drawerWidth, openedMixin, closedMixin, Drawer } from '~/components/layouts/Layout.styles';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/elements/NavigationMenu';

/* icons */
import MenuIcon from '~/assets/icons/MenuIcon';
import TrendingUp from '~/assets/icons/TrendingUpIcon';
import Settings from '~/assets/icons/SettingsIcon';
import Library from '~/assets/icons/LibraryIcon';
import History from '~/assets/icons/HistoryIcon';
import TwoUsers from '~/assets/icons/TwoUsersIcon';
import CategoryIcon from '~/assets/icons/CategoryIcon';
import Arrow from '~/assets/icons/ArrowIcon';
import Logo from '~/assets/images/logo_loading.png';
import Home from '~/assets/icons/HomeIcon';
import Search from '~/assets/icons/SearchIcon';
import Discover from '~/assets/icons/DiscoverIcon';

interface ILeftDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handle = {
  i18n: 'left-drawer',
};

const sidebarStyles = tv({
  base: 'grow-0 shrink-0 box-border h-screen fixed top-0 left-0 z-[999]',
  variants: {
    sidebarMiniMode: {
      true: 'basis-[65px] max-w-[65px] w-full',
      false: 'basis-[250px] max-w-[250px] w-full',
    },
    // sidebarBoxedMode: {}
  },
  defaultVariants: {
    sidebarMiniMode: false,
  },
});

const sidebarActiveStyles = tv({
  base: 'w-[215px] h-[50px] justify-start',
  variants: {
    sidebarRoundedAll: {
      true: 'rounded-md',
      false: 'rounded-r-md',
    },
    sidebarPillAll: {
      true: 'rounded-[50px]',
      false: 'rounded-r-[50px]',
    },
  },
  defaultVariants: {
    sidebarRoundedAll: true,
  },
});

const SideBar: React.FC<ILeftDrawerProps> = (props: ILeftDrawerProps) => {
  const { t } = useTranslation('left-drawer');
  // const wrapperRef = React.useRef<HTMLDivElement>(null);
  // const { open, setOpen } = props;

  /**
   * If the drawer is open and the user clicks outside of the drawer, close the drawer.
   * @param {any} event - any - this is the event that is triggered when the user clicks outside of the
   * drawer.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const handleClickOutside = (event: any) => {
  //   if (open && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
  //     setOpen(false);
  //   }
  // };

  // /* Adding an event listener to the document for handling click outside drawer */
  // React.useEffect(() => {
  //   document.addEventListener('click', handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside, true);
  //   };
  // });

  return (
    <aside className={sidebarStyles()}>
      <div className="flex flex-row justify-start w-full h-[65px] items-center mb-3 ml-4">
        <div className="basis-[65px] grow-0 shrink-0 flex justify-center">
          <Image
            width="30px"
            height="30px"
            className="rounded-full"
            loaderUrl="/api/image"
            alt="Logo"
            src={Logo}
            placeholder="blur"
            responsive={[
              {
                size: {
                  width: 30,
                  height: 30,
                },
              },
            ]}
            dprVariants={[1, 3]}
            options={{
              contentType: MimeType.WEBP,
            }}
          />
        </div>
        <NavLink to="/" arial-label="home-page">
          <H2
            h2
            css={{
              textGradient: '45deg, $primary, $secondary 50%',
              fontFamily: 'monospace',
              letterSpacing: '0.3rem',
              textDecoration: 'none',
            }}
          >
            SORA
          </H2>
        </NavLink>
      </div>
      <NavigationMenu orientation="vertical">
        <NavigationMenuList
          orientation="vertical"
          className="m-0 [&_.active]:bg-primary-light-active [&_.active]:text-primary"
        >
          <NavigationMenuItem className="w-[215px] text-left" value="home">
            <NavigationMenuLink asChild>
              <NavLink
                to="/"
                className={navigationMenuTriggerStyle({
                  class: 'w-[215px] h-[50px] justify-start',
                })}
              >
                {({ isActive, isPending }) => (
                  <>
                    <Home className="mr-4" filled={isActive} />
                    Home
                    <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                  </>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left" value="trending">
            <NavigationMenuLink asChild>
              <NavLink
                to="/trending"
                className={navigationMenuTriggerStyle({
                  class: 'w-[215px] h-[50px] justify-start',
                })}
              >
                {({ isActive, isPending }) => (
                  <>
                    <TrendingUp className="mr-4" filled={isActive} />
                    Trending
                    <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                  </>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left" value="search">
            <NavigationMenuTrigger className={sidebarActiveStyles()}>
              <Search className="mr-4" />
              Search
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-0 flex flex-row gap-x-[6px] p-[6px] w-fit">
                <li className="flex flex-col gap-y-[6px] m-0 justify-between [&_.active]:bg-background [&_.active]:text-primary">
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/search/movie"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[215px] h-auto flex flex-row px-2 justify-start items-center focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <Search className="mr-2 w-5 h-5" filled={isActive} />
                          Search Movies
                          <Loading
                            className={isPending ? 'ml-auto' : '!hidden'}
                            type="points-opacity"
                          />
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/search/tv"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[215px] h-auto flex flex-row px-2 justify-start items-center focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <Search className="mr-2 w-5 h-5" filled={isActive} />
                          Search Tv shows
                          <Loading
                            className={isPending ? 'ml-auto' : '!hidden'}
                            type="points-opacity"
                          />
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/search/anime"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[215px] h-auto  flex flex-row px-2 justify-start items-center focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <Search className="mr-2 w-5 h-5" filled={isActive} />
                          Search Anime
                          <Loading
                            className={isPending ? 'ml-auto' : '!hidden'}
                            type="points-opacity"
                          />
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/search/people"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[215px] h-auto flex flex-row px-2 justify-start items-center focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <Search className="mr-2 w-5 h-5" filled={isActive} />
                          Popular
                          <Loading
                            className={isPending ? 'ml-auto' : '!hidden'}
                            type="points-opacity"
                          />
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="movies">
            <NavigationMenuTrigger className={sidebarActiveStyles()}>
              <TrendingUp className="mr-4" />
              Movies
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-0 flex flex-row gap-x-[6px] p-[6px] w-fit">
                <li className="m-0 basis-[215px] grow-0 shrink-0">
                  <NavLink to="/movies/discover">
                    <Card
                      as="div"
                      isPressable
                      css={{ w: '100%', borderWidth: 0, filter: 'unset', borderRadius: 6 }}
                    >
                      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
                        <Link
                          as={H6}
                          isExternal
                          className="text-text !max-w-none !w-full [&_.nextui-link-icon]:ml-auto"
                        >
                          Start Discover
                        </Link>
                      </Card.Header>
                      <Card.Body css={{ p: 0, w: '100%', aspectRatio: '2/3' }}>
                        <Card.Image
                          // @ts-ignore
                          as={Image}
                          width="215px"
                          height="auto"
                          objectFit="cover"
                          css={{
                            aspectRatio: '2/3',
                            filter: 'brightness(0.5)',
                          }}
                          showSkeleton
                          loaderUrl="/api/image"
                          alt="Discover movies"
                          src="https://image.tmdb.org/t/p/w342_filter(duotone,190235,ad47dd)/wNB551TsEb7KFU3an5LwOrgvUpn.jpg"
                          loading="lazy"
                          placeholder="empty"
                          responsive={[
                            {
                              size: {
                                width: 215,
                                height: (215 / 2) * 3,
                              },
                            },
                          ]}
                          dprVariants={[1, 3]}
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                        />
                      </Card.Body>
                      <Card.Footer
                        isBlurred
                        className="absolute b-0 z-[1] backdrop-blur-sm bg-background-contrast-alpha"
                        css={{
                          position: 'absolute',
                          zIndex: 1,
                          bottom: 0,
                          backgroundColor: '$backgroundAlpha',
                          justifyContent: 'flex-start',
                          borderBottomLeftRadius: 6,
                          borderBottomRightRadius: 6,
                        }}
                      >
                        <H4 className="text-white">Movies</H4>
                      </Card.Footer>
                    </Card>
                  </NavLink>
                </li>
                <li className="flex flex-col gap-y-[6px] m-0 justify-between [&_.active]:bg-background [&_.active]:text-primary">
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/movies/popular"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[215px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Popular
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Widely watched and buzzed-about films.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/movies/now-playing"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[215px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Now Playing
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">Currently showing in theaters.</p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/movies/upcoming"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[215px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Upcoming
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Releases coming soon, generating excitement.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/movies/top-rated"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[215px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Top Rated
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Critically acclaimed, award-winning, or fan-favorites.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="tv-shows">
            <NavigationMenuTrigger className={sidebarActiveStyles()}>
              <Settings className="mr-4" />
              Tv Shows
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-0 flex flex-row gap-x-[6px] p-[6px] w-fit">
                <li className="m-0 basis-[215px] grow-0 shrink-0">
                  <NavLink to="/tv-shows/discover">
                    <Card
                      as="div"
                      isPressable
                      css={{ w: '100%', borderWidth: 0, filter: 'unset', borderRadius: 6 }}
                    >
                      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
                        <Link
                          as={H6}
                          isExternal
                          className="text-text !max-w-none !w-full [&_.nextui-link-icon]:ml-auto"
                        >
                          Start Discover
                        </Link>
                      </Card.Header>
                      <Card.Body css={{ p: 0, w: '100%', aspectRatio: '2/3' }}>
                        <Card.Image
                          // @ts-ignore
                          as={Image}
                          width="215px"
                          height="auto"
                          objectFit="cover"
                          css={{
                            aspectRatio: '2/3',
                            filter: 'brightness(0.5)',
                          }}
                          showSkeleton
                          loaderUrl="/api/image"
                          alt="Discover tv shows"
                          src="https://image.tmdb.org/t/p/w342_filter(duotone,352302,ddd147)/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"
                          loading="lazy"
                          placeholder="empty"
                          responsive={[
                            {
                              size: {
                                width: 215,
                                height: (215 / 2) * 3,
                              },
                            },
                          ]}
                          dprVariants={[1, 3]}
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                        />
                      </Card.Body>
                      <Card.Footer
                        isBlurred
                        className="absolute b-0 z-[1] backdrop-blur-sm bg-background-contrast-alpha"
                        css={{
                          position: 'absolute',
                          zIndex: 1,
                          bottom: 0,
                          backgroundColor: '$backgroundAlpha',
                          justifyContent: 'flex-start',
                          borderBottomLeftRadius: 6,
                          borderBottomRightRadius: 6,
                        }}
                      >
                        <H4 className="text-white">Tv Shows</H4>
                      </Card.Footer>
                    </Card>
                  </NavLink>
                </li>
                <li className="flex flex-col gap-y-[6px] m-0 justify-between [&_.active]:bg-background [&_.active]:text-primary">
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/tv-shows/popular"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[225px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Popular
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Widely watched and buzzed-about shows.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/tv-shows/airing-today"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[225px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Airing Today
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Currently playing on TV networks or streaming services.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/tv-shows/on-tv"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[225px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            On Tv
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Tv shows currently available to watch.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/tv-shows/top-rated"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[225px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Top Rated
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Critically acclaimed, award-winning, or fan-favorites.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="anime">
            <NavigationMenuTrigger className={sidebarActiveStyles()}>
              <Library className="mr-4" />
              Anime
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-0 flex flex-row gap-x-[6px] p-[6px] w-fit">
                <li className="m-0 basis-[215px] grow-0 shrink-0">
                  <NavLink to="/anime/discover">
                    <Card
                      as="div"
                      isPressable
                      css={{ w: '100%', borderWidth: 0, filter: 'unset', borderRadius: 6 }}
                    >
                      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
                        <Link
                          as={H6}
                          isExternal
                          className="text-text !max-w-none !w-full [&_.nextui-link-icon]:ml-auto"
                        >
                          Start Discover
                        </Link>
                      </Card.Header>
                      <Card.Body css={{ p: 0, w: '100%', aspectRatio: '2/3' }}>
                        <Card.Image
                          // @ts-ignore
                          as={Image}
                          width="215px"
                          height="auto"
                          objectFit="cover"
                          css={{
                            aspectRatio: '2/3',
                            filter: 'brightness(0.5)',
                          }}
                          showSkeleton
                          loaderUrl="/api/image"
                          alt="Discover anime"
                          src="https://image.tmdb.org/t/p/w342_filter(duotone,070235,dd4749)/iAld03IP69UEpqQbVWoRBvjqkqX.jpg"
                          loading="lazy"
                          placeholder="empty"
                          responsive={[
                            {
                              size: {
                                width: 215,
                                height: (215 / 2) * 3,
                              },
                            },
                          ]}
                          dprVariants={[1, 3]}
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                        />
                      </Card.Body>
                      <Card.Footer
                        isBlurred
                        className="absolute b-0 z-[1] backdrop-blur-sm bg-background-contrast-alpha"
                        css={{
                          position: 'absolute',
                          zIndex: 1,
                          bottom: 0,
                          backgroundColor: '$backgroundAlpha',
                          justifyContent: 'flex-start',
                          borderBottomLeftRadius: 6,
                          borderBottomRightRadius: 6,
                        }}
                      >
                        <H4 className="text-white">Anime</H4>
                      </Card.Footer>
                    </Card>
                  </NavLink>
                </li>
                <li className="flex flex-col gap-y-[6px] m-0 justify-between [&_.active]:bg-background [&_.active]:text-primary">
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/anime/popular"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[225px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Popular
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Widely watched and buzzed-about anime.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/anime/trending"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[225px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Trending
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Currently gaining popularity and attention among viewers.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/anime/recent-episodes"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[225px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isActive, isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" filled={isActive} />
                            Recent Episodes
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Latest episodes of ongoing anime series.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/anime/random"
                      className={navigationMenuTriggerStyle({
                        class:
                          'w-[225px] h-auto flex flex-col px-2 justify-start focus:bg-background-alpha hover:bg-background-alpha',
                      })}
                    >
                      {({ isPending }) => (
                        <>
                          <div className="flex flex-row justify-start items-center w-full mb-2">
                            <Discover className="mr-2 w-5 h-5" />
                            Random Anime
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            Anime is selected at random, without a specific theme.
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left" value="people">
            <NavigationMenuLink asChild>
              <NavLink
                to="/people"
                className={navigationMenuTriggerStyle({
                  class: 'w-[215px] h-[50px] justify-start',
                })}
              >
                {({ isActive, isPending }) => (
                  <>
                    <TwoUsers className="mr-4" filled={isActive} />
                    People
                    <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                  </>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left" value="collections">
            <NavigationMenuLink asChild>
              <NavLink
                to="/collections"
                className={navigationMenuTriggerStyle({
                  class: 'w-[215px] h-[50px] justify-start',
                })}
              >
                {({ isActive, isPending }) => (
                  <>
                    <CategoryIcon className="mr-4" filled={isActive} />
                    Collections
                    <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                  </>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left" value="my-list">
            <NavigationMenuLink asChild>
              <NavLink
                to="/list"
                className={navigationMenuTriggerStyle({
                  class: 'w-[215px] h-[50px] justify-start',
                })}
              >
                {({ isActive, isPending }) => (
                  <>
                    <Library className="mr-4" filled={isActive} />
                    My List
                    <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                  </>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left" value="history">
            <NavigationMenuLink asChild>
              <NavLink
                to="/watch-history"
                className={navigationMenuTriggerStyle({
                  class: 'w-[215px] h-[50px] justify-start',
                })}
              >
                {({ isActive, isPending }) => (
                  <>
                    <History className="mr-4" filled={isActive} />
                    History
                    <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                  </>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left" value="settings">
            <NavigationMenuLink asChild>
              <NavLink
                to="/settings"
                className={navigationMenuTriggerStyle({
                  class: 'w-[215px] h-[50px] justify-start',
                })}
              >
                {({ isActive, isPending }) => (
                  <>
                    <Settings className="mr-4" filled={isActive} />
                    Settings
                    <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                  </>
                )}
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};

export default SideBar;
