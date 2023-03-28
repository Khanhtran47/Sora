/* eslint-disable react/no-danger */
import * as React from 'react';
import type { LinksFunction, MetaFunction, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  NavLink,
  Links,
  LiveReload,
  Meta,
  Scripts,
  useCatch,
  useLoaderData,
  useOutlet,
  useFetchers,
  useNavigation,
  useMatches,
  useLocation,
} from '@remix-run/react';
import { NextUIProvider, Text, Image as NextImage, Badge, useSSR, Button } from '@nextui-org/react';
import { ThemeProvider as RemixThemesProvider } from 'next-themes';
// @ts-ignore
import swiperStyles from 'swiper/css';
// @ts-ignore
import swiperPaginationStyles from 'swiper/css/navigation';
// @ts-ignore
import swiperNavigationStyles from 'swiper/css/pagination';
// @ts-ignore
import swiperThumbsStyles from 'swiper/css/thumbs';
// @ts-ignore
import swiperAutoPlayStyles from 'swiper/css/autoplay';
import { AnimatePresence, motion } from 'framer-motion';
import NProgress from 'nprogress';
import { useChangeLanguage } from 'remix-i18next';
import { useTranslation } from 'react-i18next';
import photoSwipeStyles from 'photoswipe/dist/photoswipe.css';
import remixImageStyles from 'remix-image/remix-image.css';
import Image, { MimeType } from 'remix-image';
import { getSelectorsByUserAgent } from 'react-device-detect';
import FontStyles100 from '@fontsource/inter/100.css';
import FontStyles200 from '@fontsource/inter/200.css';
import FontStyles300 from '@fontsource/inter/300.css';
import FontStyles400 from '@fontsource/inter/400.css';
import FontStyles500 from '@fontsource/inter/500.css';
import FontStyles600 from '@fontsource/inter/600.css';
import FontStyles700 from '@fontsource/inter/700.css';
import FontStyles800 from '@fontsource/inter/800.css';
import FontStyles900 from '@fontsource/inter/900.css';
import { Toaster, toast } from 'sonner';

import i18next, { i18nCookie } from '~/i18n/i18next.server';
import * as gtag from '~/utils/client/gtags.client';
import { getListGenre, getListLanguages } from '~/services/tmdb/tmdb.server';
import { getUserFromCookie } from '~/services/supabase';

import { ClientStyleContext } from '~/context/client.context';
import { useIsBot } from '~/context/isbot.context';

import globalStyles from '~/styles/global.stitches';
import {
  lightTheme,
  darkTheme,
  bumblebeeTheme,
  autumnTheme,
  retroTheme,
  synthwaveTheme,
  nightTheme,
  draculaTheme,
} from '~/styles/nextui.config';
import styles from '~/styles/tailwind.css';
import nProgressStyles from '~/components/styles/nprogress.css';

import Layout from '~/components/layouts/Layout';
import Flex from '~/components/styles/Flex.styles';

import Home from '~/assets/icons/HomeIcon';
import Refresh from '~/assets/icons/RefreshIcon';
import pageNotFound from '~/assets/images/404.gif';
import logoLoading from '~/assets/images/logo_loading.png';
import { getClientIPAddress, getClientLocales } from 'remix-utils';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
  gaTrackingId?: string;
  ENV?: any;
}

