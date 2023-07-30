import type { User } from '@supabase/supabase-js';
import { motion, useTransform } from 'framer-motion';
import { useHydrated } from 'remix-utils';
import { tv } from 'tailwind-variants';

import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useLayout } from '~/store/layout/useLayout';
import { useHeaderOptions } from '~/hooks/useHeader';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import MultiLevelDropdown from '~/components/layouts/MultiLevelDropdown';
import ListViewChangeButton from '~/components/elements/shared/ListViewChangeButton';

import ControlNavigation from './ControlNavigation';

interface IHeaderProps {
  user?: User;
}

const headerStyles = tv({
  base: 'fixed z-[1000] hidden h-[64px] w-[100vw] flex-row items-center justify-between gap-x-4 rounded-tl-large px-5 py-3 sm:flex',
  variants: {
    miniSidebar: {
      true: 'top-0 sm:w-[calc(100vw_-_80px)]',
    },
    boxedSidebar: {
      true: 'top-[15px] sm:w-[calc(100vw_-_280px)]',
    },
    hideSidebar: {
      true: 'top-0 sm:w-[100vw]',
    },
  },
  compoundVariants: [
    {
      miniSidebar: true,
      boxedSidebar: true,
      hideSidebar: false,
      class: 'top-[15px] sm:w-[calc(100vw_-_110px)]',
    },
    {
      miniSidebar: false,
      boxedSidebar: false,
      hideSidebar: false,
      class: 'top-0 sm:w-[calc(100vw_-_250px)]',
    },
    {
      boxedSidebar: true,
      hideSidebar: true,
      class: 'top-[15px] sm:w-[calc(100vw_-_15px)]',
    },
  ],
  defaultVariants: {
    miniSidebar: false,
    boxedSidebar: false,
    hideSidebar: false,
  },
});

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { user } = props;
  const { sidebarMiniMode, sidebarBoxedMode } = useSoraSettings();
  const { scrollY } = useLayout((state) => state);
  const { startChangeScrollPosition } = useHeaderStyle((state) => state);
  const isHydrated = useHydrated();
  const {
    customHeaderBackgroundColor,
    customHeaderChangeColorOnScroll,
    headerBackgroundColor,
    hideTabLinkWithLocation,
    isShowListViewChangeButton,
    isShowTabLink,
    isHideSidebar,
  } = useHeaderOptions();
  const opacity = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 80],
    [0, 0, customHeaderChangeColorOnScroll ? (startChangeScrollPosition ? 1 : 0) : 1],
  );
  const y = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 80],
    [60, 60, customHeaderChangeColorOnScroll ? (startChangeScrollPosition ? 0 : 60) : 0],
  );

  return (
    <div
      className={headerStyles({
        miniSidebar: sidebarMiniMode.value,
        boxedSidebar: sidebarBoxedMode.value,
        hideSidebar: isHideSidebar,
      })}
    >
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-[-1] w-full rounded-tl-medium backdrop-blur-2xl backdrop-contrast-125 backdrop-saturate-200"
        style={{
          opacity: isHydrated ? opacity : 0,
          height: isShowTabLink && !hideTabLinkWithLocation ? 112 : 64,
          backgroundColor: headerBackgroundColor,
        }}
      >
        {customHeaderBackgroundColor ? (
          <div className="pointer-events-none h-full w-full bg-background/[0.2]" />
        ) : null}
      </motion.div>
      <ControlNavigation />
      <div className="flex flex-row items-center justify-end gap-x-2">
        {isShowListViewChangeButton ? (
          <motion.div
            style={{ opacity: isHydrated ? opacity : 0, y }}
            transition={{ duration: 0.3 }}
            className="flex flex-row items-center justify-end gap-x-3"
          >
            {isShowListViewChangeButton ? <ListViewChangeButton /> : null}
          </motion.div>
        ) : null}
        <MultiLevelDropdown user={user} />
      </div>
    </div>
  );
};

export default Header;
