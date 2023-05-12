import { useEffect, useMemo, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Button } from '@nextui-org/button';
import { Avatar, Divider, Spacer, styled } from '@nextui-org/react';
import { useLocation, useNavigate, useSearchParams } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import type { AnimationItem } from 'lottie-web';
import { useTheme as useRemixTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import languages from '~/constants/languages';
import { listThemes } from '~/constants/settings';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/elements/Popover';
import ResizablePanel from '~/components/elements/shared/ResizablePanel';
import { H6 } from '~/components/styles/Text.styles';
import Arrow from '~/assets/icons/ArrowIcon';
import Brush from '~/assets/icons/BrushIcon';
import GlobalIcon from '~/assets/icons/GlobalIcon';
import Tick from '~/assets/icons/TickIcon';
import avatar from '~/assets/images/avatar.png';
import dropdown from '~/assets/lotties/lottieflow-dropdown-03-0072F5-easey.json';

interface IMultiLevelDropdownProps {
  user?: User | undefined;
}

const PlayerStyled = styled(Player, {
  '& path': {
    stroke: '$primary',
  },
});

const MultiLevelDropdown = (props: IMultiLevelDropdownProps) => {
  const { user } = props;
  const rootData = useTypedRouteLoaderData('root');
  const { locale } = rootData || { locale: 'en' };
  const { setTheme, theme: currentTheme } = useRemixTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [search] = useSearchParams();
  const [currentLevel, setCurrentLevel] = useState('general');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lottie, setLottie] = useState<AnimationItem>();
  const { t } = useTranslation('header');
  useEffect(() => {
    if (isDropdownOpen) {
      lottie?.playSegments([0, 50], true);
    } else {
      lottie?.playSegments([50, 96], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDropdownOpen]);

  const ref = (search.get('ref') || location.pathname + location.search)
    .replace('?', '_0x3F_')
    .replace('&', '_0x26');
  const parts = user?.email?.split('@');
  const username = parts?.shift();

  const dropdownLevel = useMemo(() => {
    return [
      {
        id: 'general',
        key: 'general',
        showTitle: true,
        showAvatar: true,
        showBackButton: false,
        backButtonAction: () => null,
        title: user ? username : 'Sign In',
        isTitleClickable: true,
        titleAction: () => (user ? null : navigate(`/sign-in?ref=${ref}`)),
        listItems: [
          {
            id: 'language',
            title: 'Language',
            description: 'Change the language of the website',
            showIcon: true,
            icon: <GlobalIcon />,
            action: () => setCurrentLevel('language'),
            currentValue: locale,
          },
          {
            id: 'display',
            title: 'Display',
            description: 'Change the display of the website',
            showIcon: true,
            icon: <Brush />,
            action: () => setCurrentLevel('display'),
            currentValue: currentTheme,
          },
          {
            id: 'sign-up-log-out',
            title: user ? 'Log Out' : 'Sign Up',
            description: user ? 'Log out of your account' : 'Sign up for an account',
            showIcon: false,
            icon: null,
            action: () => navigate(user ? `/sign-out?ref=${ref}` : `/sign-up?ref=${ref}`),
          },
        ],
      },
      {
        id: 'language',
        key: 'language',
        showTitle: true,
        showAvatar: false,
        showBackButton: true,
        backButtonAction: () => setCurrentLevel('general'),
        title: 'Language',
        isTitleClickable: false,
        titleAction: () => null,
        listItems: languages.map((language) => ({
          id: language,
          title: t(language),
          showIcon: false,
          icon: null,
          action: () => navigate(`${location.pathname}?lng=${language}`),
          currentValue: null,
          isCurrent: locale === language,
        })),
      },
      {
        id: 'display',
        key: 'display',
        showTitle: true,
        showAvatar: false,
        showBackButton: true,
        backButtonAction: () => setCurrentLevel('general'),
        title: 'Display',
        isTitleClickable: false,
        titleAction: () => null,
        listItems: listThemes.map((theme) => ({
          id: theme.id,
          title: t(theme.title),
          description: theme.title,
          showIcon: false,
          icon: null,
          action: () => setTheme(theme.id),
          currentValue: null,
          isCurrent: currentTheme === theme.id,
        })),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme, locale, user, username]);

  const currentDropdownLevel = useMemo(
    () => dropdownLevel.find((level) => level.id === currentLevel),
    [dropdownLevel, currentLevel],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settingsOptions = (item: any) => (
    <Button
      key={item.id}
      type="button"
      fullWidth
      variant="light"
      onPress={item.action}
      className="flex h-14 flex-row items-center justify-between gap-x-8 !p-2 data-[hover=true]:bg-neutral/[.6]"
    >
      <div className="flex shrink-0 grow flex-row items-center gap-x-2">
        {item?.showIcon ? (
          (
            item as {
              id: string;
              title: string;
              description: string;
              showIcon: boolean;
              icon: JSX.Element;
              action: () => void;
              currentValue: string;
            }
          )?.icon
        ) : (
            item as {
              id: string;
              title: string;
              showIcon: boolean;
              action: () => void;
              isCurrent: boolean;
            }
          )?.isCurrent ? (
          <Tick />
        ) : (
          <Spacer x={1.15} />
        )}
        <H6
          h6
          css={{ margin: 0 }}
          weight="semibold"
          className="!text-neutral-foreground !line-clamp-1"
        >
          {item.title}
        </H6>
      </div>
      <div className="flex shrink-0 grow flex-row items-center justify-end gap-x-2">
        <H6
          h6
          css={{ margin: 0, color: '$accents9' }}
          weight="thin"
          className="!text-neutral-foreground"
        >
          {(
            item as {
              id: string;
              title: string;
              description: string;
              showIcon: boolean;
              icon: JSX.Element;
              action: () => void;
              currentValue: string;
            }
          )?.currentValue || ''}
        </H6>
        {item.showIcon ? <Arrow direction="right" /> : null}
      </div>
    </Button>
  );

  const handleOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
    if (!open) setCurrentLevel('general');
  };

  return (
    <Popover open={isDropdownOpen} onOpenChange={(open) => handleOpenChange(open)}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="faded"
          radius="full"
          aria-label="dropdown"
          isIconOnly
          className="h-9 w-10"
        >
          <PlayerStyled
            lottieRef={(instance) => {
              setLottie(instance);
            }}
            src={dropdown}
            autoplay={false}
            keepLastFrame
            speed={2.7}
            className="h-6 w-6"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        alignOffset={-8}
        className="z-[1000] bg-neutral/60 backdrop-blur-xl backdrop-saturate-200"
      >
        <ResizablePanel contentWidth="fit">
          {currentDropdownLevel ? (
            <div className="flex w-full flex-col items-start justify-start gap-y-2">
              {currentDropdownLevel?.showBackButton ||
              currentDropdownLevel?.showAvatar ||
              currentDropdownLevel?.showTitle ? (
                <>
                  <Button
                    type="button"
                    isIconOnly
                    fullWidth
                    size="md"
                    variant="light"
                    onPress={
                      currentDropdownLevel?.isTitleClickable
                        ? currentDropdownLevel?.titleAction
                        : currentDropdownLevel?.backButtonAction
                    }
                    className="flex h-14 w-full flex-row items-center justify-center gap-x-2 p-2 data-[hover=true]:bg-neutral/[.6]"
                  >
                    {currentDropdownLevel?.showBackButton ? <Arrow direction="left" /> : null}
                    {currentDropdownLevel?.showAvatar ? (
                      <Avatar size="md" alt="Avatar" src={avatar} color="primary" bordered />
                    ) : null}
                    {currentDropdownLevel?.showTitle ? (
                      <H6
                        h6
                        css={{ margin: 0, px: '$6' }}
                        weight="semibold"
                        className="!text-neutral-foreground"
                      >
                        {currentDropdownLevel?.title}
                      </H6>
                    ) : null}
                  </Button>
                  <Divider css={{ m: 0 }} />
                </>
              ) : null}
            </div>
          ) : null}
          <div className="flex w-full flex-col items-start justify-start gap-y-2">
            {currentDropdownLevel?.listItems.map((item) => settingsOptions(item))}
          </div>
        </ResizablePanel>
      </PopoverContent>
    </Popover>
  );
};

export default MultiLevelDropdown;
