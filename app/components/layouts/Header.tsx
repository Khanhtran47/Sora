import { useState, useEffect } from 'react';
import {
  Button,
  // Tooltip,
  Popover,
  styled,
} from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import type { AnimationItem } from 'lottie-web';
// import { useTranslation } from 'react-i18next';
import { tv } from 'tailwind-variants';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useHeaderOptions } from '~/hooks/useHeader';
import { useHistoryStack } from '~/store/layout/useHistoryStack';

/* Components */
import MultiLevelDropdown from '~/components/layouts/MultiLevelDropdown';

/* Assets */
// import MenuIcon from '~/assets/icons/MenuIcon';
import ChevronLeft from '~/assets/icons/ChevronLeftIcon';
import ChevronRight from '~/assets/icons/ChevronRightIcon';
import dropdown from '~/assets/lotties/lottieflow-dropdown-03-0072F5-easey.json';

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

const PlayerStyled = styled(Player, {
  '& path': {
    stroke: '$primary',
  },
});

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  // const { t } = useTranslation('header');
  const { user } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lottie, setLottie] = useState<AnimationItem>();
  const navigate = useNavigate();
  const { sidebarMiniMode, sidebarBoxedMode } = useSoraSettings();
  const {
    isShowTabLink,
    hideTabLinkWithLocation,
    customHeaderBackgroundColor,
    currentMiniTitle,
    headerBackgroundColor,
    headerBackgroundOpacity,
  } = useHeaderOptions();
  const { historyBack, historyForward } = useHistoryStack((state) => state);
  useEffect(() => {
    if (isDropdownOpen) {
      lottie?.playSegments([0, 50], true);
    } else {
      lottie?.playSegments([50, 96], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownOpen]);
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
      <div
        className="pointer-events-none absolute top-0 left-0 z-[-1] w-full rounded-tl-xl backdrop-blur-md"
        style={{
          opacity: headerBackgroundOpacity,
          height: isShowTabLink && !hideTabLinkWithLocation ? 112 : 64,
          backgroundColor: headerBackgroundColor,
        }}
      >
        {customHeaderBackgroundColor ? (
          <div className="pointer-events-none h-full w-full bg-background-light" />
        ) : null}
      </div>
      <div className="flex flex-row items-center justify-center gap-x-2">
        <Button
          auto
          flat
          rounded
          icon={<ChevronLeft />}
          onPress={() => handleNavigationBackForward('back')}
          disabled={historyBack.length <= 1}
          css={{ w: 36, h: 36 }}
        />
        <Button
          auto
          flat
          rounded
          icon={<ChevronRight />}
          onPress={() => handleNavigationBackForward('forward')}
          disabled={historyForward.length <= 1}
          css={{ w: 36, h: 36 }}
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        {currentMiniTitle ? (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: headerBackgroundOpacity, y: (1 - headerBackgroundOpacity) * 60 }}
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
            <span className="text-2xl font-bold">{currentMiniTitle.title}</span>
          </motion.div>
        ) : null}
      </div>
      <Popover
        shouldFlip
        triggerType="menu"
        placement="bottom-right"
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
      >
        <Popover.Trigger>
          <Button
            type="button"
            auto
            flat
            rounded
            aria-label="dropdown"
            css={{ padding: 0, w: 36, h: 36 }}
          >
            <PlayerStyled
              lottieRef={(instance) => {
                setLottie(instance);
              }}
              src={dropdown}
              autoplay={false}
              keepLastFrame
              speed={2.7}
              className="h-8 w-8"
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
            width: 240,
            zIndex: 2999,
            borderWidth: 0,
          }}
        >
          <MultiLevelDropdown user={user} />
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default Header;