export const links: LinksFunction = () => [
  { rel: 'manifest', href: '/resources/manifest-v0.0.1.json' },
  { rel: 'icon', href: '/favicon.ico' },
  {
    rel: 'preload',
    as: 'style',
    href: styles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: swiperStyles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: swiperPaginationStyles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: swiperNavigationStyles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: swiperThumbsStyles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: swiperAutoPlayStyles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: nProgressStyles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: photoSwipeStyles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: remixImageStyles,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles100,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles200,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles300,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles400,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles500,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles600,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles700,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles800,
  },
  {
    rel: 'preload',
    as: 'style',
    href: FontStyles900,
  },
  {
    rel: 'stylesheet',
    href: styles,
  },
  {
    rel: 'stylesheet',
    href: swiperStyles,
  },
  {
    rel: 'stylesheet',
    href: swiperPaginationStyles,
  },
  {
    rel: 'stylesheet',
    href: swiperNavigationStyles,
  },
  {
    rel: 'stylesheet',
    href: swiperThumbsStyles,
  },
  {
    rel: 'stylesheet',
    href: swiperAutoPlayStyles,
  },
  {
    rel: 'stylesheet',
    href: nProgressStyles,
  },
  {
    rel: 'stylesheet',
    href: photoSwipeStyles,
  },
  {
    rel: 'stylesheet',
    href: remixImageStyles,
  },
  {
    rel: 'stylesheet',
    href: FontStyles100,
  },
  {
    rel: 'stylesheet',
    href: FontStyles200,
  },
  {
    rel: 'stylesheet',
    href: FontStyles300,
  },
  {
    rel: 'stylesheet',
    href: FontStyles400,
  },
  {
    rel: 'stylesheet',
    href: FontStyles500,
  },
  {
    rel: 'stylesheet',
    href: FontStyles600,
  },
  {
    rel: 'stylesheet',
    href: FontStyles700,
  },
  {
    rel: 'stylesheet',
    href: FontStyles800,
  },
  {
    rel: 'stylesheet',
    href: FontStyles900,
  },
];

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isBrowser } = useSSR();
  if (isBrowser) {
    const color = getComputedStyle(document.documentElement).getPropertyValue(
      '--nextui-colors-primary',
    );
    return {
      charset: 'utf-8',
      title: 'Sora - Free Movies and Free Series',
      viewport: 'width=device-width,initial-scale=1',
      description:
        'Watch Sora Online For Free! Sora is a multinational website for movies, series and anime fans. ',
      keywords:
        'Sora, Sora movie, sora movies, Watch movies online, watch series online, watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, watch movies, anime free to watch and download, free anime, watch anime online, watch anime, anime, watch anime online free, watch anime free, watchsub',
      'theme-color': color,
      'og:type': 'website',
      'og:site_name': 'Sora',
      'og:url': 'https://sora-anime.vercel.app',
      'og:title': 'Sora - Free Movies and Free Series',
      'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=home',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:description':
        'Watch Sora Online For Free! Sora is a multinational website for movies, series and anime fans - Very fast streaming - Click NOW',
      'msvalidate.01': '1445DD7580898781011249BF246A21AD',
    };
  }
  return {
    charset: 'utf-8',
    title: 'Sora - Free Movies and Free Series',
    viewport: 'width=device-width,initial-scale=1',
    description:
      'Watch Sora Online For Free! Sora is a multinational website for movies, series and anime fans. ',
    keywords:
      'Sora, Sora movie, sora movies, Watch movies online, watch series online, watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, watch movies, anime free to watch and download, free anime, watch anime online, watch anime, anime, watch anime online free, watch anime free, watchsub',
    'og:type': 'website',
    'og:site_name': 'Sora',
    'og:url': 'https://sora-anime.vercel.app',
    'og:title': 'Sora - Free Movies and Free Series',
    'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=home',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:description':
      'Watch Sora Online For Free! Sora is a multinational website for movies, series and anime fans - Very fast streaming - Click NOW',
    'msvalidate.01': '1445DD7580898781011249BF246A21AD',
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const gaTrackingId = process.env.GA_TRACKING_ID;
  const user = await getUserFromCookie(request.headers.get('Cookie') || '');
  const deviceDetect = getSelectorsByUserAgent(request.headers.get('User-Agent') || '');
  const ipAddress = getClientIPAddress(request);
  const locales = getClientLocales(request);
  const nowDate = new Date();
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const headers = new Headers({
    'Set-Cookie': await i18nCookie.serialize(locale),
  });

  return json(
    {
      user: user || undefined,
      locale,
      genresMovie: await getListGenre('movie', locale),
      genresTv: await getListGenre('tv', locale),
      languages: await getListLanguages(),
      gaTrackingId,
      deviceDetect,
      ENV: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
      },
      ipAddress,
      locales,
      nowDate: formatter.format(nowDate),
    },
    { headers },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/" aria-label="Home Page">
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
          <Home width={16} height={16} />
        </Badge>
      )}
    </NavLink>
  ),
};

let isMount = true;

const Document = ({ children, title, lang, dir, gaTrackingId, ENV }: DocumentProps) => {
  const location = useLocation();
  const matches = useMatches();
  const clientStyleData = React.useContext(ClientStyleContext);
  const isBot = useIsBot();

  /**
   * It takes an object and returns a clone of that object, using for deleting handlers in matches.
   * @param {T} obj - T - The object to be cloned.
   * @returns A clone of the object.
   */
  function cloneObject<T>(obj: T): T {
    const clone: T = {} as T;
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] != null) {
        if (`${obj[key]}` === '[object Window]') {
          delete obj[key];
          // eslint-disable-next-line no-continue
          continue;
        }
        clone[key] = cloneObject(obj[key]);
      } else clone[key] = obj[key];
    }
    return clone;
  }

  // Only executed on client
  React.useEffect(() => {
    // reset cache to re-apply global styles
    clientStyleData.reset();
  }, [clientStyleData]);

  React.useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  React.useEffect(() => {
    const mounted = isMount;
    isMount = false;
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage(
          JSON.stringify(
            cloneObject({
              type: 'REMIX_NAVIGATION',
              isMount: mounted,
              location,
              matches,
              manifest: window.__remixManifest,
            }),
          ),
        );
      } else {
        const listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage(
            JSON.stringify(
              cloneObject({
                type: 'REMIX_NAVIGATION',
                isMount: mounted,
                location,
                matches,
                manifest: window.__remixManifest,
              }),
            ),
          );
        };
        navigator.serviceWorker.addEventListener('controllerchange', listener);
        return () => {
          navigator.serviceWorker.removeEventListener('controllerchange', listener);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <html lang={lang} dir={dir}>
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: clientStyleData.sheet }}
          suppressHydrationWarning
        />
      </head>
      <body>
        {process.env.NODE_ENV === 'development' || !gaTrackingId || isBot ? null : (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`} />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${gaTrackingId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({
              env: ENV,
            })}`,
          }}
        />
        {children}
        {isBot ? null : <Scripts />}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  );
};

