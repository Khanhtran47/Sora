/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useMemo, useRef, useState, type Key } from 'react';
import { Kbd, type KbdKey } from '@nextui-org/kbd';
import { Link } from '@nextui-org/link';
import {
  Badge,
  Collapse,
  Dropdown,
  Loading,
  Image as NextImage,
  Radio,
  Spacer,
  Switch,
  Tooltip,
  type SwitchEvent,
} from '@nextui-org/react';
import { useLocalStorageValue, useMediaQuery } from '@react-hookz/web';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, Link as RemixLink, useLocation, useNavigate } from '@remix-run/react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useTheme } from 'next-themes';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import Image, { MimeType } from 'remix-image';
import { ClientOnly } from 'remix-utils';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import languages from '~/constants/languages';
import {
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
  listThemes,
  settingsTab,
} from '~/constants/settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/elements/tab/Tabs';
import Brush from '~/assets/icons/BrushIcon';
import Info from '~/assets/icons/InfoIcon';
import Play from '~/assets/icons/PlayIcon';
import SettingsIcon from '~/assets/icons/SettingsIcon';
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
    <NavLink to="/settings" aria-label="Settings Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Settings
        </Badge>
      )}
    </NavLink>
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
  selectedValue: string;
  selectedKeys: Set<string>;
  onSelectionChange: ((keys: 'all' | Set<Key>) => any) | undefined;
  selectItems: string[];
}

