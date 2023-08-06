import { useEffect, useMemo, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Spacer } from '@nextui-org/spacer';
import { useLocation, useNavigate, useSearchParams } from '@remix-run/react';
import type { User } from '@supabase/supabase-js';
import type { AnimationItem } from 'lottie-web';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import { getBackgroundTitleBarColor, setMetaThemeColor } from '~/utils/client/meta-tags.client';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import languages from '~/constants/languages';
import { listCustomThemeColors, listDefaultThemeColors } from '~/constants/settings';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/elements/Popover';
import ResizablePanel from '~/components/elements/shared/ResizablePanel';
import Arrow from '~/assets/icons/ArrowIcon';
import Brush from '~/assets/icons/BrushIcon';
import GlobalIcon from '~/assets/icons/GlobalIcon';
import Tick from '~/assets/icons/TickIcon';
import avatar from '~/assets/images/avatar.png';
import dropdown from '~/assets/lotties/lottieflow-dropdown-03-0072F5-easey.json';

interface IMultiLevelDropdownProps {
  user?: User | undefined;
}

const MultiLevelDropdown = (props: IMultiLevelDropdownProps) => {
  const { user } = props;
  const { t } = useTranslation('header');
  const rootData = useTypedRouteLoaderData('root');
  const { locale } = rootData || { locale: 'en' };
  const { setTheme, theme: currentTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHydrated = useHydrated();
  const [search] = useSearchParams();
  const [currentLevel, setCurrentLevel] = useState('general');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLightDarkThemeOnly, currentThemeColor } = useSoraSettings();
  const { isDark } = useColorDarkenLighten();
  const [lottie, setLottie] = useState<AnimationItem>();
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
        title: user ? username : t('sign-in'),
        isTitleClickable: true,
        titleAction: () => (user ? null : navigate(`/sign-in?ref=${ref}`)),
        listItems: [
          {
            id: 'language',
            title: t('language'),
            description: 'Change the language of the website',
            showIcon: true,
            icon: <GlobalIcon />,
            action: () => setCurrentLevel('language'),
            currentValue: locale,
          },
          {
            id: 'display',
            title: t('display'),
            description: 'Change the display of the website',
            showIcon: true,
            icon: <Brush />,
            action: () => setCurrentLevel('display'),
          },
          {
            id: 'sign-up-log-out',
            title: user ? t('log-out') : t('sign-up'),
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
        title: t('language'),
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
        title: t('display'),
        isTitleClickable: false,
        titleAction: () => null,
        listItems:
          isLightDarkThemeOnly.value === true
            ? [
                {
                  id: 'theme',
                  title: t('theme'),
                  description: 'Change the theme of the website',
                  showIcon: true,
                  icon: <Brush />,
                  action: () => setCurrentLevel('theme'),
                  currentValue:
                    currentTheme === 'system' ? t('system') : isDark ? t('dark') : t('light'),
                },
                {
                  id: 'theme-color',
                  title: t('theme-color'),
                  description: 'Change the colors of the theme',
                  showIcon: true,
                  icon: <Brush />,
                  action: () => setCurrentLevel('theme-color'),
                  currentValue: t(currentThemeColor.value || 'blue'),
                },
              ]
            : listCustomThemeColors.map((theme) => ({
                id: theme,
                title: t(theme),
                description: theme,
                showIcon: false,
                icon: null,
                action: async () => {
                  await setTheme(theme);
                  const color = await getBackgroundTitleBarColor(isHydrated);
                  await setMetaThemeColor(`hsl(${color})`);
                },
                currentValue: null,
                isCurrent: currentTheme === theme,
              })),
      },
      {
        id: 'theme',
        key: 'theme',
        showTitle: true,
        showAvatar: false,
        showBackButton: true,
        backButtonAction: () => setCurrentLevel('display'),
        title: t('theme'),
        isTitleClickable: false,
        titleAction: () => null,
        listItems: [
          {
            id: 'dark',
            title: t('dark'),
            showIcon: false,
            icon: null,
            action: async () => {
              if (currentThemeColor.value !== 'blue') {
                await setTheme(`dark-${currentThemeColor.value}`);
              } else {
                await setTheme('dark');
              }
              const color = await getBackgroundTitleBarColor(isHydrated);
              await setMetaThemeColor(`hsl(${color})`);
            },
            currentValue: null,
            isCurrent: isDark && currentTheme !== 'system',
          },
          {
            id: 'light',
            title: t('light'),
            showIcon: false,
            icon: null,
            action: async () => {
              if (currentThemeColor.value !== 'blue') {
                await setTheme(`light-${currentThemeColor.value}`);
              } else {
                await setTheme('light');
              }
              const color = await getBackgroundTitleBarColor(isHydrated);
              await setMetaThemeColor(`hsl(${color})`);
            },
            currentValue: null,
            isCurrent: !isDark && currentTheme !== 'system',
          },
          {
            id: 'system',
            title: t('system'),
            showIcon: false,
            icon: null,
            action: async () => {
              await currentThemeColor.set('blue');
              await setTheme('system');
              const color = await getBackgroundTitleBarColor(isHydrated);
              await setMetaThemeColor(`hsl(${color})`);
            },
            currentValue: null,
            isCurrent: currentTheme === 'system',
          },
        ],
      },
      {
        id: 'theme-color',
        key: 'theme-color',
        showTitle: true,
        showAvatar: false,
        showBackButton: true,
        backButtonAction: () => setCurrentLevel('display'),
        title: t('theme-color'),
        isTitleClickable: false,
        titleAction: () => null,
        listItems: listDefaultThemeColors.map((theme) => ({
          id: theme,
          title: t(theme),
          showIcon: false,
          icon: null,
          action: async () => {
            await currentThemeColor.set(theme);
            if (isDark) {
              if (theme !== 'blue') {
                await setTheme(`dark-${theme}`);
              } else {
                await setTheme('dark');
              }
            } else {
              if (theme !== 'blue') {
                await setTheme(`light-${theme}`);
              } else {
                await setTheme('light');
              }
            }
            const color = await getBackgroundTitleBarColor(isHydrated);
            await setMetaThemeColor(`hsl(${color})`);
          },
          currentValue: null,
          isCurrent: currentThemeColor.value ? currentThemeColor.value === theme : theme === 'blue',
        })),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentTheme,
    locale,
    user,
    username,
    t,
    currentThemeColor.value,
    isDark,
    isHydrated,
    isLightDarkThemeOnly.value,
  ]);

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
      className="flex h-14 flex-row items-center justify-between gap-x-8 !p-2 data-[hover=true]:bg-default/[.6]"
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
          <Spacer x={6} />
        )}
        <h6 className="!line-clamp-1 !text-default-foreground">{item.title}</h6>
      </div>
      <div className="flex shrink-0 grow flex-row items-center justify-end gap-x-2">
        <p className="!text-default-foreground/80">
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
        </p>
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
          className="h-9 w-9"
          size="sm"
        >
          <Player
            lottieRef={(instance) => {
              setLottie(instance);
            }}
            src={dropdown}
            autoplay={false}
            keepLastFrame
            speed={2.7}
            className="lottie-color h-6 w-6"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        alignOffset={-8}
        className="z-[1000] bg-default/60 backdrop-blur-2xl backdrop-contrast-125 backdrop-saturate-200"
      >
        <ResizablePanel contentWidth="fit">
          {currentDropdownLevel ? (
            <div className="flex w-max flex-col items-start justify-start gap-y-2">
              {currentDropdownLevel?.showBackButton ||
              currentDropdownLevel?.showAvatar ||
              currentDropdownLevel?.showTitle ? (
                <>
                  <Button
                    type="button"
                    isIconOnly
                    fullWidth
                    variant="light"
                    onPress={
                      currentDropdownLevel?.isTitleClickable
                        ? currentDropdownLevel?.titleAction
                        : currentDropdownLevel?.backButtonAction
                    }
                    className="flex h-14 w-full flex-row items-center justify-between gap-x-2 p-2 data-[hover=true]:bg-default/[.6]"
                  >
                    {currentDropdownLevel?.showBackButton ? <Arrow direction="left" /> : null}
                    {currentDropdownLevel?.showAvatar ? (
                      <Avatar
                        size="sm"
                        alt="Avatar"
                        src={avatar}
                        color="primary"
                        radius="full"
                        isBordered
                      />
                    ) : null}
                    {currentDropdownLevel?.showTitle ? (
                      <h6 className="px-3 !text-default-foreground">
                        {currentDropdownLevel?.title}
                      </h6>
                    ) : null}
                    <div />
                  </Button>
                  <Divider />
                </>
              ) : null}
              <div className="flex w-full flex-col items-start justify-start gap-y-2">
                {currentDropdownLevel?.listItems.map((item) => settingsOptions(item))}
              </div>
            </div>
          ) : null}
        </ResizablePanel>
      </PopoverContent>
    </Popover>
  );
};

export default MultiLevelDropdown;
