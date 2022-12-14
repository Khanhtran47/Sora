/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, useLocation, useNavigate } from '@remix-run/react';
import { Container, Spacer, Dropdown, Image as NextImage, styled } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';

import useMediaQuery from '~/hooks/useMediaQuery';

import settingsTab from '~/src/constants/settings';
import languages from '~/src/constants/languages';

import AboutLogo from '~/src/components/elements/NavLink';
import { H2, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/src/components/elements/tab/Tabs';
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from '~/src/components/elements/scroll-area/ScrollArea';

import LogoFooter from '~/src/assets/images/logo_footer.png';

export const meta: MetaFunction = () => ({
  title: 'Settings',
  description: 'Settings',
  'og:title': 'Settings',
  'og:description': 'Settings',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/settings" aria-label="Settings Page">
      Settings
    </NavLink>
  ),
};

const Underline = styled(motion.div, {
  position: 'absolute',
  backgroundColor: '$primary',
});

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const rootData: { locale: string } | undefined = useRouteData('root');
  const { locale } = rootData || { locale: 'en' };
  const { t } = useTranslation('settings');
  const isSm = useMediaQuery('(max-width: 650px)');
  const [activeTab, setActiveTab] = useState('general-tab');
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
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          orientation={isSm ? 'horizontal' : 'vertical'}
          onValueChange={(value) => setActiveTab(value)}
        >
          <ScrollArea
            type="scroll"
            scrollHideDelay={100}
            css={{
              height: '100%',
              '@xsMax': {
                width: '100%',
                height: 55,
                maxWidth: 'calc(100vw - 1.5rem)',
              },
            }}
          >
            <ScrollAreaViewport>
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
                          width: '100%',
                          bottom: 0,
                        },
                      },
                      '&[data-orientation="vertical"]': {
                        '&[data-state="active"]': {
                          [`& ${Underline}`]: {
                            width: 3,
                            height: 49,
                            right: 0,
                          },
                        },
                      },
                    }}
                  >
                    {activeTab === tab.id ? (
                      <Underline className="underline" layoutId="underline" />
                    ) : null}
                    {t(tab.title)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="horizontal">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
            <ScrollAreaCorner />
          </ScrollArea>
          <AnimatePresence exitBeforeEnter>
            <TabsContent value="general-tab" asChild>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Container fluid display="flex" justify="flex-start" direction="column">
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
                <Container fluid display="flex" justify="flex-start" direction="column">
                  <H6>Panel 2</H6>
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
                <Container fluid display="flex" justify="flex-start" direction="column">
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
                <Container fluid display="flex" justify="flex-start" direction="column">
                  <H6>Panel 4</H6>
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
      </Container>
    </motion.main>
  );
};

export default Settings;
