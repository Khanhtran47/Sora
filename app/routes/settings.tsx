/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import {
  Badge,
  Collapse,
  Container,
  Dropdown,
  Link,
  Loading,
  Image as NextImage,
  Radio,
  Spacer,
  Switch,
  Tooltip,
} from '@nextui-org/react';
import { useLocalStorageValue, useMediaQuery } from '@react-hookz/web';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, useLocation, useNavigate } from '@remix-run/react';
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
import Kbd from '~/components/elements/Kbd';
import AboutLogo from '~/components/elements/NavLink';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Underline,
} from '~/components/elements/tab/Tabs';
import Flex from '~/components/styles/Flex.styles';
import { H2, H5, H6 } from '~/components/styles/Text.styles';
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
    isSwipeFullscreen,
    // sidebarStyleMode,
    sidebarMiniMode,
    sidebarHoverMode,
    sidebarBoxedMode,
    // sidebarSheetMode,
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
      className="w-full"
    >
      <Container
        fluid
        responsive={false}
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          maxWidth: '1920px',
          padding: '0 $sm',
          '@xs': {
            padding: 0,
          },
        }}
      >
        <H2 h2 css={{ '@xsMax': { fontSize: '1.75rem !important' } }}>
          {t('settings')}
        </H2>
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
                    css={{
                      position: 'relative',
                      '&[data-state="active"]': {
                        [`& ${Underline}`]: {
                          height: 4,
                          width: '50%',
                          bottom: 0,
                          left: 'unset',
                        },
                      },
                      '&[data-orientation="vertical"]': {
                        '&[data-state="active"]': {
                          [`& ${Underline}`]: {
                            width: 4,
                            height: '50%',
                            left: 0,
                            bottom: 'unset',
                          },
                        },
                      },
                    }}
                  >
                    {settingsIcon(tab.id, activeTab === tab.id)}
                    <H6 h6 css={{ color: 'inherit', marginLeft: '0.5rem' }}>
                      {t(tab.title)}
                    </H6>
                    {activeTab === tab.id ? (
                      <Underline className="underline" layoutId="underline" />
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
                    <Container
                      fluid
                      responsive={false}
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ padding: 0 }}
                    >
                      <Flex
                        direction="row"
                        justify="between"
                        align="center"
                        css={{
                          backgroundColor: '$background',
                          borderRadius: '$xs',
                          padding: '$sm',
                        }}
                      >
                        <H6>{t('language')}</H6>
                        <Dropdown isBordered>
                          <Dropdown.Button color="primary">{t(selectedLangValue)}</Dropdown.Button>
                          <Dropdown.Menu
                            aria-label="Select language"
                            color="primary"
                            selectionMode="single"
                            disallowEmptySelection
                            selectedKeys={selectedLang}
                            onSelectionChange={(keys: any) => {
                              const lang = Array.from(keys).join(', ').replaceAll('_', ' ');
                              setSelectedLang(keys);
                              navigate(`${location.pathname}?lng=${lang}`);
                            }}
                          >
                            {languages.map((lang) => (
                              <Dropdown.Item key={lang}>{t(lang)}</Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Flex>
                    </Container>
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
                  >
                    <Container
                      fluid
                      responsive={false}
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ padding: 0 }}
                    >
                      <Collapse.Group splitted accordion={false}>
                        <Collapse
                          title={t('theme')}
                          subtitle={t('theme-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
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
                              background: '$backgroundAlpha !important',
                              borderRadius: '$xs !important',
                            }}
                          >
                            <Flex
                              direction="column"
                              justify="center"
                              align="start"
                              className="gap-y-4"
                              css={{
                                backgroundColor: '$background',
                                borderRadius: '$xs',
                                padding: '$sm',
                              }}
                            >
                              <H5
                                weight="medium"
                                css={{ color: '$foreground', margin: '0.25rem 0' }}
                              >
                                {t('sidebar-mode')}
                              </H5>
                              {isMd ? null : (
                                <>
                                  <div className="flex w-full flex-row items-center justify-between gap-x-2">
                                    <H6>{t('sidebar-mini-mode')}</H6>
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
                                    <H6>{t('sidebar-hover-mode')}</H6>
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
                                <H6>{t('sidebar-boxed-mode')}</H6>
                                <Switch
                                  checked={sidebarBoxedMode.value}
                                  onChange={(e) => sidebarBoxedMode.set(e.target.checked)}
                                />
                              </div>
                              {/* <div className="flex flex-row justify-between items-center gap-x-2 w-full">
                                <H6>{t('sidebar-sheet-mode')}</H6>
                                <Switch
                                  checked={sidebarSheetMode.value}
                                  onChange={(e) => sidebarSheetMode.set(e.target.checked)}
                                />
                              </div> */}
                            </Flex>
                            {/* <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('sidebar-active-style-mode')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {selectedSidebarStyleModeValue}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select sidebar active style mode"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedSidebarStyleMode}
                                onSelectionChange={(keys: any) => {
                                  const mode = Array.from(keys).join(', ');
                                  setSelectedSidebarStyleMode(keys);
                                  sidebarStyleMode.set(mode);
                                }}
                              >
                                {listSidebarActiveStyleMode.map((mode) => (
                                  <Dropdown.Item key={mode}>{t(mode)}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex> */}
                          </Collapse>
                        )}
                        <Collapse
                          title={t('media-list-grid')}
                          subtitle={t('media-list-grid-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('list-view-type')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {t(selectedListViewTypeValue)}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select list view type"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedListViewType}
                                onSelectionChange={(keys: any) => {
                                  const viewType = Array.from(keys).join(', ');
                                  setSelectedListViewType(keys);
                                  listViewType.set(viewType);
                                }}
                              >
                                {listListViewType.map((viewType) => (
                                  <Dropdown.Item key={viewType}>{t(viewType)}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('list-loading-type')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {t(selectedListLoadingTypeValue)}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select list loading type"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedListLoadingType}
                                onSelectionChange={(keys: any) => {
                                  const loadingType = Array.from(keys).join(', ');
                                  setSelectedListLoadingType(keys);
                                  listLoadingType.set(loadingType);
                                }}
                              >
                                {listListLoadingType.map((loadingType) => (
                                  <Dropdown.Item key={loadingType}>{t(loadingType)}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                        </Collapse>
                        <Collapse
                          title={t('experiments')}
                          subtitle={t('experiments-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('play-trailer')}</H6>
                            <Switch
                              checked={isPlayTrailer.value}
                              onChange={(e) => isPlayTrailer.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('mute-trailer')}</H6>
                            <Switch
                              checked={isMutedTrailer.value}
                              onChange={(e) => isMutedTrailer.set(e.target.checked)}
                            />
                          </Flex>
                        </Collapse>
                      </Collapse.Group>
                    </Container>
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
                  >
                    <Container
                      fluid
                      responsive={false}
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ padding: 0 }}
                    >
                      <H6>Panel 3</H6>
                    </Container>
                  </motion.div>
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
                  >
                    <Container
                      fluid
                      responsive={false}
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ padding: 0 }}
                    >
                      <Collapse.Group splitted accordion={false}>
                        <Collapse
                          title={t('defaults')}
                          subtitle={t('defaults-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('pic-in-pic')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('pic-in-pic-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isPicInPic.value}
                              onChange={(e) => isPicInPic.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('muted')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('muted-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isMuted.value}
                              onChange={(e) => isMuted.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('autoplay')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('autoplay-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isAutoPlay.value}
                              onChange={(e) => isAutoPlay.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('loop')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('loop-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isLoop.value}
                              onChange={(e) => isLoop.set(e.target.checked)}
                            />
                          </Flex>
                        </Collapse>
                        <Collapse
                          title={t('subtitles')}
                          subtitle={t('subtitles-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('show-subtitle')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('show-subtitle-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={autoShowSubtitle.value}
                              onChange={(e) => autoShowSubtitle.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('subtitle-font-color')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {t(selectedSubtitleFontColorValue)}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select subtitle font color"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedSubtitleFontColor}
                                onSelectionChange={(keys: any) => {
                                  const color = Array.from(keys).join(', ');
                                  setSelectedSubtitleFontColor(keys);
                                  currentSubtitleFontColor.set(color);
                                }}
                              >
                                {listSubtitleFontColor.map((color) => (
                                  <Dropdown.Item key={color}>{t(color)}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('subtitle-font-size')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {selectedSubtitleFontSizeValue}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select subtitle font size"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedSubtitleFontSize}
                                onSelectionChange={(keys: any) => {
                                  const size = Array.from(keys).join(', ');
                                  setSelectedSubtitleFontSize(keys);
                                  currentSubtitleFontSize.set(size);
                                }}
                              >
                                {listSubtitleFontSize.map((size) => (
                                  <Dropdown.Item key={size}>{size}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('subtitle-background-color')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {t(selectedSubtitleBackgroundColorValue)}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select subtitle background color"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedSubtitleBackgroundColor}
                                onSelectionChange={(keys: any) => {
                                  const color = Array.from(keys).join(', ');
                                  setSelectedSubtitleBackgroundColor(keys);
                                  currentSubtitleBackgroundColor.set(color);
                                }}
                              >
                                {listSubtitleBackgroundColor.map((color) => (
                                  <Dropdown.Item key={color}>{t(color)}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('subtitle-background-opacity')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {selectedSubtitleBackgroundOpacityValue}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select subtitle background opacity"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedSubtitleBackgroundOpacity}
                                onSelectionChange={(keys: any) => {
                                  const opacity = Array.from(keys).join(', ');
                                  setSelectedSubtitleBackgroundOpacity(keys);
                                  currentSubtitleBackgroundOpacity.set(opacity);
                                }}
                              >
                                {listSubtitleBackgroundOpacity.map((opacity) => (
                                  <Dropdown.Item key={opacity}>{opacity}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('subtitle-window-color')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {t(selectedSubtitleWindowColorValue)}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select subtitle window color"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedSubtitleWindowColor}
                                onSelectionChange={(keys: any) => {
                                  const color = Array.from(keys).join(', ');
                                  setSelectedSubtitleWindowColor(keys);
                                  currentSubtitleWindowColor.set(color);
                                }}
                              >
                                {listSubtitleWindowColor.map((color) => (
                                  <Dropdown.Item key={color}>{t(color)}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('subtitle-window-opacity')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {selectedSubtitleWindowOpacityValue}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select subtitle window opacity"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedSubtitleWindowOpacity}
                                onSelectionChange={(keys: any) => {
                                  const opacity = Array.from(keys).join(', ');
                                  setSelectedSubtitleWindowOpacity(keys);
                                  currentSubtitleWindowOpacity.set(opacity);
                                }}
                              >
                                {listSubtitleWindowOpacity.map((opacity) => (
                                  <Dropdown.Item key={opacity}>{t(opacity)}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction={isXs ? 'column' : 'row'}
                            justify="between"
                            align={isXs ? 'start' : 'center'}
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('subtitle-text-effects')}</H6>
                            <Dropdown isBordered>
                              <Dropdown.Button color="primary">
                                {selectedSubtitleTextEffectsValue}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                aria-label="Select subtitle text effects"
                                color="primary"
                                selectionMode="single"
                                disallowEmptySelection
                                selectedKeys={selectedSubtitleTextEffects}
                                onSelectionChange={(keys: any) => {
                                  const effect = Array.from(keys).join(', ');
                                  setSelectedSubtitleTextEffects(keys);
                                  currentSubtitleTextEffects.set(effect);
                                }}
                              >
                                {listSubtitleTextEffects.map((effect) => (
                                  <Dropdown.Item key={effect}>{t(effect)}</Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Flex>
                        </Collapse>
                        <Collapse
                          title={t('player-features')}
                          subtitle={t('player-features-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('auto-size')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('auto-size-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isAutoSize.value}
                              onChange={(e) => isAutoSize.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('auto-mini')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('auto-mini-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isAutoMini.value}
                              onChange={(e) => isAutoMini.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('screenshot')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('screenshot-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isScreenshot.value}
                              onChange={(e) => isScreenshot.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('mini-progressbar')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('mini-progressbar-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isMiniProgressbar.value}
                              onChange={(e) => isMiniProgressbar.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('auto-playback')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('auto-playback-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isAutoPlayback.value}
                              onChange={(e) => isAutoPlayback.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('auto-play-next-episode')}</H6>
                              <H6 css={{ color: '$accents8' }}>
                                {t('auto-play-next-episode-subtitle')}
                              </H6>
                            </Flex>
                            <Switch
                              checked={isAutoPlayNextEpisode.value}
                              onChange={(e) => isAutoPlayNextEpisode.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('show-skip-op-ed-button')}</H6>
                              <H6 css={{ color: '$accents8' }}>
                                {t('show-skip-op-ed-button-subtitle')}
                              </H6>
                            </Flex>
                            <Switch
                              checked={isShowSkipOpEdButton.value}
                              onChange={(e) => {
                                isShowSkipOpEdButton.set(e.target.checked);
                                if (!isShowSkipOpEdButton.value) {
                                  isAutoSkipOpEd.set(false);
                                }
                              }}
                            />
                          </Flex>
                          <AnimatePresence>
                            {isShowSkipOpEdButton ? (
                              <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Spacer y={0.25} />
                                <Flex
                                  direction="row"
                                  justify="between"
                                  align="center"
                                  className="gap-x-2"
                                  css={{
                                    backgroundColor: '$background',
                                    borderRadius: '$xs',
                                    padding: '$sm',
                                  }}
                                >
                                  <Flex direction="column" justify="center" align="start">
                                    <H6>{t('auto-skip-op-ed')}</H6>
                                    <H6 css={{ color: '$accents8' }}>
                                      {t('auto-skip-op-ed-subtitle')}
                                    </H6>
                                  </Flex>
                                  <Switch
                                    checked={isAutoSkipOpEd.value}
                                    onChange={(e) => isAutoSkipOpEd.set(e.target.checked)}
                                  />
                                </Flex>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </Collapse>
                        <Collapse
                          title={t('gestures')}
                          subtitle={t('gestures-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('swipe-to-seek')}</H6>
                              <H6 css={{ color: '$accents8' }}>{t('swipe-to-seek-subtitle')}</H6>
                            </Flex>
                            <Switch
                              checked={isFastForward.value}
                              onChange={(e) => isFastForward.set(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <Flex direction="column" justify="center" align="start">
                              <H6>{t('swipe-to-fullscreen')}</H6>
                              <H6 css={{ color: '$accents8' }}>
                                {t('swipe-to-fullscreen-subtitle')}
                              </H6>
                            </Flex>
                            <Switch
                              checked={isSwipeFullscreen.value}
                              onChange={(e) => isSwipeFullscreen.set(e.target.checked)}
                            />
                          </Flex>
                        </Collapse>
                        <Collapse
                          title={t('keyboard')}
                          subtitle={t('keyboard-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('volume-up')}</H6>
                            <Kbd>↑</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('volume-down')}</H6>
                            <Kbd>↓</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('fast-rewind-5s')}</H6>
                            <Kbd>←</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('fast-forward-5s')}</H6>
                            <Kbd>→</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('toggle-play-pause')}</H6>
                            <Flex direction="row" className="gap-x-2" align="center">
                              <Kbd width="space">space</Kbd>
                              <div>{t('or')}</div>
                              <Kbd>K</Kbd>
                            </Flex>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('seek-to-start')}</H6>
                            <Flex direction="row" className="gap-x-2" align="center">
                              <Kbd>home</Kbd>
                              <div>{t('or')}</div>
                              <Kbd>0</Kbd>
                            </Flex>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('seek-to-end')}</H6>
                            <Kbd>end</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('seek-to-percent')}</H6>
                            <Flex direction="row" className="gap-x-2" align="center">
                              <Kbd>1</Kbd>
                              <div>...</div>
                              <Kbd>9</Kbd>
                            </Flex>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('toggle-subtitle')}</H6>
                            <Kbd>C</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('toggle-fullscreen')}</H6>
                            <Kbd>F</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('fast-rewind-10s')}</H6>
                            <Kbd>J</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('fast-forward-10s')}</H6>
                            <Kbd>L</Kbd>
                          </Flex>
                          <Spacer y={0.25} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="gap-x-2"
                            css={{
                              backgroundColor: '$background',
                              borderRadius: '$xs',
                              padding: '$sm',
                            }}
                          >
                            <H6>{t('mute-unmute')}</H6>
                            <Kbd>M</Kbd>
                          </Flex>
                        </Collapse>
                      </Collapse.Group>
                    </Container>
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
                  >
                    <Container
                      fluid
                      responsive={false}
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ padding: 0 }}
                    >
                      <Flex direction="column" justify="center" align="center">
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
                        <AboutLogo linkTo="/" isLogo />
                      </Flex>
                      <Spacer y={1} />
                      <Flex direction="row" justify="center" align="center" className="space-x-4">
                        <Link href="https://raw.githubusercontent.com/Khanhtran47/Sora/master/LICENSE.txt">
                          License 📜
                        </Link>
                        <Link href="#">Contact ✉️</Link>
                      </Flex>
                      <Spacer y={1} />
                      <H6 weight="semibold" css={{ textAlign: 'center' }}>
                        This site does not store any files on its server. All contents are provided
                        by non-affiliated third parties.
                      </H6>
                    </Container>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          )}
        </ClientOnly>
      </Container>
    </motion.div>
  );
};

export default Settings;
