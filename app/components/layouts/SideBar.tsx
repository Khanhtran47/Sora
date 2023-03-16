/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import { NavLink } from '@remix-run/react';
import { Spacer, Grid, Row, Button, Tooltip, Loading } from '@nextui-org/react';
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

interface ILeftDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handle = {
  i18n: 'left-drawer',
};

const iconItem = (index: number, filled: boolean) => {
  let icon;
  switch (index) {
    case 0:
      icon = <TrendingUp filled={filled} />;
      break;
    case 1:
      icon = <TwoUsers filled={filled} />;
      break;
    case 2:
      icon = <CategoryIcon filled={filled} />;
      break;
    case 3:
      icon = <Library filled={filled} />;
      break;
    case 4:
      icon = <History filled={filled} />;
      break;
    case 5:
      icon = <Settings filled={filled} />;
      break;
    default:
  }
  return icon;
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
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { open, setOpen } = props;

  /**
   * If the drawer is open and the user clicks outside of the drawer, close the drawer.
   * @param {any} event - any - this is the event that is triggered when the user clicks outside of the
   * drawer.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = (event: any) => {
    if (open && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  /* Adding an event listener to the document for handling click outside drawer */
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return (
    // <Drawer
    //   css={{
    //     backgroundColor: '$backgroundContrast',
    //     ...(open && {
    //       ...openedMixin(),
    //     }),
    //     ...(!open && {
    //       ...closedMixin(),
    //     }),
    //     paddingLeft: 0,
    //     paddingRight: 0,
    //   }}
    //   as="nav"
    //   ref={wrapperRef}
    // >
    //   <Row justify="flex-start" align="center" css={{ height: '65px' }}>
    //     <Button
    //       type="button"
    //       light
    //       auto
    //       aria-label="Menu Icon"
    //       icon={open ? <Arrow direction="left" /> : <MenuIcon />}
    //       onPress={() => setOpen(!open)}
    //       css={{
    //         marginLeft: 12.5,
    //         marginRight: open ? 10 : 0,
    //         transition: 'all 0.3s ease',
    //       }}
    //     />
    //     {open ? <NavLink linkTo="/" isLogo /> : null}
    //   </Row>
    //   <Row>
    //     <Grid.Container>
    //       {leftDrawerPages.map((page, index: number) => (
    //         <Grid key={page.pageName} css={{ marginTop: '10px' }} xs={12}>
    //           <Tooltip
    //             content={open ? null : t(page.pageName)}
    //             isDisabled={isMobile}
    //             placement="right"
    //             color="primary"
    //             offset={10}
    //             hideArrow={open}
    //           >
    //             <RemixNavLink
    //               to={`/${page.pageLink}`}
    //               className="flex flex-row"
    //               onClick={() => setOpen(false)}
    //               style={{
    //                 display: 'block',
    //                 minHeight: 65,
    //                 minWidth: 65,
    //                 justifyContent: open ? 'initial' : 'center',
    //                 alignItems: 'center',
    //               }}
    //               aria-label={page.pageName}
    //             >
    //               {({ isActive }) => (
    //                 <AnimatePresence>
    //                   <H5
    //                     h5
    //                     color="primary"
    //                     css={{
    //                       margin: 0,
    //                       display: 'flex',
    //                       minHeight: 65,
    //                       minWidth: 65,
    //                       alignItems: 'center',
    //                       justifyContent: 'flex-start',
    //                       borderRadius: '14px',
    //                       transition: 'opacity 0.25s ease 0s, background 0.25s ease 0s',
    //                       '&:hover': {
    //                         opacity: '0.8',
    //                         backgroundColor: '$primaryLightHover',
    //                       },
    //                       ...(open && {
    //                         width: drawerWidth,
    //                       }),
    //                       ...(isActive && {
    //                         background: '$primaryLightActive',
    //                       }),
    //                       paddingLeft: 20,
    //                     }}
    //                   >
    //                     {isActive ? iconItem(index, true) : iconItem(index, false)}
    //                     {open && (
    //                       <>
    //                         <Spacer />
    //                         <motion.div
    //                           initial={{ opacity: 0, x: '-20%' }}
    //                           animate={{ opacity: 1, x: '0' }}
    //                           exit={{ opacity: 0, x: '-20%' }}
    //                           transition={{ duration: 0.225, ease: 'easeOut' }}
    //                         >
    //                           {t(page.pageName)}
    //                         </motion.div>
    //                       </>
    //                     )}
    //                   </H5>
    //                 </AnimatePresence>
    //               )}
    //             </RemixNavLink>
    //           </Tooltip>
    //         </Grid>
    //       ))}
    //     </Grid.Container>
    //   </Row>
    // </Drawer>
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
        <NavigationMenuList orientation="vertical" className="m-0">
          <NavigationMenuItem className="w-[215px] text-left">
            <NavLink to="/">
              {({ isActive, isPending }) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    class: 'w-[215px] h-[50px] justify-start',
                    active: isActive,
                  })}
                >
                  <Home className="mr-4" />
                  Home
                  <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                </NavigationMenuLink>
              )}
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left">
            <NavLink to="/trending">
              {({ isActive, isPending }) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    class: 'w-[215px] h-[50px] justify-start',
                    active: isActive,
                  })}
                >
                  <TrendingUp className="mr-4" />
                  Trending
                  <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                </NavigationMenuLink>
              )}
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left">
            <NavLink to="/search">
              {({ isActive, isPending }) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    class: 'w-[215px] h-[50px] justify-start',
                    active: isActive,
                  })}
                >
                  <Search className="mr-4" />
                  Search
                  <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                </NavigationMenuLink>
              )}
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={sidebarActiveStyles()}>
              <TrendingUp className="mr-4" />
              Movies
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-0">
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={sidebarActiveStyles()}>
              <Settings className="mr-4" />
              Tv Shows
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                <li>
                  <NavigationMenuLink>LinkLinkLinkLinkLink</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={sidebarActiveStyles()}>
              <Library className="mr-4" />
              Anime
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul>
                <li>
                  <NavigationMenuLink>LinkLinkLink</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink>Link</NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left">
            <NavLink to="/people">
              {({ isActive, isPending }) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    class: 'w-[215px] h-[50px] justify-start',
                    active: isActive,
                  })}
                >
                  <TwoUsers className="mr-4" />
                  People
                  <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                </NavigationMenuLink>
              )}
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left">
            <NavLink to="/collections">
              {({ isActive, isPending }) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    class: 'w-[215px] h-[50px] justify-start',
                    active: isActive,
                  })}
                >
                  <CategoryIcon className="mr-4" />
                  Collections
                  <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                </NavigationMenuLink>
              )}
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left">
            <NavLink to="/list">
              {({ isActive, isPending }) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    class: 'w-[215px] h-[50px] justify-start',
                    active: isActive,
                  })}
                >
                  <Library className="mr-4" />
                  My List
                  <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                </NavigationMenuLink>
              )}
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left">
            <NavLink to="/watch-history">
              {({ isActive, isPending }) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    class: 'w-[215px] h-[50px] justify-start',
                    active: isActive,
                  })}
                >
                  <History className="mr-4" />
                  History
                  <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                </NavigationMenuLink>
              )}
            </NavLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-[215px] text-left">
            <NavLink to="/settings">
              {({ isActive, isPending }) => (
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    class: 'w-[215px] h-[50px] justify-start',
                    active: isActive,
                  })}
                >
                  <Settings className="mr-4" />
                  Settings
                  <Loading className={isPending ? 'ml-auto' : '!hidden'} type="points-opacity" />
                </NavigationMenuLink>
              )}
            </NavLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};

export default SideBar;
