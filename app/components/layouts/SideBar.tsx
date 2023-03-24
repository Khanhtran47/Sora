/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { NavLink } from '@remix-run/react';
import { Spacer, Grid, Row, Button, Tooltip, Loading, Card, Link } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { tv, type VariantProps } from 'tailwind-variants';
import Image, { MimeType } from 'remix-image';
import { useHover } from '@react-aria/interactions';

import { useSoraSettings } from '~/hooks/useLocalStorage';

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
// import {
//   ScrollArea,
//   ScrollAreaViewport,
//   ScrollAreaScrollbar,
//   ScrollAreaThumb,
//   ScrollAreaCorner,
// } from '~/components/elements/scroll-area/ScrollArea';

/* icons */
import MenuIcon from '~/assets/icons/MenuIcon';
import TrendingUp from '~/assets/icons/TrendingUpIcon';
import Settings from '~/assets/icons/SettingsIcon';
import Library from '~/assets/icons/LibraryIcon';
import History from '~/assets/icons/HistoryIcon';
import TwoUsers from '~/assets/icons/TwoUsersIcon';
import CategoryIcon from '~/assets/icons/CategoryIcon';
import Logo from '~/assets/images/logo_loading.png';
import Home from '~/assets/icons/HomeIcon';
import Search from '~/assets/icons/SearchIcon';
import Discover from '~/assets/icons/DiscoverIcon';
import Movie from '~/assets/icons/MovieIcon';
import Tv from '~/assets/icons/TvIcon';
import Anime from '~/assets/icons/AnimeIcon';

interface ILeftDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handle = {
  i18n: 'left-drawer',
};

const sidebarStyles = tv({
  base: 'grow-0 shrink-0 box-border fixed z-[999] hidden sm:block transition-[max-width] duration-400',
  variants: {
    sidebarMiniMode: {
      true: 'basis-[80px] max-w-[80px] w-full',
      false: 'basis-[250px] max-w-[250px] w-full',
    },
    sidebarBoxedMode: {
      true: 'top-[15px] left-[15px] bg-background-contrast-alpha rounded-xl h-[calc(100vh_-_30px)]',
      false: 'top-0 left-0 h-screen',
    },
    sidebarHoverMode: {
      true: 'basis-[250px] max-w-[250px] w-full bg-background-contrast rounded-r-xl border border-border shadow-2xl',
    },
  },
  compoundVariants: [{}],
  defaultVariants: {
    sidebarMiniMode: false,
    sidebarBoxedMode: false,
  },
});

const sidebarActiveStyles = tv({
  base: 'h-[56px] justify-start transition-[width] duration-400',
  variants: {
    sidebarMiniMode: {
      true: 'w-[56px]',
      false: 'w-[215px]',
    },
    sidebarHoverMode: {
      true: 'w-[215px]',
    },
    sidebarRoundedAll: {
      true: 'rounded-md',
      false: 'rounded-r-md',
    },
    sidebarPillAll: {
      true: 'rounded-[56px]',
      false: 'rounded-r-[56px]',
    },
  },
  defaultVariants: {
    sidebarMiniMode: false,
    sidebarRoundedAll: true,
  },
});

