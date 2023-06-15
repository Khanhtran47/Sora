import { Fragment, useEffect, useRef, useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Kbd, type KbdKey } from '@nextui-org/kbd';
import { Link } from '@nextui-org/link';
import { Spacer } from '@nextui-org/spacer';
import { Spinner } from '@nextui-org/spinner';
import { Switch, type SwitchProps } from '@nextui-org/switch';
import { useLocalStorageValue, useMediaQuery } from '@react-hookz/web';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, Link as RemixLink, useLocation, useNavigate } from '@remix-run/react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useTheme } from 'next-themes';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { MimeType } from 'remix-image';
import { ClientOnly, useHydrated } from 'remix-utils';

import { getBackgroundTitleBarColor, setMetaThemeColor } from '~/utils/client/meta-tags.client';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import languages from '~/constants/languages';
import {
  listCustomThemeColors,
  listDefaultThemeColors,
  listListLoadingType,
  listListViewType,
  listSubtitleBackgroundColor,
  listSubtitleBackgroundOpacity,
  listSubtitleFontColor,
  listSubtitleFontSize,
  listSubtitleTextEffects,
  // listSidebarActiveStyleMode,
  listSubtitleWindowColor,
  listSubtitleWindowOpacity,
  // listThemes,
  settingsTab,
} from '~/constants/settings';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import Image from '~/components/elements/Image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/elements/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/elements/tab/Tabs';
import Brush from '~/assets/icons/BrushIcon';
import Info from '~/assets/icons/InfoIcon';
import Moon from '~/assets/icons/MoonIcon';
import Play from '~/assets/icons/PlayIcon';
import SettingsIcon from '~/assets/icons/SettingsIcon';
import Sun from '~/assets/icons/SunIcon';
import User from '~/assets/icons/UserIcon';
import LogoFooter from '~/assets/images/logo_footer.png';

export const meta: MetaFunction = () => ({
  title: 'Settings',
  description: 'Settings',
  'og:title': 'Settings',
  'og:description': 'Settings',
});

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/settings" key="settings">
      Settings
    </BreadcrumbItem>
  ),
  miniTitle: () => ({
    title: 'Settings',
    showImage: false,
  }),
};

const settingsIcon = (id: string, filled: boolean) => {
  let icon;
  switch (id) {
    case 'general-tab':
      icon = <SettingsIcon filled={filled} />;
      break;
    case 'appearance-tab':
      icon = <Brush filled={filled} />;
      break;
    case 'account-tab':
      icon = <User filled={filled} />;
      break;
    case 'player-tab':
      icon = <Play filled={filled} />;
      break;
    case 'about-tab':
      icon = <Info filled={filled} />;
      break;
    default:
  }
  return icon;
};

interface SettingBlockCommonProps {
  title: string;
}

interface SettingBlockSelectProps extends SettingBlockCommonProps {
  type: 'select';
  selectedValue?: string;
  onSelectionChange: (value: string) => void;
  selectItems: string[];
}

interface SettingBlockSwitchProps extends SettingBlockCommonProps {
  type: 'switch';
  description?: string;
}

interface SettingBlockKbdProps extends SettingBlockCommonProps {
  type: 'kbd';
  keys?:
    | KbdKey
    | KbdKey[]
    | {
        keys?: KbdKey | KbdKey[];
        key?: string | number;
        id: string;
      }[];
  kbd?: string | number;
  betweenKeys?: string;
}

type SettingBlockProps =
  | SettingBlockSelectProps
  | (SettingBlockSwitchProps & SwitchProps)
  | SettingBlockKbdProps;

