/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, useLocation, useNavigate } from '@remix-run/react';
import {
  Container,
  Spacer,
  Dropdown,
  Image as NextImage,
  Collapse,
  Switch,
  Radio,
  Tooltip,
  Badge,
  Loading,
} from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouteData, ClientOnly } from 'remix-utils';
import Image, { MimeType } from 'remix-image';
import { useTheme } from 'next-themes';

import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';

import { settingsTab, listThemes } from '~/constants/settings';
import languages from '~/constants/languages';

import AboutLogo from '~/components/elements/NavLink';
import { H2, H6 } from '~/components/styles/Text.styles';
import Flex from '~/components/styles/Flex.styles';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Underline,
} from '~/components/elements/tab/Tabs';

import LogoFooter from '~/assets/images/logo_footer.png';
import SettingsIcon from '~/assets/icons/SettingsIcon';
import Brush from '~/assets/icons/BrushIcon';
import User from '~/assets/icons/UserIcon';
import Play from '~/assets/icons/PlayIcon';
import Info from '~/assets/icons/InfoIcon';

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
  const rootData: { locale: string } | undefined = useRouteData('root');
  const { locale } = rootData || { locale: 'en' };
  const { t } = useTranslation('settings');
  const { theme, setTheme } = useTheme();
  const isXs = useMediaQuery('(max-width: 450px)');
  const isSm = useMediaQuery('(max-width: 650px)');
  const [activeTab, setActiveTab] = useState('general-tab');
  const [isMuted, setIsMuted] = useLocalStorage('muteTrailer', true);
  const [isPlayTrailer, setIsPlayTrailer] = useLocalStorage('playTrailer', false);
  const [selectedLang, setSelectedLang] = useState(new Set([locale]));

  const selectedLangValue = useMemo(
    () => Array.from(selectedLang).join(', ').replaceAll('_', ' '),
    [selectedLang],
  );

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        fluid
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
        <Spacer y={1} />
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
                          height: 3,
                          width: '50%',
                          bottom: 0,
                          right: 'unset',
                        },
                      },
                      '&[data-orientation="vertical"]': {
                        '&[data-state="active"]': {
                          [`& ${Underline}`]: {
                            width: 3,
                            height: '50%',
                            right: 0,
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
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Container
                      fluid
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ '@smMax': { px: '$sm' } }}
                    >
                      <Flex direction="column" justify="start" align="start" className="space-y-2">
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
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Container
                      fluid
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ '@smMax': { px: '$sm' } }}
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
                        <Collapse
                          title={t('layout')}
                          subtitle={t('layout-subtitle')}
                          disabled
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <H6>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat.
                          </H6>
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
                            className="space-x-2"
                          >
                            <H6>{t('play-trailer')}</H6>
                            <Switch
                              checked={isPlayTrailer}
                              onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('mute-trailer')}</H6>
                            <Switch
                              checked={isMuted}
                              onChange={(e) => setIsMuted(e.target.checked)}
                            />
                          </Flex>
                        </Collapse>
                      </Collapse.Group>
                    </Container>
                  </motion.div>
                </TabsContent>
                <TabsContent value="account-tab" asChild>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Container
                      fluid
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ '@smMax': { px: '$sm' } }}
                    >
                      <H6>Panel 3</H6>
                    </Container>
                  </motion.div>
                </TabsContent>
                <TabsContent value="player-tab" asChild>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Container
                      fluid
                      display="flex"
                      justify="flex-start"
                      direction="column"
                      css={{ '@smMax': { px: '$sm' } }}
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
                          <H6>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat.
                          </H6>
                        </Collapse>
                        <Collapse
                          title={t('subtitles')}
                          subtitle={t('subtitles-subtitle')}
                          css={{
                            background: '$backgroundAlpha !important',
                            borderRadius: '$xs !important',
                          }}
                        >
                          <H6>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat.
                          </H6>
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
                            className="space-x-2"
                          >
                            <H6>{t('auto-size')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('pic-in-pic')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('muted')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('autoplay')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('auto-mini')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('loop')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('flip')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('playback-rate')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('aspect-ratio')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('screenshot')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('subtitle-offset')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('mini-progressbar')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('auto-playback')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('auto-play-next-episode')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('auto-skip-op-ed')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
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
                            className="space-x-2"
                          >
                            <H6>{t('swipe-to-seek')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                          <Spacer y={1} />
                          <Flex
                            direction="row"
                            justify="between"
                            align="center"
                            className="space-x-2"
                          >
                            <H6>{t('swipe-up-to-fullscreen')}</H6>
                            <Switch
                            // checked={isPlayTrailer}
                            // onChange={(e) => setIsPlayTrailer(e.target.checked)}
                            />
                          </Flex>
                        </Collapse>
                      </Collapse.Group>
                    </Container>
                  </motion.div>
                </TabsContent>
                <TabsContent value="about-tab" asChild>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Container
                      fluid
                      display="flex"
                      justify="center"
                      alignItems="center"
                      direction="row"
                      className="space-x-4"
                    >
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
                    </Container>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          )}
        </ClientOnly>
      </Container>
    </motion.main>
  );
};

export default Settings;