const SideBar: React.FC<ILeftDrawerProps> = (props: ILeftDrawerProps) => {
  const { t } = useTranslation('sidebar');
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

  const { sidebarMiniMode, sidebarHoverMode, sidebarBoxedMode, sidebarSheetMode } =
    useSoraSettings();
  const { hoverProps: sidebarHoverProps, isHovered } = useHover({
    isDisabled: !sidebarHoverMode.value,
  });
  const navigationItemWidthStyle = sidebarMiniMode.value && !isHovered ? 'w-[56px]' : 'w-[215px]';

  return (
    <aside
      {...sidebarHoverProps}
      className={sidebarStyles({
        sidebarMiniMode: sidebarMiniMode.value,
        sidebarBoxedMode: sidebarBoxedMode.value,
        sidebarHoverMode: isHovered,
      })}
    >
      <div className="flex flex-row justify-start w-full h-[65px] items-center mb-3 ml-4">
        <div
          className={`${
            sidebarMiniMode.value && !isHovered ? 'basis-[50px]' : 'basis-[65px]'
          } grow-0 shrink-0 flex justify-center`}
        >
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
        {sidebarMiniMode.value && !isHovered ? null : (
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
        )}
      </div>
      <NavigationMenu orientation="vertical">
        <NavigationMenuList
          orientation="vertical"
          className="m-0 [&_.active]:bg-primary-light-active [&_.active]:text-primary"
        >
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="home"
          >
            <Tooltip
              content="Home"
              isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
              placement="right"
              color="primary"
              offset={10}
            >
              <NavigationMenuLink asChild>
                <NavLink
                  to="/"
                  className={navigationMenuTriggerStyle({
                    class: `${navigationItemWidthStyle} h-[56px] justify-start transition-[width] duration-200`,
                  })}
                >
                  {({ isActive, isPending }) => (
                    <>
                      <Home
                        className={
                          !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                        }
                        filled={isActive}
                      />
                      {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('home') : null}
                      <Loading
                        className={
                          isPending && (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                            ? 'ml-auto'
                            : '!hidden'
                        }
                        type="points-opacity"
                      />
                    </>
                  )}
                </NavLink>
              </NavigationMenuLink>
            </Tooltip>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="trending"
          >
            <Tooltip
              content="Trending"
              isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
              placement="right"
              color="primary"
              offset={10}
            >
              <NavigationMenuLink asChild>
                <NavLink
                  to="/trending"
                  className={navigationMenuTriggerStyle({
                    class: `${navigationItemWidthStyle} h-[56px] justify-start transition-[width] duration-200`,
                  })}
                >
                  {({ isActive, isPending }) => (
                    <>
                      <TrendingUp
                        className={
                          !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                        }
                        filled={isActive}
                      />
                      {!sidebarMiniMode.value || (sidebarHoverMode && isHovered)
                        ? t('trending')
                        : null}
                      <Loading
                        className={
                          isPending && (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                            ? 'ml-auto'
                            : '!hidden'
                        }
                        type="points-opacity"
                      />
                    </>
                  )}
                </NavLink>
              </NavigationMenuLink>
            </Tooltip>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="collections"
          >
            <Tooltip
              content="Collections"
              isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
              placement="right"
              color="primary"
              offset={10}
            >
              <NavigationMenuLink asChild>
                <NavLink
                  to="/collections"
                  className={navigationMenuTriggerStyle({
                    class: `${navigationItemWidthStyle} h-[56px] justify-start transition-[width] duration-200`,
                  })}
                >
                  {({ isActive, isPending }) => (
                    <>
                      <CategoryIcon
                        className={
                          !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                        }
                        filled={isActive}
                      />
                      {!sidebarMiniMode.value || (sidebarHoverMode && isHovered)
                        ? t('collections')
                        : null}
                      <Loading
                        className={
                          isPending && (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                            ? 'ml-auto'
                            : '!hidden'
                        }
                        type="points-opacity"
                      />
                    </>
                  )}
                </NavLink>
              </NavigationMenuLink>
            </Tooltip>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="search"
          >
            <NavigationMenuTrigger
              className={sidebarActiveStyles({
                sidebarMiniMode: sidebarMiniMode.value,
                sidebarHoverMode: isHovered,
              })}
              showArrow={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
            >
              <Search
                className={!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''}
              />
              {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('search') : null}
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
                          {t('search-movies')}
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
                          {t('search-tv-shows')}
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
                          {t('search-anime')}
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
                          {t('search-people')}
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
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="movies"
          >
            <NavigationMenuTrigger
              className={sidebarActiveStyles({
                sidebarMiniMode: sidebarMiniMode.value,
                sidebarHoverMode: isHovered,
              })}
              showArrow={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
            >
              <Movie
                className={!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''}
              />
              {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('movies') : null}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-0 flex flex-row gap-x-[6px] p-[6px] w-fit">
                <li className="m-0 basis-[215px] grow-0 shrink-0">
                  <NavLink to="/discover/movies">
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
                          {t('movies-discover')}
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
                        <H4 className="text-white">{t('movies-footer')}</H4>
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
                            {t('movies-popular')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">{t('movies-popular-subtitle')}</p>
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
                            {t('movies-now-playing')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            {t('movies-now-playing-subtitle')}
                          </p>
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
                            {t('movies-upcoming')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            {t('movies-upcoming-subtitle')}
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
                            {t('movies-top-rated')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            {t('movies-top-rated-subtitle')}
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="tv-shows"
          >
            <NavigationMenuTrigger
              className={sidebarActiveStyles({
                sidebarMiniMode: sidebarMiniMode.value,
                sidebarHoverMode: isHovered,
              })}
              showArrow={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
            >
              <Tv
                className={!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''}
              />
              {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('tv-shows') : null}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-0 flex flex-row gap-x-[6px] p-[6px] w-fit">
                <li className="m-0 basis-[215px] grow-0 shrink-0">
                  <NavLink to="/discover/tv-shows">
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
                          {t('tv-shows-discover')}
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
                        <H4 className="text-white">{t('tv-shows-footer')}</H4>
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
                            {t('tv-shows-popular')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            {t('tv-shows-popular-subtitle')}
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
                            {t('tv-shows-airing-today')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            {t('tv-shows-airing-today-subtitle')}
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
                            {t('tv-shows-on-tv')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">{t('tv-shows-on-tv-subtitle')}</p>
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
                            {t('tv-shows-top-rated')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            {t('tv-shows-top-rated-subtitle')}
                          </p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="anime"
          >
            <NavigationMenuTrigger
              className={sidebarActiveStyles({
                sidebarMiniMode: sidebarMiniMode.value,
                sidebarHoverMode: isHovered,
              })}
              showArrow={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
            >
              <Anime
                className={!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''}
              />
              {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('anime') : null}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-0 flex flex-row gap-x-[6px] p-[6px] w-fit">
                <li className="m-0 basis-[215px] grow-0 shrink-0">
                  <NavLink to="/discover/anime">
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
                          {t('anime-discover')}
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
                        <H4 className="text-white">{t('anime-footer')}</H4>
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
                            {t('anime-popular')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">{t('anime-popular-subtitle')}</p>
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
                            {t('anime-trending')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">{t('anime-trending-subtitle')}</p>
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
                            {t('anime-recent-episodes')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">
                            {t('anime-recent-episodes-subtitle')}
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
                            {t('anime-random')}
                            <Loading
                              className={isPending ? 'ml-auto' : '!hidden'}
                              type="points-opacity"
                            />
                          </div>
                          <p className="text-text text-xs w-full">{t('anime-random-subtitle')}</p>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="people"
          >
            <Tooltip
              content="People"
              isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
              placement="right"
              color="primary"
              offset={10}
            >
              <NavigationMenuLink asChild>
                <NavLink
                  to="/people"
                  className={navigationMenuTriggerStyle({
                    class: `${navigationItemWidthStyle} h-[56px] justify-start transition-[width] duration-200`,
                  })}
                >
                  {({ isActive, isPending }) => (
                    <>
                      <TwoUsers
                        className={
                          !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                        }
                        filled={isActive}
                      />
                      {!sidebarMiniMode.value || (sidebarHoverMode && isHovered)
                        ? t('people')
                        : null}
                      <Loading
                        className={
                          isPending && (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                            ? 'ml-auto'
                            : '!hidden'
                        }
                        type="points-opacity"
                      />
                    </>
                  )}
                </NavLink>
              </NavigationMenuLink>
            </Tooltip>
          </NavigationMenuItem>
          {/* <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="my-list"
          >
            <Tooltip
              content="My List"
              isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
              placement="right"
              color="primary"
              offset={10}
            >
              <NavigationMenuLink asChild>
                <NavLink
                  to="/list"
                  className={navigationMenuTriggerStyle({
                    class: `${navigationItemWidthStyle} h-[56px] justify-start transition-[width] duration-200`,
                  })}
                >
                  {({ isActive, isPending }) => (
                    <>
                      <Library
                        className={
                          !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                        }
                        filled={isActive}
                      />
                      {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'My List' : null}
                      <Loading
                        className={
                          isPending && (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                            ? 'ml-auto'
                            : '!hidden'
                        }
                        type="points-opacity"
                      />
                    </>
                  )}
                </NavLink>
              </NavigationMenuLink>
            </Tooltip>
          </NavigationMenuItem> */}
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="history"
          >
            <Tooltip
              content="History"
              isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
              placement="right"
              color="primary"
              offset={10}
            >
              <NavigationMenuLink asChild>
                <NavLink
                  to="/watch-history"
                  className={navigationMenuTriggerStyle({
                    class: `${navigationItemWidthStyle} h-[56px] justify-start transition-[width] duration-200`,
                  })}
                >
                  {({ isActive, isPending }) => (
                    <>
                      <History
                        className={
                          !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                        }
                        filled={isActive}
                      />
                      {!sidebarMiniMode.value || (sidebarHoverMode && isHovered)
                        ? t('history')
                        : null}
                      <Loading
                        className={
                          isPending && (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                            ? 'ml-auto'
                            : '!hidden'
                        }
                        type="points-opacity"
                      />
                    </>
                  )}
                </NavLink>
              </NavigationMenuLink>
            </Tooltip>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
            value="settings"
          >
            <Tooltip
              content="Settings"
              isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
              placement="right"
              color="primary"
              offset={10}
            >
              <NavigationMenuLink asChild>
                <NavLink
                  to="/settings"
                  className={navigationMenuTriggerStyle({
                    class: `${navigationItemWidthStyle} h-[56px] justify-start transition-[width] duration-200`,
                  })}
                >
                  {({ isActive, isPending }) => (
                    <>
                      <Settings
                        className={
                          !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                        }
                        filled={isActive}
                      />
                      {!sidebarMiniMode.value || (sidebarHoverMode && isHovered)
                        ? t('settings')
                        : null}
                      <Loading
                        className={
                          isPending && (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                            ? 'ml-auto'
                            : '!hidden'
                        }
                        type="points-opacity"
                      />
                    </>
                  )}
                </NavLink>
              </NavigationMenuLink>
            </Tooltip>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};

export default SideBar;
