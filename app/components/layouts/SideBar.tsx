import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import { Spinner } from '@nextui-org/spinner';
import { Tooltip } from '@nextui-org/tooltip';
import { useHover } from '@react-aria/interactions';
import { NavLink } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { MimeType } from 'remix-image';
import { tv } from 'tailwind-variants';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import Image from '~/components/elements/Image';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '~/components/elements/NavigationMenu';
import Anime from '~/assets/icons/AnimeIcon';
import CategoryIcon from '~/assets/icons/CategoryIcon';
import Discover from '~/assets/icons/DiscoverIcon';
import History from '~/assets/icons/HistoryIcon';
import Home from '~/assets/icons/HomeIcon';
import Menu from '~/assets/icons/MenuIcon';
import Movie from '~/assets/icons/MovieIcon';
import Search from '~/assets/icons/SearchIcon';
import Settings from '~/assets/icons/SettingsIcon';
import TrendingUp from '~/assets/icons/TrendingUpIcon';
import Tv from '~/assets/icons/TvIcon';
import TwoUsers from '~/assets/icons/TwoUsersIcon';
import Logo from '~/assets/images/logo_loading.png';

export const handle = {
  i18n: 'left-drawer',
};

const sidebarStyles = tv({
  base: 'fixed z-[1999] box-border hidden shrink-0 grow-0 transition-[max-width] duration-400 sm:block',
  variants: {
    sidebarMiniMode: {
      true: 'w-full max-w-[80px] basis-[80px]',
      false: 'w-full max-w-[250px] basis-[250px]',
    },
    sidebarBoxedMode: {
      true: 'left-[15px] top-[15px] h-[calc(100vh_-_30px)] rounded-xl bg-background/60',
      false: 'left-0 top-0 h-screen',
    },
    sidebarHoverMode: {
      true: 'w-full max-w-[250px] basis-[250px] rounded-r-xl border border-default-200 bg-background shadow-2xl',
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

const viewportPositionStyles = tv({
  base: '!fixed',
  variants: {
    sidebarMiniMode: {
      true: '!left-[85px]',
    },
    sidebarHoverMode: {
      true: '!left-[250px]',
    },
    sidebarBoxedMode: {
      true: '!left-[265px]',
    },
  },
  compoundVariants: [
    {
      sidebarMiniMode: true,
      sidebarHoverMode: true,
      sidebarBoxedMode: false,
      class: '!left-[250px]',
    },
    {
      sidebarMiniMode: true,
      sidebarHoverMode: false,
      sidebarBoxedMode: true,
      class: '!left-[100px]',
    },
    {
      sidebarMiniMode: false,
      sidebarHoverMode: false,
      sidebarBoxedMode: false,
      class: '!left-[250px]',
    },
  ],
  defaultVariants: {
    sidebarMiniMode: false,
    sidebarHoverMode: false,
    sidebarBoxedMode: false,
  },
});

const navigationPartStyles = tv({
  base: 'w-full overflow-x-visible overflow-y-scroll scrollbar-hide',
  variants: {
    sidebarBoxedMode: {
      true: 'h-[calc(100%_-_100px)]',
      false: 'h-[calc(100%_-_80px)]',
    },
  },
  defaultVariants: {
    sidebarBoxedMode: false,
  },
});

const SideBar = () => {
  const { t } = useTranslation('sidebar');
  const { sidebarMiniMode, sidebarHoverMode, sidebarBoxedMode } = useSoraSettings();
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
      <div className="mb-3 ml-4 flex h-[65px] w-full flex-row items-center justify-start">
        <Button
          className={`${
            sidebarMiniMode.value && !isHovered ? 'basis-[50px]' : 'basis-[60px]'
          } flex shrink-0 grow-0 justify-center`}
          isIconOnly
          variant="light"
          onPress={() => {
            sidebarMiniMode.set(!sidebarMiniMode.value);
          }}
        >
          <Menu />
        </Button>
        {sidebarMiniMode.value && !isHovered ? null : (
          <div className="flex items-center gap-x-3">
            <Image
              width="30px"
              height="30px"
              radius="full"
              alt="Logo"
              src={Logo}
              placeholder="empty"
              responsive={[
                {
                  size: {
                    width: 30,
                    height: 30,
                  },
                },
              ]}
              loaderUrl="/api/image"
              dprVariants={[1, 3]}
              options={{
                contentType: MimeType.WEBP,
              }}
            />
            <NavLink
              to="/"
              arial-label="home-page"
              className="bg-gradient-to-tr from-secondary to-primary to-50% bg-clip-text text-3xl font-bold tracking-normal text-transparent md:text-4xl"
            >
              SORA
            </NavLink>
          </div>
        )}
      </div>
      <div
        className={navigationPartStyles({
          sidebarBoxedMode: sidebarBoxedMode.value,
        })}
      >
        <NavigationMenu
          orientation="vertical"
          viewportPositionClassName={viewportPositionStyles({
            sidebarMiniMode: sidebarMiniMode.value,
            sidebarHoverMode: sidebarHoverMode.value,
            sidebarBoxedMode: sidebarBoxedMode.value,
          })}
        >
          <NavigationMenuList className="m-0 gap-3 [&_.active]:bg-default [&_.active]:text-default-foreground">
            <NavigationMenuItem
              className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
              value="home"
            >
              <Tooltip
                content={t('home')}
                isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
                placement="right"
                offset={10}
                showArrow
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
                        {!sidebarMiniMode.value || (sidebarHoverMode && isHovered)
                          ? t('home')
                          : null}
                        <Spinner
                          size="sm"
                          classNames={{
                            base:
                              isPending &&
                              (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                                ? 'ml-auto'
                                : '!hidden',
                            circle1: 'border-b-default-foreground',
                            circle2: 'border-b-default-foreground',
                          }}
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
                content={t('trending')}
                isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
                placement="right"
                showArrow
                offset={10}
              >
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/trending/today"
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
                        <Spinner
                          size="sm"
                          classNames={{
                            base:
                              isPending &&
                              (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                                ? 'ml-auto'
                                : '!hidden',
                            circle1: 'border-b-default-foreground',
                            circle2: 'border-b-default-foreground',
                          }}
                        />
                      </>
                    )}
                  </NavLink>
                </NavigationMenuLink>
              </Tooltip>
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
              value="discover"
            >
              <Tooltip
                content={t('discover')}
                isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
                placement="right"
                showArrow
                offset={10}
              >
                <NavigationMenuLink asChild>
                  <NavLink
                    to="/discover"
                    className={navigationMenuTriggerStyle({
                      class: `${navigationItemWidthStyle} h-[56px] justify-start transition-[width] duration-200`,
                    })}
                  >
                    {({ isActive, isPending }) => (
                      <>
                        <Discover
                          className={
                            !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                          }
                          filled={isActive}
                        />
                        {!sidebarMiniMode.value || (sidebarHoverMode && isHovered)
                          ? t('discover')
                          : null}
                        <Spinner
                          size="sm"
                          classNames={{
                            base:
                              isPending &&
                              (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                                ? 'ml-auto'
                                : '!hidden',
                            circle1: 'border-b-default-foreground',
                            circle2: 'border-b-default-foreground',
                          }}
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
                  className={
                    !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                  }
                />
                {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('search') : null}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="m-0 flex w-fit flex-row gap-x-[6px] p-[6px]">
                  <li className="m-0 flex flex-col justify-between gap-y-[6px] [&_.active]:bg-content1 [&_.active]:text-content1-foreground">
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/search/movie"
                        className={navigationMenuTriggerStyle({
                          class:
                            'flex h-auto w-[215px] flex-row items-center justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <Search className="mr-2 h-5 w-5" filled={isActive} />
                            {t('search-movies')}
                            <Spinner
                              size="sm"
                              classNames={{
                                base: isPending ? 'ml-auto' : '!hidden',
                                circle1: 'border-b-default-foreground',
                                circle2: 'border-b-default-foreground',
                              }}
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
                            'flex h-auto w-[215px] flex-row items-center justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <Search className="mr-2 h-5 w-5" filled={isActive} />
                            {t('search-tv-shows')}
                            <Spinner
                              size="sm"
                              classNames={{
                                base: isPending ? 'ml-auto' : '!hidden',
                                circle1: 'border-b-default-foreground',
                                circle2: 'border-b-default-foreground',
                              }}
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
                            'flex h-auto  w-[215px] flex-row items-center justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <Search className="mr-2 h-5 w-5" filled={isActive} />
                            {t('search-anime')}
                            <Spinner
                              size="sm"
                              classNames={{
                                base: isPending ? 'ml-auto' : '!hidden',
                                circle1: 'border-b-default-foreground',
                                circle2: 'border-b-default-foreground',
                              }}
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
                            'flex h-auto w-[215px] flex-row items-center justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <Search className="mr-2 h-5 w-5" filled={isActive} />
                            {t('search-people')}
                            <Spinner
                              size="sm"
                              classNames={{
                                base: isPending ? 'ml-auto' : '!hidden',
                                circle1: 'border-b-default-foreground',
                                circle2: 'border-b-default-foreground',
                              }}
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
                  className={
                    !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                  }
                />
                {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('movies') : null}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="m-0 flex w-fit flex-row gap-x-[6px] p-[6px]">
                  <li className="m-0 shrink-0 grow-0 basis-[215px]">
                    <Link
                      as={NavLink}
                      className="absolute top-4 z-20 mx-[10px] w-[198px] justify-between text-white after:rounded-md hover:after:bg-white/10"
                      isBlock
                      showAnchorIcon
                      color="foreground"
                      to="/discover/movies"
                    >
                      {t('movies-discover')}
                    </Link>
                    <Card
                      as={NavLink}
                      radius="md"
                      isPressable
                      isFooterBlurred
                      classNames={{
                        base: 'w-full border-default-200',
                      }}
                      to="/movies"
                      role="link"
                    >
                      <CardBody className="aspect-[2/3] w-full p-0">
                        <Image
                          radius="md"
                          width="215px"
                          height="auto"
                          style={{
                            aspectRatio: '2/3',
                            filter: 'brightness(0.8)',
                          }}
                          classNames={{
                            wrapper: 'min-w-[215px]',
                          }}
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
                      </CardBody>
                      <CardFooter className="absolute bottom-0 z-[10] justify-start bg-default/60 backdrop-blur-sm">
                        <h4 className="text-default-foreground">{t('movies-footer')}</h4>
                      </CardFooter>
                    </Card>
                  </li>
                  <li className="m-0 flex min-w-[215px] flex-col justify-between gap-y-[6px] [&_.active]:bg-content1 [&_.active]:text-content1-foreground">
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/movies/popular"
                        className={navigationMenuTriggerStyle({
                          class:
                            'flex h-auto w-[215px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('movies-popular')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
                              {t('movies-popular-subtitle')}
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
                            'flex h-auto w-[215px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('movies-now-playing')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
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
                            'flex h-auto w-[215px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('movies-upcoming')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
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
                            'flex h-auto w-[215px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('movies-top-rated')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
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
                  className={
                    !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                  }
                />
                {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('tv-shows') : null}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="m-0 flex w-fit flex-row gap-x-[6px] p-[6px]">
                  <li className="m-0 shrink-0 grow-0 basis-[215px]">
                    <Link
                      as={NavLink}
                      className="absolute top-4 z-20 mx-[10px] w-[198px] justify-between text-white after:rounded-md hover:after:bg-white/10"
                      isBlock
                      showAnchorIcon
                      color="foreground"
                      to="/discover/tv-shows"
                    >
                      {t('tv-shows-discover')}
                    </Link>
                    <Card
                      as={NavLink}
                      role="link"
                      to="/tv-shows"
                      radius="md"
                      isPressable
                      isFooterBlurred
                      classNames={{
                        base: 'w-full border-default-200',
                      }}
                    >
                      <CardBody className="aspect-[2/3] w-full p-0">
                        <Image
                          radius="md"
                          width="215px"
                          height="auto"
                          style={{
                            aspectRatio: '2/3',
                            filter: 'brightness(0.8)',
                          }}
                          classNames={{
                            wrapper: 'min-w-[215px]',
                          }}
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
                      </CardBody>
                      <CardFooter className="absolute bottom-0 z-[10] justify-start bg-default/60 backdrop-blur-sm">
                        <h4 className="text-default-foreground">{t('tv-shows-footer')}</h4>
                      </CardFooter>
                    </Card>
                  </li>
                  <li className="m-0 flex min-w-[215px] flex-col justify-between gap-y-[6px] [&_.active]:bg-content1 [&_.active]:text-content1-foreground">
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/tv-shows/popular"
                        className={navigationMenuTriggerStyle({
                          class:
                            'flex h-auto w-[225px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('tv-shows-popular')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
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
                            'flex h-auto w-[225px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('tv-shows-airing-today')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
                              {t('tv-shows-airing-today-subtitle')}
                            </p>
                          </>
                        )}
                      </NavLink>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/tv-shows/on-the-air"
                        className={navigationMenuTriggerStyle({
                          class:
                            'flex h-auto w-[225px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('tv-shows-on-the-air')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
                              {t('tv-shows-on-the-air-subtitle')}
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
                            'flex h-auto w-[225px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('tv-shows-top-rated')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
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
                  className={
                    !sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? 'mr-4' : ''
                  }
                />
                {!sidebarMiniMode.value || (sidebarHoverMode && isHovered) ? t('anime') : null}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="m-0 flex w-fit flex-row gap-x-[6px] p-[6px]">
                  <li className="m-0 shrink-0 grow-0 basis-[215px]">
                    <Link
                      as={NavLink}
                      className="absolute top-4 z-20 mx-[10px] w-[198px] justify-between text-white after:rounded-md hover:after:bg-white/10"
                      isBlock
                      showAnchorIcon
                      color="foreground"
                      to="/discover/anime"
                    >
                      {t('anime-discover')}
                    </Link>
                    <Card
                      as={NavLink}
                      role="link"
                      to="/anime"
                      radius="md"
                      isPressable
                      isFooterBlurred
                      classNames={{
                        base: 'w-full border-default-200',
                      }}
                    >
                      <CardBody className="aspect-[2/3] w-full p-0">
                        <Image
                          radius="md"
                          width="215px"
                          height="auto"
                          style={{
                            aspectRatio: '2/3',
                            filter: 'brightness(0.8)',
                          }}
                          classNames={{
                            wrapper: 'min-w-[215px]',
                          }}
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
                      </CardBody>
                      <CardFooter className="absolute bottom-0 z-[10] justify-start bg-default/60 backdrop-blur-sm">
                        <h4 className="text-default-foreground">{t('anime-footer')}</h4>
                      </CardFooter>
                    </Card>
                  </li>
                  <li className="m-0 flex min-w-[215px] flex-col justify-between gap-y-[6px] [&_.active]:bg-content1 [&_.active]:text-content1-foreground">
                    <NavigationMenuLink asChild>
                      <NavLink
                        to="/anime/popular"
                        className={navigationMenuTriggerStyle({
                          class:
                            'flex h-auto w-[225px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('anime-popular')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
                              {t('anime-popular-subtitle')}
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
                            'flex h-auto w-[225px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('anime-trending')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
                              {t('anime-trending-subtitle')}
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
                            'flex h-auto w-[225px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isActive, isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" filled={isActive} />
                              {t('anime-recent-episodes')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
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
                            'flex h-auto w-[225px] flex-col justify-start px-2 hover:bg-background/[0.6] focus:bg-background/[0.6]',
                        })}
                      >
                        {({ isPending }) => (
                          <>
                            <div className="mb-2 flex w-full flex-row items-center justify-start">
                              <Discover className="mr-2 h-5 w-5" />
                              {t('anime-random')}
                              <Spinner
                                size="sm"
                                classNames={{
                                  base: isPending ? 'ml-auto' : '!hidden',
                                  circle1: 'border-b-default-foreground',
                                  circle2: 'border-b-default-foreground',
                                }}
                              />
                            </div>
                            <p className="w-full text-xs text-foreground">
                              {t('anime-random-subtitle')}
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
              value="collections"
            >
              <Tooltip
                content={t('collections')}
                isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
                placement="right"
                showArrow
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
                        <Spinner
                          size="sm"
                          classNames={{
                            base:
                              isPending &&
                              (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                                ? 'ml-auto'
                                : '!hidden',
                            circle1: 'border-b-default-foreground',
                            circle2: 'border-b-default-foreground',
                          }}
                        />
                      </>
                    )}
                  </NavLink>
                </NavigationMenuLink>
              </Tooltip>
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
              value="people"
            >
              <Tooltip
                content={t('people')}
                isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
                placement="right"
                showArrow
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
                        <Spinner
                          size="sm"
                          classNames={{
                            base:
                              isPending &&
                              (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                                ? 'ml-auto'
                                : '!hidden',
                            circle1: 'border-b-default-foreground',
                            circle2: 'border-b-default-foreground',
                          }}
                        />
                      </>
                    )}
                  </NavLink>
                </NavigationMenuLink>
              </Tooltip>
            </NavigationMenuItem>
            <NavigationMenuItem
              className={`${navigationItemWidthStyle} text-left transition-[width] duration-200`}
              value="history"
            >
              <Tooltip
                content={t('history')}
                isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
                placement="right"
                showArrow
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
                        <Spinner
                          size="sm"
                          classNames={{
                            base:
                              isPending &&
                              (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                                ? 'ml-auto'
                                : '!hidden',
                            circle1: 'border-b-default-foreground',
                            circle2: 'border-b-default-foreground',
                          }}
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
                content={t('settings')}
                isDisabled={!sidebarMiniMode.value || (sidebarHoverMode && isHovered)}
                placement="right"
                showArrow
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
                        <Spinner
                          size="sm"
                          classNames={{
                            base:
                              isPending &&
                              (!sidebarMiniMode.value || (sidebarHoverMode && isHovered))
                                ? 'ml-auto'
                                : '!hidden',
                            circle1: 'border-b-default-foreground',
                            circle2: 'border-b-default-foreground',
                          }}
                        />
                      </>
                    )}
                  </NavLink>
                </NavigationMenuLink>
              </Tooltip>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </aside>
  );
};

export default SideBar;