interface SettingBlockSwitchProps extends SettingBlockCommonProps {
  type: 'switch';
  description?: string;
  checked?: boolean;
  onChange: ((ev: SwitchEvent) => void) | undefined;
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

type SettingBlockProps = SettingBlockSelectProps | SettingBlockSwitchProps | SettingBlockKbdProps;

const SettingBlock = (props: SettingBlockProps) => {
  const { type } = props;
  const { t } = useTranslation('settings');
  if (type === 'switch') {
    const { checked, onChange, title, description } = props;
    return (
      <div className="flex flex-row items-center justify-between gap-x-2 rounded-md bg-content2 p-3">
        {description ? (
          <div className="flex flex-col items-start justify-center">
            <h6>{title}</h6>
            <p className="opacity-80">{description}</p>
          </div>
        ) : (
          <h6>{title}</h6>
        )}
        <Switch checked={checked} onChange={onChange} />
      </div>
    );
  }
  if (type === 'select') {
    const { title, selectedValue, selectedKeys, onSelectionChange, selectItems } = props;
    return (
      <div className="flex flex-row items-center justify-between rounded-md bg-content2 p-3">
        <h6>{title}</h6>
        <Dropdown isBordered>
          <Dropdown.Button color="primary">{selectedValue}</Dropdown.Button>
          <Dropdown.Menu
            aria-label="Select language"
            color="primary"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
          >
            {selectItems.map((item) => (
              <Dropdown.Item key={item}>{t(item)}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
  if (type === 'kbd') {
    const { keys, kbd, title, betweenKeys } = props;
    return (
      <div className="flex flex-row items-center justify-between gap-x-2 rounded-md bg-content2 p-3">
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
  const rootData = useTypedRouteLoaderData('root');
  const { locale } = rootData || { locale: 'en' };
  const { t } = useTranslation('settings');
  const { theme, setTheme } = useTheme();
  const isXs = useMediaQuery('(max-width: 450px)', { initializeWithValue: false });
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const isMd = useMediaQuery('(max-width: 1280px)', { initializeWithValue: false });
  const underlineRef = useRef<HTMLDivElement>(null);

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
    isMiniProgressbar,
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
  } = useSoraSettings();
  const listViewType = useLocalStorageValue('sora-settings_layout_list-view', {
    defaultValue: 'card',
  });
  const listLoadingType = useLocalStorageValue('sora-settings_layout_list-loading-type', {
    defaultValue: 'pagination',
  });

  const [activeTab, setActiveTab] = useState('general-tab');
  const [selectedLang, setSelectedLang] = useState(new Set([locale]));
  const [selectedSubtitleFontColor, setSelectedSubtitleFontColor] = useState(
    new Set([currentSubtitleFontColor.value!]),
  );
  const [selectedSubtitleFontSize, setSelectedSubtitleFontSize] = useState(
    new Set([currentSubtitleFontSize.value!]),
  );
  const [selectedSubtitleBackgroundColor, setSelectedSubtitleBackgroundColor] = useState(
    new Set([currentSubtitleBackgroundColor.value!]),
  );
  const [selectedSubtitleBackgroundOpacity, setSelectedSubtitleBackgroundOpacity] = useState(
    new Set([currentSubtitleBackgroundOpacity.value!]),
  );
  const [selectedSubtitleWindowColor, setSelectedSubtitleWindowColor] = useState(
    new Set([currentSubtitleWindowColor.value!]),
  );
  const [selectedSubtitleWindowOpacity, setSelectedSubtitleWindowOpacity] = useState(
    new Set([currentSubtitleWindowOpacity.value!]),
  );
  const [selectedSubtitleTextEffects, setSelectedSubtitleTextEffects] = useState(
    new Set([currentSubtitleTextEffects.value!]),
  );
  const [selectedListViewType, setSelectedListViewType] = useState(new Set([listViewType.value!]));
  const [selectedListLoadingType, setSelectedListLoadingType] = useState(
    new Set([listLoadingType.value!]),
  );
  // const [selectedSidebarStyleMode, setSelectedSidebarStyleMode] = useState(
  //   new Set([sidebarStyleMode.value!]),
  // );

  const selectedLangValue = useMemo(
    () => Array.from(selectedLang).join(', ').replaceAll('_', ' '),
    [selectedLang],
  );
  const selectedSubtitleFontColorValue = useMemo(
    () => Array.from(selectedSubtitleFontColor).join(', '),
    [selectedSubtitleFontColor],
  );
  const selectedSubtitleFontSizeValue = useMemo(
    () => Array.from(selectedSubtitleFontSize).join(', '),
    [selectedSubtitleFontSize],
  );
  const selectedSubtitleBackgroundColorValue = useMemo(
    () => Array.from(selectedSubtitleBackgroundColor).join(', '),
    [selectedSubtitleBackgroundColor],
  );
  const selectedSubtitleBackgroundOpacityValue = useMemo(
    () => Array.from(selectedSubtitleBackgroundOpacity).join(', '),
    [selectedSubtitleBackgroundOpacity],
  );
  const selectedSubtitleWindowColorValue = useMemo(
    () => Array.from(selectedSubtitleWindowColor).join(', '),
    [selectedSubtitleWindowColor],
  );
  const selectedSubtitleWindowOpacityValue = useMemo(
    () => Array.from(selectedSubtitleWindowOpacity).join(', '),
    [selectedSubtitleWindowOpacity],
  );
  const selectedSubtitleTextEffectsValue = useMemo(
    () => Array.from(selectedSubtitleTextEffects).join(', '),
    [selectedSubtitleTextEffects],
  );
  const selectedListViewTypeValue = useMemo(
    () => Array.from(selectedListViewType).join(', '),
    [selectedListViewType],
  );
  const selectedListLoadingTypeValue = useMemo(
    () => Array.from(selectedListLoadingType).join(', '),
    [selectedListLoadingType],
  );
  // const selectedSidebarStyleModeValue = useMemo(
  //   () => Array.from(selectedSidebarStyleMode).join(', '),
  //   [selectedSidebarStyleMode],
  // );

  useEffect(() => {
    if (underlineRef.current) {
      underlineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, [activeTab]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragEnd = (event: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
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

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full max-w-screen-4xl flex-col justify-start py-3 sm:py-0"
    >
      <h2>{t('settings')}</h2>
      <Spacer y={0.5} />
      <ClientOnly fallback={<Loading type="default" />}>
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
                      className="absolute overflow-hidden rounded-md bg-neutral-foreground data-[orientation=horizontal]:bottom-0 data-[orientation=vertical]:left-0 data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-1/2 data-[orientation=horizontal]:w-1/2 data-[orientation=vertical]:w-1"
                      layoutId="underline"
                      data-orientation={isSm ? 'horizontal' : 'vertical'}
                      ref={underlineRef}
                    />
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>
            <AnimatePresence exitBeforeEnter>
              <TabsContent value="general-tab" asChild>
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
                  // onDirectionLock={(axis) => console.log(axis)}
                >
                  <div className="flex w-full flex-col justify-start rounded-xl bg-content1 p-5 shadow-lg shadow-neutral/10">
                    <SettingBlock
                      type="select"
                      title={t('language')}
                      selectedValue={t(selectedLangValue)}
                      selectedKeys={selectedLang}
                      onSelectionChange={(keys: any) => {
                        const lang = Array.from(keys).join(', ').replaceAll('_', ' ');
                        setSelectedLang(keys);
                        navigate(`${location.pathname}?lng=${lang}`);
                      }}
                      selectItems={languages}
                    />
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="appearance-tab" asChild>
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
                  <Collapse.Group splitted accordion={false} css={{ p: 0 }}>
                    <Collapse
                      title={t('theme')}
                      subtitle={t('theme-subtitle')}
                      css={{
                        backgroundColor: 'hsl(var(--colors-content1)) !important',
                        borderRadius: '0.75rem !important',
                      }}
                    >
                      <Radio.Group
                        orientation={isXs ? 'vertical' : 'horizontal'}
                        defaultValue={theme}
                        size="sm"
                        onChange={(value) => {
                          if (value === 'light' || value === 'dark') {
                            setTheme(value);
                          } else if (['bumblebee', 'retro', 'autumn'].includes(value)) {
                            setTheme('light');
                            setTheme(value);
                          } else {
                            setTheme('dark');
                            setTheme(value);
                          }
                        }}
                      >
                        {listThemes.map((themeItem) => (
                          <Tooltip
                            key={themeItem.id}
                            content={isXs ? null : themeItem.title}
                            rounded
                            color="primary"
                            hideArrow
                            offset={0}
                          >
                            <Radio
                              key={themeItem.id}
                              value={themeItem.id}
                              css={{
                                p: '$xs',
                                '--nextui--radioColor': themeItem.color,
                                '--nextui-colors-border': themeItem.color,
                                '--nextui--radioColorHover': themeItem.colorHover,
                              }}
                            >
                              {isXs ? themeItem.title : null}
                            </Radio>
                          </Tooltip>
                        ))}
                      </Radio.Group>
                    </Collapse>
                    {isSm ? null : (
                      <Collapse
                        title={t('sidebar')}
                        subtitle={t('sidebar-subtitle')}
                        css={{
                          backgroundColor: 'hsl(var(--colors-content1)) !important',
                          borderRadius: '0.75rem !important',
                        }}
                      >
                        <div className="flex flex-col items-start justify-center gap-y-4 rounded-md bg-content2 p-3">
                          <h5 className="my-1">{t('sidebar-mode')}</h5>
                          {isMd ? null : (
                            <>
                              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                                <h6>{t('sidebar-mini-mode')}</h6>
                                <Switch
                                  checked={sidebarMiniMode.value}
                                  onChange={(e) => {
                                    sidebarMiniMode.set(e.target.checked);
                                    if (sidebarMiniMode.value) {
                                      sidebarHoverMode.set(false);
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                                <h6>{t('sidebar-hover-mode')}</h6>
                                <Switch
                                  checked={sidebarHoverMode.value}
                                  onChange={(e) => {
                                    sidebarHoverMode.set(e.target.checked);
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
                              checked={sidebarBoxedMode.value}
                              onChange={(e) => sidebarBoxedMode.set(e.target.checked)}
                            />
                          </div>
                        </div>
                      </Collapse>
                    )}
                    <Collapse
                      title={t('media-list-grid')}
                      subtitle={t('media-list-grid-subtitle')}
                      css={{
                        backgroundColor: 'hsl(var(--colors-content1)) !important',
                        borderRadius: '0.75rem !important',
                      }}
                    >
                      <SettingBlock
                        type="select"
                        title={t('list-view-type')}
                        selectedValue={t(selectedListViewTypeValue)}
                        selectedKeys={selectedListViewType}
                        onSelectionChange={(keys: any) => {
                          const viewType = Array.from(keys).join(', ');
                          setSelectedListViewType(keys);
                          listViewType.set(viewType);
                        }}
                        selectItems={listListViewType}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="select"
                        title={t('list-loading-type')}
                        selectedValue={t(selectedListLoadingTypeValue)}
                        selectedKeys={selectedListLoadingType}
                        onSelectionChange={(keys: any) => {
                          const loadingType = Array.from(keys).join(', ');
                          setSelectedListLoadingType(keys);
                          listLoadingType.set(loadingType);
                        }}
                        selectItems={listListLoadingType}
                      />
                    </Collapse>
                    <Collapse
                      title={t('experiments')}
                      subtitle={t('experiments-subtitle')}
                      css={{
                        backgroundColor: 'hsl(var(--colors-content1)) !important',
                        borderRadius: '0.75rem !important',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('play-trailer')}
                        checked={isPlayTrailer.value}
                        onChange={(e) => isPlayTrailer.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('mute-trailer')}
                        checked={isMutedTrailer.value}
                        onChange={(e) => isMutedTrailer.set(e.target.checked)}
                      />
                    </Collapse>
                  </Collapse.Group>
                </motion.div>
              </TabsContent>
              <TabsContent value="account-tab" asChild>
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
              <TabsContent value="player-tab" asChild>
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
                  <Collapse.Group splitted accordion={false} css={{ p: 0 }}>
                    <Collapse
                      title={t('defaults')}
                      subtitle={t('defaults-subtitle')}
                      css={{
                        backgroundColor: 'hsl(var(--colors-content1)) !important',
                        borderRadius: '0.75rem !important',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('mute-trailer')}
                        description={t('pic-in-pic-subtitle')}
                        checked={isPicInPic.value}
                        onChange={(e) => isPicInPic.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('muted')}
                        description={t('muted-subtitle')}
                        checked={isMuted.value}
                        onChange={(e) => isMuted.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('autoplay')}
                        description={t('autoplay-subtitle')}
                        checked={isAutoPlay.value}
                        onChange={(e) => isAutoPlay.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('loop')}
                        description={t('loop-subtitle')}
                        checked={isLoop.value}
                        onChange={(e) => isLoop.set(e.target.checked)}
                      />
                    </Collapse>
                    <Collapse
                      title={t('subtitles')}
                      subtitle={t('subtitles-subtitle')}
                      css={{
                        backgroundColor: 'hsl(var(--colors-content1)) !important',
                        borderRadius: '0.75rem !important',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('show-subtitle')}
                        description={t('show-subtitle-subtitle')}
                        checked={autoShowSubtitle.value}
                        onChange={(e) => autoShowSubtitle.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('auto-switch-subtitle')}
                        description={t('auto-switch-subtitle-subtitle')}
                        checked={autoSwitchSubtitle.value}
                        onChange={(e) => autoSwitchSubtitle.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-font-color')}
                        selectedValue={t(selectedSubtitleFontColorValue)}
                        selectedKeys={selectedSubtitleFontColor}
                        onSelectionChange={(keys: any) => {
                          const color = Array.from(keys).join(', ');
                          setSelectedSubtitleFontColor(keys);
                          currentSubtitleFontColor.set(color);
                        }}
                        selectItems={listSubtitleFontColor}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-font-size')}
                        selectedValue={t(selectedSubtitleFontSizeValue)}
                        selectedKeys={selectedSubtitleFontSize}
                        onSelectionChange={(keys: any) => {
                          const size = Array.from(keys).join(', ');
                          setSelectedSubtitleFontSize(keys);
                          currentSubtitleFontSize.set(size);
                        }}
                        selectItems={listSubtitleFontSize}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-background-color')}
                        selectedValue={t(selectedSubtitleBackgroundColorValue)}
                        selectedKeys={selectedSubtitleBackgroundColor}
                        onSelectionChange={(keys: any) => {
                          const color = Array.from(keys).join(', ');
                          setSelectedSubtitleBackgroundColor(keys);
                          currentSubtitleBackgroundColor.set(color);
                        }}
                        selectItems={listSubtitleBackgroundColor}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-background-opacity')}
                        selectedValue={t(selectedSubtitleBackgroundOpacityValue)}
                        selectedKeys={selectedSubtitleBackgroundOpacity}
                        onSelectionChange={(keys: any) => {
                          const opacity = Array.from(keys).join(', ');
                          setSelectedSubtitleBackgroundOpacity(keys);
                          currentSubtitleBackgroundOpacity.set(opacity);
                        }}
                        selectItems={listSubtitleBackgroundOpacity}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-window-color')}
                        selectedValue={t(selectedSubtitleWindowColorValue)}
                        selectedKeys={selectedSubtitleWindowColor}
                        onSelectionChange={(keys: any) => {
                          const color = Array.from(keys).join(', ');
                          setSelectedSubtitleWindowColor(keys);
                          currentSubtitleWindowColor.set(color);
                        }}
                        selectItems={listSubtitleWindowColor}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-window-opacity')}
                        selectedValue={t(selectedSubtitleWindowOpacityValue)}
                        selectedKeys={selectedSubtitleWindowOpacity}
                        onSelectionChange={(keys: any) => {
                          const opacity = Array.from(keys).join(', ');
                          setSelectedSubtitleWindowOpacity(keys);
                          currentSubtitleWindowOpacity.set(opacity);
                        }}
                        selectItems={listSubtitleWindowOpacity}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="select"
                        title={t('subtitle-text-effects')}
                        selectedValue={t(selectedSubtitleTextEffectsValue)}
                        selectedKeys={selectedSubtitleTextEffects}
                        onSelectionChange={(keys: any) => {
                          const effect = Array.from(keys).join(', ');
                          setSelectedSubtitleTextEffects(keys);
                          currentSubtitleTextEffects.set(effect);
                        }}
                        selectItems={listSubtitleTextEffects}
                      />
                    </Collapse>
                    <Collapse
                      title={t('player-features')}
                      subtitle={t('player-features-subtitle')}
                      css={{
                        backgroundColor: 'hsl(var(--colors-content1)) !important',
                        borderRadius: '0.75rem !important',
                      }}
                    >
                      <SettingBlock
                        type="switch"
                        title={t('auto-size')}
                        description={t('auto-size-subtitle')}
                        checked={isAutoSize.value}
                        onChange={(e) => isAutoSize.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('auto-mini')}
                        description={t('auto-mini-subtitle')}
                        checked={isAutoMini.value}
                        onChange={(e) => isAutoMini.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('screenshot')}
                        description={t('screenshot-subtitle')}
                        checked={isScreenshot.value}
                        onChange={(e) => isScreenshot.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('mini-progressbar')}
                        description={t('mini-progressbar-subtitle')}
                        checked={isMiniProgressbar.value}
                        onChange={(e) => isMiniProgressbar.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('auto-playback')}
                        description={t('auto-playback-subtitle')}
                        checked={isAutoPlayback.value}
                        onChange={(e) => isAutoPlayback.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('fast-forward')}
                        description={t('fast-forward-subtitle')}
                        checked={isFastForward.value}
                        onChange={(e) => isFastForward.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('auto-play-next-episode')}
                        description={t('auto-play-next-episode-subtitle')}
                        checked={isAutoPlayNextEpisode.value}
                        onChange={(e) => isAutoPlayNextEpisode.set(e.target.checked)}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="switch"
                        title={t('show-skip-op-ed-button')}
                        description={t('show-skip-op-ed-button-subtitle')}
                        checked={isShowSkipOpEdButton.value}
                        onChange={(e) => {
                          isShowSkipOpEdButton.set(e.target.checked);
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
                            <Spacer y={0.25} />
                            <SettingBlock
                              type="switch"
                              title={t('auto-skip-op-ed')}
                              description={t('auto-skip-op-ed-subtitle')}
                              checked={isAutoSkipOpEd.value}
                              onChange={(e) => isAutoSkipOpEd.set(e.target.checked)}
                            />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </Collapse>
                    <Collapse
                      title={t('keyboard')}
                      subtitle={t('keyboard-subtitle')}
                      css={{
                        backgroundColor: 'hsl(var(--colors-content1)) !important',
                        borderRadius: '0.75rem !important',
                      }}
                    >
                      <SettingBlock type="kbd" title={t('volume-up')} keys="up" />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('volume-down')} keys="down" />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('fast-rewind-5s')} keys="left" />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('fast-forward-5s')} keys="right" />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="kbd"
                        title={t('toggle-play-pause')}
                        keys={[
                          { keys: 'space', id: 'space' },
                          { key: 'K', id: 'K' },
                        ]}
                        betweenKeys={t('or')}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="kbd"
                        title={t('seek-to-start')}
                        keys={[
                          { keys: 'home', id: 'home' },
                          { key: '0', id: '0' },
                        ]}
                        betweenKeys={t('or')}
                      />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('seek-to-end')} keys="end" />
                      <Spacer y={0.25} />
                      <SettingBlock
                        type="kbd"
                        title={t('seek-to-percent')}
                        keys={[
                          { key: '1', id: '1' },
                          { key: '9', id: '9' },
                        ]}
                        betweenKeys="..."
                      />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('toggle-subtitle')} kbd="C" />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('toggle-fullscreen')} kbd="F" />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('fast-rewind-10s')} kbd="J" />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('fast-forward-10s')} kbd="L" />
                      <Spacer y={0.25} />
                      <SettingBlock type="kbd" title={t('mute-unmute')} kbd="M" />
                    </Collapse>
                  </Collapse.Group>
                </motion.div>
              </TabsContent>
              <TabsContent value="about-tab" asChild>
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
                  <div className="w-full rounded-xl bg-content1 p-5 shadow-lg shadow-neutral/10">
                    <div className="flex flex-col items-center justify-center">
                      <NextImage
                        // @ts-ignore
                        as={Image}
                        alt="About Logo"
                        title="About Logo"
                        src={LogoFooter}
                        width="76px"
                        height="76px"
                        containerCss={{ margin: 0 }}
                        css={{
                          borderRadius: '50%',
                        }}
                        loaderUrl="/api/image"
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
                        className="bg-gradient-to-tr from-primary to-secondary to-50% bg-clip-text text-3xl font-bold tracking-normal text-transparent md:text-4xl"
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
                    <h6 className="text-center !text-neutral-900">
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
