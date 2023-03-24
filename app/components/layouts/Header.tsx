/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Button,
  // Tooltip,
  Popover,
} from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import type { AnimationItem } from 'lottie-web';
// import { useTranslation } from 'react-i18next';
import { tv } from 'tailwind-variants';
// import { useMediaQuery } from '@react-hookz/web';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useLayoutScrollPosition } from '~/store/layout/useLayoutScrollPosition';
import { useHistoryStack } from '~/store/layout/useHistoryStack';

/* Components */
import MultiLevelDropdown from '~/components/layouts/MultiLevelDropdown';
import { PlayerStyled } from '~/components/layouts/Layout.styles';

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
  base: 'h-[64px] w-[100vw] fixed z-50 py-3 px-5 flex-row justify-between items-center hidden sm:flex',
  variants: {
    miniSidebar: {
      true: 'sm:w-[calc(100vw_-_80px)] top-0',
    },
    boxedSidebar: {
      true: 'sm:w-[calc(100vw_-_280px)] top-[15px]',
    },
  },
  compoundVariants: [
    {
      miniSidebar: true,
      boxedSidebar: true,
      class: 'sm:w-[calc(100vw_-_110px)] top-[15px]',
    },
    {
      miniSidebar: false,
      boxedSidebar: false,
      class: 'sm:w-[calc(100vw_-_250px)] top-0',
    },
  ],
  defaultVariants: {
    miniSidebar: false,
    boxedSidebar: false,
  },
});

const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  // const { t } = useTranslation('header');
  const {
    // open,
    user,
    // setOpen
  } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lottie, setLottie] = useState<AnimationItem>();
  const navigate = useNavigate();
  const {
    sidebarMiniMode,
    sidebarBoxedMode,
    // sidebarSheetMode
  } = useSoraSettings();
  const { scrollPosition } = useLayoutScrollPosition((state) => state);
  const { historyBack, historyForward } = useHistoryStack((state) => state);
  const handleNavigationBackForward = (direction: 'back' | 'forward') => {
    if (direction === 'back') {
      navigate(-1);
    } else if (direction === 'forward') {
      navigate(1);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      lottie?.playSegments([0, 50], true);
    } else {
      lottie?.playSegments([50, 96], true);
    }
  }, [isDropdownOpen]);

  return (
    <div
      className={headerStyles({
        miniSidebar: sidebarMiniMode.value,
        boxedSidebar: sidebarBoxedMode.value,
      })}
    >
      <div
        className="absolute top-0 left-0 w-full h-full z-[-1] bg-background-contrast-alpha backdrop-blur-md rounded-tl-xl"
        style={{ opacity: scrollPosition.y < 80 ? scrollPosition.y / 80 : 1 }}
      />
      <div className="flex flex-row justify-center items-center gap-x-2">
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
      <div />
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
            width: 240,
            zIndex: 999,
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
