import { Button } from '@nextui-org/button';
import { useNavigate } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import { motion, useTransform } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
import { tv } from 'tailwind-variants';

import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayout } from '~/store/layout/useLayout';
import { useHeaderOptions } from '~/hooks/useHeader';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import MultiLevelDropdown from '~/components/layouts/MultiLevelDropdown';
import ListViewChangeButton from '~/components/elements/shared/ListViewChangeButton';
// import MenuIcon from '~/assets/icons/MenuIcon';
import ChevronLeft from '~/assets/icons/ChevronLeftIcon';
import ChevronRight from '~/assets/icons/ChevronRightIcon';

interface IHeaderProps {
  // open: boolean;
  user?: User;
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handle = {
  i18n: 'header',
};

const headerStyles = tv({
  base: 'fixed z-[1000] hidden h-[64px] w-[100vw] flex-row items-center justify-between gap-x-4 rounded-tl-xl py-3 px-5 sm:flex',
  variants: {
    miniSidebar: {
      true: 'top-0 sm:w-[calc(100vw_-_80px)]',
    },
    boxedSidebar: {
      true: 'top-[15px] sm:w-[calc(100vw_-_280px)]',
    },
  },
  compoundVariants: [
    {
      miniSidebar: true,
      boxedSidebar: true,
      class: 'top-[15px] sm:w-[calc(100vw_-_110px)]',
    },
    {
      miniSidebar: false,
      boxedSidebar: false,
      class: 'top-0 sm:w-[calc(100vw_-_250px)]',
    },
  ],
  defaultVariants: {
    miniSidebar: false,
    boxedSidebar: false,
  },
});

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  // const { t } = useTranslation('header');
  const { user } = props;
  const navigate = useNavigate();
  const { sidebarMiniMode, sidebarBoxedMode } = useSoraSettings();
  const { scrollY } = useLayout((state) => state);
  const { startChangeScrollPosition } = useHeaderStyle((state) => state);
  const {
    currentMiniTitle,
    customHeaderBackgroundColor,
    customHeaderChangeColorOnScroll,
    headerBackgroundColor,
    hideTabLinkWithLocation,
    isShowListViewChangeButton,
    isShowTabLink,
  } = useHeaderOptions();
  const { historyBack, historyForward } = useHistoryStack((state) => state);
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
  const handleNavigationBackForward = (direction: 'back' | 'forward') => {
    if (direction === 'back') {
      navigate(-1);
    } else if (direction === 'forward') {
      navigate(1);
    }
  };

  return (
    <div
      className={headerStyles({
        miniSidebar: sidebarMiniMode.value,
        boxedSidebar: sidebarBoxedMode.value,
      })}
    >
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-[-1] w-full rounded-tl-xl backdrop-blur-md"
        style={{
          opacity,
          height: isShowTabLink && !hideTabLinkWithLocation ? 112 : 64,
          backgroundColor: headerBackgroundColor,
        }}
      >
        {customHeaderBackgroundColor ? (
          <div className="pointer-events-none h-full w-full bg-background/[0.2]" />
        ) : null}
      </motion.div>
      <div className="flex flex-row items-center justify-center gap-x-2">
        <Button
          variant="faded"
          radius="full"
          isIconOnly
          onPress={() => handleNavigationBackForward('back')}
          isDisabled={historyBack.length <= 1}
          className="h-9 w-9"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="faded"
          radius="full"
          isIconOnly
          onPress={() => handleNavigationBackForward('forward')}
          isDisabled={historyForward.length <= 1}
          className="h-9 w-9"
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        {currentMiniTitle ? (
          <motion.div
            style={{ opacity, y }}
            transition={{ duration: 0.3 }}
            className="flex flex-row items-center justify-start gap-x-3"
          >
            {currentMiniTitle.showImage ? (
              <img
                src={currentMiniTitle.imageUrl}
                alt={`${currentMiniTitle.title} mini`}
                width={36}
                height={54}
                loading="lazy"
                className="rounded-md"
              />
            ) : null}
            <div className="flex flex-col items-start justify-center">
              <span className="text-2xl font-bold">{currentMiniTitle.title}</span>
              {currentMiniTitle.subtitle ? (
                <span className="text-sm font-medium opacity-75">{currentMiniTitle.subtitle}</span>
              ) : null}
            </div>
          </motion.div>
        ) : null}
        {isShowListViewChangeButton ? (
          <motion.div
            style={{ opacity, y }}
            transition={{ duration: 0.3 }}
            className="flex flex-row items-center justify-end gap-x-3"
          >
            {isShowListViewChangeButton ? <ListViewChangeButton /> : null}
          </motion.div>
        ) : null}
      </div>
      <MultiLevelDropdown user={user} />
    </div>
  );
};

export default Header;
