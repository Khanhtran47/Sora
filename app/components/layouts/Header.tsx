/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
  Button,
  // Tooltip,
  Popover,
} from '@nextui-org/react';
import { useNavigate, useLocation, useNavigationType } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import type { AnimationItem } from 'lottie-web';
// import { useTranslation } from 'react-i18next';
import { tv } from 'tailwind-variants';
// import { useMediaQuery } from '@react-hookz/web';

import { useSoraSettings } from '~/hooks/useLocalStorage';

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
  const location = useLocation();
  const navigationType = useNavigationType();
  const {
    sidebarMiniMode,
    sidebarBoxedMode,
    // sidebarSheetMode
  } = useSoraSettings();
  const [historyBack, setHistoryBack] = useState<string[]>([]);
  const [historyForward, setHistoryForward] = useState<string[]>([]);

  const handleNavigationBackForward = (direction: 'back' | 'forward') => {
    if (direction === 'back') {
      navigate(-1);
      setHistoryBack((prev) => [...prev.slice(0, prev.length - 1)]);
      setHistoryForward((prev) =>
        historyBack.length > 0 ? [...prev, historyBack[historyBack.length - 1]] : [...prev],
      );
    } else if (direction === 'forward') {
      navigate(1);
      setHistoryForward((prev) => [...prev.slice(0, prev.length - 1)]);
      setHistoryBack((prev) =>
        historyForward.length > 0
          ? [...prev, historyForward[historyForward.length - 1]]
          : [...prev],
      );
    }
  };

  useEffect(() => {
    if (navigationType === 'PUSH') {
      setHistoryBack((prev) => [...prev, location.pathname]);
      setHistoryForward((prev) => [...prev.slice(0, prev.length - 1)]);
    } else if (navigationType === 'REPLACE') {
      setHistoryBack((prev) => [...prev.slice(0, prev.length - 1), location.pathname]);
      setHistoryForward((prev) => [...prev.slice(0, prev.length - 1)]);
    }
  }, [location.key, navigationType]);

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
      <div className="flex flex-row justify-center items-center gap-x-2">
        <Button
          auto
          flat
          rounded
          icon={<ChevronLeft />}
          onPress={() => handleNavigationBackForward('back')}
          disabled={historyBack.length === 0}
        />
        <Button
          auto
          flat
          rounded
          icon={<ChevronRight />}
          onPress={() => handleNavigationBackForward('forward')}
          disabled={historyForward.length === 0}
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
            css={{ padding: 0, width: 40 }}
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