const App = () => {
  globalStyles();
  const outlet = useOutlet();
  const fetchers = useFetchers();
  const navigation = useNavigation();
  const { user, locale, gaTrackingId, ENV } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  const isBot = useIsBot();
  useChangeLanguage(locale);
  const [isLoading, setIsLoading] = React.useState(true);
  const [waitingWorker, setWaitingWorker] = React.useState<ServiceWorker | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = React.useState(false);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setIsUpdateAvailable(false);
    window.location.reload();
  };
  const detectSWUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration) {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                setWaitingWorker(newWorker);
                setIsUpdateAvailable(true);
              }
            });
          }
        });
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setIsUpdateAvailable(true);
        }
      }
    }
  };

  React.useEffect(() => {
    detectSWUpdate();
  }, []);

  React.useEffect(() => {
    if (isUpdateAvailable) {
      toast.success('Update Available', {
        description: 'A new version of Sora is available.',
        action: {
          label: 'Update',
          onClick: () => reloadPage(),
        },
        duration: Infinity,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateAvailable]);

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  const state = React.useMemo<'idle' | 'loading'>(() => {
    const states = [navigation.state, ...fetchers.map((fetcher) => fetcher.state)];
    if (states.every((item) => item === 'idle')) return 'idle';
    return 'loading';
  }, [navigation.state, fetchers]);

  React.useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === 'loading') NProgress.configure({ showSpinner: false }).start();
    // when the state is idle then we can to complete the progress bar
    if (state === 'idle') NProgress.configure({ showSpinner: false }).done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation.state]);

  React.useEffect(() => {
    const theme = localStorage.getItem('theme');
    const d = document.documentElement;
    if (theme === 'synthwave' || theme === 'dracula' || theme === 'night') {
      d.style.colorScheme = 'dark';
    }
  }, []);

  React.useEffect(() => {
    if (state === 'idle') setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const size = 35;

  return (
    <Document lang={locale} dir={i18n.dir()} gaTrackingId={gaTrackingId} ENV={ENV}>
      <RemixThemesProvider
        defaultTheme="system"
        attribute="class"
        enableColorScheme
        enableSystem
        themes={['light', 'dark', 'bumblebee', 'synthwave', 'retro', 'dracula', 'autumn', 'night']}
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
          bumblebee: bumblebeeTheme.className,
          synthwave: synthwaveTheme.className,
          retro: retroTheme.className,
          dracula: draculaTheme.className,
          autumn: autumnTheme.className,
          night: nightTheme.className,
        }}
      >
        <AnimatePresence>
          {isLoading && process.env.NODE_ENV !== 'development' && !isBot ? (
            <div
              className="w-full h-full fixed block top-0 left-0"
              style={{ zIndex: '9999', backgroundColor: 'var(--nextui-colors-background)' }}
            >
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="top-1/2 my-auto mx-auto block relative w-0 h-0"
                style={{ marginTop: '-77px' }}
              >
                <div className="flex justify-center	items-center mb-5">
                  <Image
                    width="100px"
                    height="100px"
                    className="rounded-full mr-5"
                    loaderUrl="/api/image"
                    title="Logo Loading"
                    alt="Logo Loading"
                    src={logoLoading}
                    placeholder="blur"
                    responsive={[
                      {
                        size: {
                          width: 100,
                          height: 100,
                        },
                      },
                    ]}
                    dprVariants={[1, 3]}
                    options={{
                      contentType: MimeType.WEBP,
                    }}
                  />
                  <h1
                    style={{
                      fontSize: '48px !important',
                      margin: 0,
                      fontWeight: 600,
                      backgroundImage:
                        'linear-gradient(45deg, var(--nextui-colors-primary), var(--nextui-colors-secondary) 50%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: 'monospace',
                      letterSpacing: '.3rem',
                      textDecoration: 'none',
                    }}
                  >
                    SORA
                  </h1>
                </div>
                <div style={{ width: `${size}px`, height: `${size}px` }} className="animate-spin">
                  <div className="h-full w-full border-4 border-t-primary border-b-primary rounded-[50%]" />
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
        <NextUIProvider>
          <Layout user={user}>
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  // @ts-ignore
                  '--normal-bg': 'var(--nextui-colors-backgroundContrast)',
                  '--normal-text': 'var(--nextui-colors-text)',
                  '--normal-border': 'var(--nextui-colors-border)',
                  '--success-bg': 'var(--nextui-colors-backgroundContrast)',
                  '--success-border': 'var(--nextui-colors-border)',
                  '--success-text': 'var(--nextui-colors-success)',
                  '--error-bg': 'var(--nextui-colors-backgroundContrast)',
                  '--error-border': 'var(--nextui-colors-border)',
                  '--error-text': 'var(--nextui-colors-error)',
                  '--gray1': 'var(--nextui-colors-accents0)',
                  '--gray2': 'var(--nextui-colors-accents1)',
                  '--gray4': 'var(--nextui-colors-accents3)',
                  '--gray5': 'var(--nextui-colors-accents4)',
                  '--gray12': 'var(--nextui-colors-accents9)',
                },
              }}
            />
            <AnimatePresence exitBeforeEnter initial={false}>
              {outlet}
            </AnimatePresence>
          </Layout>
        </NextUIProvider>
      </RemixThemesProvider>
    </Document>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
      break;
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <RemixThemesProvider
        defaultTheme="system"
        attribute="class"
        enableColorScheme
        enableSystem
        themes={['light', 'dark', 'bumblebee', 'synthwave', 'retro', 'dracula', 'autumn', 'night']}
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
          bumblebee: bumblebeeTheme.className,
          synthwave: synthwaveTheme.className,
          retro: retroTheme.className,
          dracula: draculaTheme.className,
          autumn: autumnTheme.className,
          night: nightTheme.className,
        }}
      >
        <NextUIProvider>
          <Flex
            direction="column"
            justify="center"
            align="center"
            className="space-y-4"
            css={{ height: '100vh' }}
          >
            <NextImage
              autoResize
              width={480}
              src={pageNotFound}
              alt="404"
              objectFit="cover"
              css={{
                marginTop: '20px',
              }}
            />
            <Text h1 color="warning" css={{ textAlign: 'center' }}>
              {caught.status} {caught.statusText} {message}
            </Text>
            <Flex direction="row" align="center" justify="center" className="w-full space-x-4">
              <Button
                auto
                ghost
                onPress={() => {
                  window.location.href = '/';
                }}
                color="success"
                icon={<Home />}
                type="button"
              >
                Back to Home
              </Button>
              <Button
                auto
                ghost
                onPress={() => {
                  window.location.reload();
                }}
                color="warning"
                icon={<Refresh filled />}
                type="button"
              >
                Reload Page
              </Button>
            </Flex>
          </Flex>
        </NextUIProvider>
      </RemixThemesProvider>
    </Document>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production' && process.env.DEPLOY_ENV === 'production';
  console.log(error);
  return (
    <Document title="Error!">
      <RemixThemesProvider
        defaultTheme="system"
        attribute="class"
        enableColorScheme
        enableSystem
        themes={['light', 'dark', 'bumblebee', 'synthwave', 'retro', 'dracula', 'autumn', 'night']}
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
          bumblebee: bumblebeeTheme.className,
          synthwave: synthwaveTheme.className,
          retro: retroTheme.className,
          dracula: draculaTheme.className,
          autumn: autumnTheme.className,
          night: nightTheme.className,
        }}
      >
        <NextUIProvider>
          <Flex
            direction="column"
            justify="center"
            align="center"
            className="space-y-4"
            css={{ height: '100vh' }}
          >
            <NextImage
              autoResize
              width={480}
              src={pageNotFound}
              alt="404"
              objectFit="cover"
              css={{
                marginTop: '20px',
              }}
            />
            <Text h1 color="error" css={{ textAlign: 'center' }}>
              {isProd
                ? 'Some thing went wrong'
                : `[ErrorBoundary]: There was an error: ${error.message}`}
            </Text>
            <Flex direction="row" align="center" justify="center" className="w-full space-x-4">
              <Button
                auto
                ghost
                onPress={() => {
                  window.location.href = '/';
                }}
                color="success"
                icon={<Home />}
                type="button"
              >
                Back to Home
              </Button>
              <Button
                auto
                ghost
                onPress={() => {
                  window.location.reload();
                }}
                color="warning"
                icon={<Refresh filled />}
                type="button"
              >
                Reload Page
              </Button>
            </Flex>
          </Flex>
        </NextUIProvider>
      </RemixThemesProvider>
    </Document>
  );
};

export default App;