const SettingBlock = (props: SettingBlockProps) => {
  const { type } = props;
  const { t } = useTranslation('settings');
  if (type === 'switch') {
    const { title, description, ...rest } = props;
    return (
      <div className="bg-content2 flex flex-row items-center justify-between gap-x-2 rounded-md p-3">
        {description ? (
          <div className="flex flex-col items-start justify-center">
            <h6>{title}</h6>
            <p className="opacity-80">{description}</p>
          </div>
        ) : (
          <h6>{title}</h6>
        )}
        <Switch {...rest} />
      </div>
    );
  }
  if (type === 'select') {
    const { title, selectedValue, onSelectionChange, selectItems } = props;
    return (
      <div className="bg-content2 flex flex-row items-center justify-between rounded-md p-3">
        <h6>{title}</h6>
        {selectItems && selectItems.length > 0 ? (
          <Select value={selectedValue} onValueChange={(value) => onSelectionChange(value)}>
            <SelectTrigger arial-label={title} className="!w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectItems.map((item) => (
                <SelectItem key={item} value={item}>
                  {t(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>
    );
  }
  if (type === 'kbd') {
    const { keys, kbd, title, betweenKeys } = props;
    return (
      <div className="bg-content2 flex flex-row items-center justify-between gap-x-2 rounded-md p-3">
        <h6>{title}</h6>
        {keys ? (
          Array.isArray(
            keys as {
              keys?: KbdKey | KbdKey[];
              key?: string | number;
              id: string;
            }[],
          ) ? (
            <div className="flex flex-row items-center gap-x-2">
              {(
                keys as {
                  keys?: KbdKey | KbdKey[];
                  key?: string | number;
                  id: string;
                }[]
              ).map((k, index) => (
                <Fragment key={k.id}>
                  {k?.keys ? (
                    <Kbd keys={k?.keys as KbdKey | KbdKey[]}>{k?.key ? k?.key : null}</Kbd>
                  ) : (
                    <Kbd>{k?.key ? k?.key : null}</Kbd>
                  )}
                  {index !== (keys as KbdKey[]).length - 1 && betweenKeys ? (
                    <div>{betweenKeys}</div>
                  ) : null}
                </Fragment>
              ))}
            </div>
          ) : typeof keys === 'string' ? (
            <Kbd keys={keys as KbdKey | KbdKey[]}>{kbd || ''}</Kbd>
          ) : null
        ) : (
          <Kbd>{kbd || ''}</Kbd>
        )}
      </div>
    );
  }
  return null;
};

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHydrated = useHydrated();
  const rootData = useTypedRouteLoaderData('root');
  const { locale } = rootData || { locale: 'en' };
  const { t } = useTranslation('settings');
  const { theme, setTheme } = useTheme();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isMd = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const underlineRef = useRef<HTMLDivElement>(null);
  const { isDark } = useColorDarkenLighten();

  const {
    currentSubtitleFontColor,
    currentSubtitleFontSize,
    currentSubtitleBackgroundColor,
    currentSubtitleBackgroundOpacity,
    currentSubtitleWindowColor,
    currentSubtitleWindowOpacity,
    currentSubtitleTextEffects,
    autoShowSubtitle,
    // showFilter,
    isMutedTrailer,
    isPlayTrailer,
    isAutoSize,
    isPicInPic,
    isMuted,
    isAutoPlay,
    isAutoMini,
    isLoop,
    isScreenshot,
    isMiniProgressBar,
    isAutoPlayback,
    isAutoPlayNextEpisode,
    isShowSkipOpEdButton,
    isAutoSkipOpEd,
    isFastForward,
    // isSwipeFullscreen,
    // sidebarStyleMode,
    sidebarMiniMode,
    sidebarHoverMode,
    sidebarBoxedMode,
    // sidebarSheetMode,
    autoSwitchSubtitle,
    isShowBreadcrumb,
    isShowTopPagination,
    isLightDarkThemeOnly,
  } = useSoraSettings();
  const listViewType = useLocalStorageValue('sora_settings-layout-list_view', {
    defaultValue: 'card',
  });
  const listLoadingType = useLocalStorageValue('sora_settings-layout-list-loading_type', {
    defaultValue: 'pagination',
  });
  const currentThemeColor = useLocalStorageValue('sora_settings-layout-theme-color', {
    defaultValue: 'blue',
  });

  const [activeTab, setActiveTab] = useState('general-tab');
  const [selectedLang, setSelectedLang] = useState(locale);
  const [selectedSubtitleFontColor, setSelectedSubtitleFontColor] = useState(
    currentSubtitleFontColor.value,
  );
  const [selectedSubtitleFontSize, setSelectedSubtitleFontSize] = useState(
    currentSubtitleFontSize.value,
  );
  const [selectedSubtitleBackgroundColor, setSelectedSubtitleBackgroundColor] = useState(
    currentSubtitleBackgroundColor.value,
  );
  const [selectedSubtitleBackgroundOpacity, setSelectedSubtitleBackgroundOpacity] = useState(
    currentSubtitleBackgroundOpacity.value,
  );
  const [selectedSubtitleWindowColor, setSelectedSubtitleWindowColor] = useState(
    currentSubtitleWindowColor.value,
  );
  const [selectedSubtitleWindowOpacity, setSelectedSubtitleWindowOpacity] = useState(
    currentSubtitleWindowOpacity.value,
  );
  const [selectedSubtitleTextEffects, setSelectedSubtitleTextEffects] = useState(
    currentSubtitleTextEffects.value,
  );
  const [selectedListViewType, setSelectedListViewType] = useState(listViewType.value);
  const [selectedListLoadingType, setSelectedListLoadingType] = useState(listLoadingType.value);
  const [selectedThemeColor, setSelectedThemeColor] = useState(() => {
    if (!isLightDarkThemeOnly.value) {
      return theme;
    } else {
      return currentThemeColor.value;
    }
  });

  useEffect(() => {
    if (underlineRef.current) {
      underlineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [activeTab]);

  const handleDragEnd = (_event: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
    const currentTab = settingsTab.find((tab) => tab.id === activeTab);
    if (info.offset?.x > 100) {
      // swipe right
      if (currentTab?.id === 'general-tab') {
        setActiveTab('about-tab');
      } else {
        const index = settingsTab.findIndex((tab) => tab.id === activeTab);
        setActiveTab(settingsTab[index - 1].id);
      }
    }
    if (info.offset?.x < -100 && info.offset?.y > -50) {
      // swipe left
      if (currentTab?.id === 'about-tab') {
        setActiveTab('general-tab');
      } else {
        const index = settingsTab.findIndex((tab) => tab.id === activeTab);
        setActiveTab(settingsTab[index + 1].id);
      }
    }
  };

  const handleSelect = async (value: string, type: string) => {
    switch (type) {
      case 'language': {
        setSelectedLang(value);
        navigate(`${location.pathname}?lng=${value}`);
        break;
      }
      case 'list-view-type': {
        setSelectedListViewType(value);
        listViewType.set(value);
        break;
      }
      case 'list-loading-type': {
        setSelectedListLoadingType(value);
        listLoadingType.set(value);
        break;
      }
      case 'subtitle-font-color': {
        setSelectedSubtitleFontColor(value);
        currentSubtitleFontColor.set(value);
        break;
      }
      case 'subtitle-font-size': {
        setSelectedSubtitleFontSize(value);
        currentSubtitleFontSize.set(value);
        break;
      }
      case 'subtitle-background-color': {
        setSelectedSubtitleBackgroundColor(value);
        currentSubtitleBackgroundColor.set(value);
        break;
      }
      case 'subtitle-background-opacity': {
        setSelectedSubtitleBackgroundOpacity(value);
        currentSubtitleBackgroundOpacity.set(value);
        break;
      }
      case 'subtitle-window-color': {
        setSelectedSubtitleWindowColor(value);
        currentSubtitleWindowColor.set(value);
        break;
      }
      case 'subtitle-window-opacity': {
        setSelectedSubtitleWindowOpacity(value);
        currentSubtitleWindowOpacity.set(value);
        break;
      }
      case 'subtitle-text-effects': {
        setSelectedSubtitleTextEffects(value);
        currentSubtitleTextEffects.set(value);
        break;
      }
      case 'theme-color': {
        await setSelectedThemeColor(value);
        await currentThemeColor.set(value);
        if (isDark) {
          if (value !== 'blue') {
            await setTheme(`dark-${value}`);
          } else {
            await setTheme('dark');
          }
        } else {
          if (value !== 'blue') {
            await setTheme(`light-${value}`);
          } else {
            await setTheme('light');
          }
        }
        const color = await getBackgroundTitleBarColor(isHydrated);
        await setMetaThemeColor(`hsl(${color})`);
        break;
      }
      case 'custom-theme-color': {
        await setSelectedThemeColor(value);
        await setTheme(value);
        const color = await getBackgroundTitleBarColor(isHydrated);
        await setMetaThemeColor(`hsl(${color})`);
      }
    }
  };

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-screen-4xl flex w-full flex-col justify-start py-3 sm:py-0"
    >
      <h2>{t('settings')}</h2>
      <Spacer y={2.5} />
      <ClientOnly fallback={<Spinner />}>
        {() => (
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            orientation={isSm ? 'horizontal' : 'vertical'}
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList>
              {settingsTab.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={tab.disabled}
                  className="relative"
                >
                  {settingsIcon(tab.id, activeTab === tab.id)}
                  <h6 className="ml-2">{t(tab.title)}</h6>
                  {activeTab === tab.id ? (
                    <motion.div
                      className="bg-default-foreground absolute overflow-hidden rounded-md data-[orientation=horizontal]:bottom-0 data-[orientation=vertical]:left-0 data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-1/2 data-[orientation=horizontal]:w-1/2 data-[orientation=vertical]:w-1"
                      layoutId="underline"
                      data-orientation={isSm ? 'horizontal' : 'vertical'}
                      ref={underlineRef}
                    />
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>
            <AnimatePresence exitBeforeEnter>
              <TabsContent value="general-tab" key="general-tab" asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  drag={isMobile ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={handleDragEnd}
                  dragDirectionLock
                >
                  <div className="bg-content1 shadow-default/10 flex w-full flex-col justify-start rounded-xl p-5 shadow-lg">
                    <SettingBlock
                      type="select"
                      title={t('language')}
                      selectedValue={selectedLang}
                      onSelectionChange={(value) => handleSelect(value, 'language')}
                      selectItems={languages}
                    />
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="appearance-tab" key="appearance-tab" asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  drag={isMobile ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={handleDragEnd}
                  className="w-full"
                >
                  {/* @ts-ignore */}
                  <Accordion variant="splitted" selectionMode="multiple" className="px-0">
                    <AccordionItem
                      title={t('theme')}
                      subtitle={t('theme-subtitle')}
                      classNames={{
                        title: 'text-2xl',
                        subtitle: 'text-base',
                        content: 'pb-4',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('light-dark-only')}
                        isSelected={isLightDarkThemeOnly.value}
                        onValueChange={(isSelected) => {
                          isLightDarkThemeOnly.set(isSelected);
                          if (isSelected) {
                            setTheme('system');
                            setSelectedThemeColor('blue');
                          } else {
                            setTheme('bumblebee');
                            setSelectedThemeColor('bumblebee');
                          }
                        }}
                      />
                      <Spacer y={2.5} />
                      {isLightDarkThemeOnly.value ? (
                        <>
                          <SettingBlock
                            type="switch"
                            title={t('dark-mode')}
                            isSelected={isDark}
                            onValueChange={async (isSelected) => {
                              if (isSelected) {
                                if (currentThemeColor.value !== 'blue') {
                                  await setTheme(`dark-${currentThemeColor.value}`);
                                } else await setTheme('dark');
                              } else {
                                if (currentThemeColor.value !== 'blue') {
                                  await setTheme(`light-${currentThemeColor.value}`);
                                } else await setTheme('light');
                              }
                              const color = await getBackgroundTitleBarColor(isHydrated);
                              await setMetaThemeColor(`hsl(${color})`);
                            }}
                            color="primary"
                            classNames={{
                              thumbIcon: 'h-4 w-4',
                            }}
                            thumbIcon={({ isSelected, className }) =>
                              isSelected ? (
                                <Moon className={className} />
                              ) : (
                                <Sun className={className} />
                              )
                            }
                          />
                          <Spacer y={2.5} />
                          <SettingBlock
                            type="select"
                            title={t('theme-color')}
                            selectedValue={selectedThemeColor}
                            onSelectionChange={(value) => handleSelect(value, 'theme-color')}
                            selectItems={listDefaultThemeColors}
                          />
                        </>
                      ) : (
                        <SettingBlock
                          type="select"
                          title={t('custom-theme-color')}
                          selectedValue={selectedThemeColor}
                          onSelectionChange={(value) => handleSelect(value, 'custom-theme-color')}
                          selectItems={listCustomThemeColors}
                        />
                      )}
                    </AccordionItem>
                    {isSm ? null : (
                      <AccordionItem
                        title={t('sidebar')}
                        subtitle={t('sidebar-subtitle')}
                        classNames={{
                          title: 'text-2xl',
                          subtitle: 'text-base',
                          content: 'pb-4',
                        }}
                      >
                        <div className="bg-content2 flex flex-col items-start justify-center gap-y-4 rounded-md p-3">
                          <h5 className="my-1">{t('sidebar-mode')}</h5>
                          {isMd ? null : (
                            <>
                              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                                <h6>{t('sidebar-mini-mode')}</h6>
                                <Switch
                                  isSelected={sidebarMiniMode.value}
                                  onValueChange={(isSelected: boolean) => {
                                    sidebarMiniMode.set(isSelected);
                                    if (sidebarMiniMode.value) {
                                      sidebarHoverMode.set(false);
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                                <h6>{t('sidebar-hover-mode')}</h6>
                                <Switch
                                  isSelected={sidebarHoverMode.value}
                                  onValueChange={(isSelected: boolean) => {
                                    sidebarHoverMode.set(isSelected);
                                    if (!sidebarHoverMode.value) {
                                      sidebarMiniMode.set(true);
                                    }
                                  }}
                                />
                              </div>
                            </>
                          )}
                          <div className="flex w-full flex-row items-center justify-between gap-x-2">
                            <h6>{t('sidebar-boxed-mode')}</h6>
                            <Switch
                              isSelected={sidebarBoxedMode.value}
                              onValueChange={(isSelected: boolean) =>
                                sidebarBoxedMode.set(isSelected)
                              }
                            />
                          </div>
                        </div>
                      </AccordionItem>
                    )}
                    {isSm ? null : (
                      <AccordionItem
                        title={t('header')}
                        subtitle={t('header-subtitle')}
                        classNames={{
                          title: 'text-2xl',
                          subtitle: 'text-base',
                          content: 'pb-4',
                        }}
                      >
                        <SettingBlock
                          type="switch"
                          title={t('show-breadcrumb')}
                          isSelected={isShowBreadcrumb.value}
                          onValueChange={(isSelected) => isShowBreadcrumb.set(isSelected)}
                        />
                      </AccordionItem>
                    )}
                    <AccordionItem
                      title={t('media-list-banner')}
                      subtitle={t('media-list-banner-subtitle')}
                      classNames={{
                        title: 'text-2xl',
                        subtitle: 'text-base',
                        content: 'pb-4',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('play-trailer')}
                        isSelected={isPlayTrailer.value}
                        onValueChange={(isSelected) => isPlayTrailer.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('mute-trailer')}
                        isSelected={isMutedTrailer.value}
                        onValueChange={(isSelected) => isMutedTrailer.set(isSelected)}
                      />
                    </AccordionItem>
                    <AccordionItem
                      title={t('media-list-grid')}
                      subtitle={t('media-list-grid-subtitle')}
                      classNames={{
                        title: 'text-2xl',
                        subtitle: 'text-base',
                        content: 'pb-4',
                      }}
                    >
                      <SettingBlock
                        type="select"
                        title={t('list-view-type')}
                        selectedValue={selectedListViewType}
                        onSelectionChange={(value) => handleSelect(value, 'list-view-type')}
                        selectItems={listListViewType}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="select"
                        title={t('list-loading-type')}
                        selectedValue={selectedListLoadingType}
                        onSelectionChange={(value) => handleSelect(value, 'list-loading-type')}
                        selectItems={listListLoadingType}
                      />
                      <Spacer y={2.5} />
                      {selectedListLoadingType === 'pagination' ? (
                        <SettingBlock
                          type="switch"
                          title={t('show-top-pagination')}
                          isSelected={isShowTopPagination.value}
                          onValueChange={(isSelected) => isShowTopPagination.set(isSelected)}
                        />
                      ) : null}
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              </TabsContent>
              <TabsContent value="account-tab" key="account-tab" asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  drag={isMobile ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={handleDragEnd}
                  className="w-full"
                ></motion.div>
              </TabsContent>
              <TabsContent value="player-tab" key="player-tab" asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  drag={isMobile ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={handleDragEnd}
                  className="w-full"
                >
                  <Accordion variant="splitted" selectionMode="multiple" className="px-0">
                    <AccordionItem
                      title={t('defaults')}
                      subtitle={t('defaults-subtitle')}
                      classNames={{
                        title: 'text-2xl',
                        subtitle: 'text-base',
                        content: 'pb-4',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('mute-trailer')}
                        description={t('pic-in-pic-subtitle')}
                        isSelected={isPicInPic.value}
                        onValueChange={(isSelected) => isPicInPic.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('muted')}
                        description={t('muted-subtitle')}
                        isSelected={isMuted.value}
                        onValueChange={(isSelected) => isMuted.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('autoplay')}
                        description={t('autoplay-subtitle')}
                        isSelected={isAutoPlay.value}
                        onValueChange={(isSelected) => isAutoPlay.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('loop')}
                        description={t('loop-subtitle')}
                        isSelected={isLoop.value}
                        onValueChange={(isSelected) => isLoop.set(isSelected)}
                      />
                    </AccordionItem>
                    <AccordionItem
                      title={t('subtitles')}
                      subtitle={t('subtitles-subtitle')}
                      classNames={{
                        title: 'text-2xl',
                        subtitle: 'text-base',
                        content: 'pb-4',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('show-subtitle')}
                        description={t('show-subtitle-subtitle')}
                        isSelected={autoShowSubtitle.value}
                        onValueChange={(isSelected) => autoShowSubtitle.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('auto-switch-subtitle')}
                        description={t('auto-switch-subtitle-subtitle')}
                        isSelected={autoSwitchSubtitle.value}
                        onValueChange={(isSelected) => autoSwitchSubtitle.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-font-color')}
                        selectedValue={selectedSubtitleFontColor}
                        onSelectionChange={(value) => handleSelect(value, 'subtitle-font-color')}
                        selectItems={listSubtitleFontColor}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-font-size')}
                        selectedValue={selectedSubtitleFontSize}
                        onSelectionChange={(value) => handleSelect(value, 'subtitle-font-size')}
                        selectItems={listSubtitleFontSize}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-background-color')}
                        selectedValue={selectedSubtitleBackgroundColor}
                        onSelectionChange={(value) =>
                          handleSelect(value, 'subtitle-background-color')
                        }
                        selectItems={listSubtitleBackgroundColor}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-background-opacity')}
                        selectedValue={selectedSubtitleBackgroundOpacity}
                        onSelectionChange={(value) =>
                          handleSelect(value, 'subtitle-background-opacity')
                        }
                        selectItems={listSubtitleBackgroundOpacity}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-window-color')}
                        selectedValue={selectedSubtitleWindowColor}
                        onSelectionChange={(value) => handleSelect(value, 'subtitle-window-color')}
                        selectItems={listSubtitleWindowColor}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-window-opacity')}
                        selectedValue={selectedSubtitleWindowOpacity}
                        onSelectionChange={(value) =>
                          handleSelect(value, 'subtitle-window-opacity')
                        }
                        selectItems={listSubtitleWindowOpacity}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-text-effects')}
                        selectedValue={selectedSubtitleTextEffects}
                        onSelectionChange={(value) => handleSelect(value, 'subtitle-text-effects')}
                        selectItems={listSubtitleTextEffects}
                      />
                    </AccordionItem>
                    <AccordionItem
                      title={t('player-features')}
                      subtitle={t('player-features-subtitle')}
                      classNames={{
                        title: 'text-2xl',
                        subtitle: 'text-base',
                        content: 'pb-4',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('auto-size')}
                        description={t('auto-size-subtitle')}
                        isSelected={isAutoSize.value}
                        onValueChange={(isSelected) => isAutoSize.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('auto-mini')}
                        description={t('auto-mini-subtitle')}
                        isSelected={isAutoMini.value}
                        onValueChange={(isSelected) => isAutoMini.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('screenshot')}
                        description={t('screenshot-subtitle')}
                        isSelected={isScreenshot.value}
                        onValueChange={(isSelected) => isScreenshot.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('mini-progressbar')}
                        description={t('mini-progressbar-subtitle')}
                        isSelected={isMiniProgressBar.value}
                        onValueChange={(isSelected) => isMiniProgressBar.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('auto-playback')}
                        description={t('auto-playback-subtitle')}
                        isSelected={isAutoPlayback.value}
                        onValueChange={(isSelected) => isAutoPlayback.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('fast-forward')}
                        description={t('fast-forward-subtitle')}
                        isSelected={isFastForward.value}
                        onValueChange={(isSelected) => isFastForward.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('auto-play-next-episode')}
                        description={t('auto-play-next-episode-subtitle')}
                        isSelected={isAutoPlayNextEpisode.value}
                        onValueChange={(isSelected) => isAutoPlayNextEpisode.set(isSelected)}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="switch"
                        title={t('show-skip-op-ed-button')}
                        description={t('show-skip-op-ed-button-subtitle')}
                        isSelected={isShowSkipOpEdButton.value}
                        onValueChange={(isSelected) => {
                          isShowSkipOpEdButton.set(isSelected);
                          if (!isShowSkipOpEdButton.value) {
                            isAutoSkipOpEd.set(false);
                          }
                        }}
                      />
                      <AnimatePresence>
                        {isShowSkipOpEdButton ? (
                          <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Spacer y={2.5} />
                            <SettingBlock
                              type="switch"
                              title={t('auto-skip-op-ed')}
                              description={t('auto-skip-op-ed-subtitle')}
                              isSelected={isAutoSkipOpEd.value}
                              onValueChange={(isSelected) => isAutoSkipOpEd.set(isSelected)}
                            />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </AccordionItem>
                    <AccordionItem
                      title={t('keyboard')}
                      subtitle={t('keyboard-subtitle')}
                      classNames={{
                        title: 'text-2xl',
                        subtitle: 'text-base',
                        content: 'pb-4',
                      }}
                    >
                      <SettingBlock type="kbd" title={t('volume-up')} keys="up" />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('volume-down')} keys="down" />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('fast-rewind-5s')} keys="left" />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('fast-forward-5s')} keys="right" />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="kbd"
                        title={t('toggle-play-pause')}
                        keys={[
                          { keys: 'space', id: 'space' },
                          { key: 'K', id: 'K' },
                        ]}
                        betweenKeys={t('or')}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="kbd"
                        title={t('seek-to-start')}
                        keys={[
                          { keys: 'home', id: 'home' },
                          { key: '0', id: '0' },
                        ]}
                        betweenKeys={t('or')}
                      />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('seek-to-end')} keys="end" />
                      <Spacer y={2.5} />
                      <SettingBlock
                        type="kbd"
                        title={t('seek-to-percent')}
                        keys={[
                          { key: '1', id: '1' },
                          { key: '9', id: '9' },
                        ]}
                        betweenKeys="..."
                      />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('toggle-subtitle')} kbd="C" />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('toggle-fullscreen')} kbd="F" />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('fast-rewind-10s')} kbd="J" />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('fast-forward-10s')} kbd="L" />
                      <Spacer y={2.5} />
                      <SettingBlock type="kbd" title={t('mute-unmute')} kbd="M" />
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              </TabsContent>
              <TabsContent value="about-tab" key="about-tab" asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  drag={isMobile ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={handleDragEnd}
                  className="w-full"
                >
                  <div className="bg-content1 shadow-default/10 w-full rounded-xl p-5 shadow-lg">
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        alt="About Logo"
                        title="About Logo"
                        src={LogoFooter}
                        loaderUrl="/api/image"
                        width="76px"
                        height="76px"
                        radius="full"
                        placeholder="empty"
                        responsive={[
                          {
                            size: {
                              width: 76,
                              height: 76,
                            },
                          },
                        ]}
                        options={{
                          contentType: MimeType.WEBP,
                        }}
                      />
                      <NavLink
                        to="/"
                        arial-label="home-page"
                        className="from-secondary to-primary bg-gradient-to-tr to-50% bg-clip-text text-3xl font-bold tracking-normal text-transparent md:text-4xl"
                      >
                        SORA
                      </NavLink>
                    </div>
                    <Spacer y={1} />
                    <div className="flex flex-row items-center justify-center space-x-4">
                      <Link as={RemixLink} to="/design-system">
                        Design 🎨
                      </Link>
                      <Link
                        isExternal
                        href="https://raw.githubusercontent.com/Khanhtran47/Sora/master/LICENSE.txt"
                      >
                        License 📜
                      </Link>
                      <Link href="#">Contact ✉️</Link>
                    </div>
                    <Spacer y={1} />
                    <h6 className="!text-default-900 text-center">
                      This site does not store any files on its server. All contents are provided by
                      non-affiliated third parties.
                    </h6>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        )}
      </ClientOnly>
    </motion.div>
  );
};

export default Settings;
