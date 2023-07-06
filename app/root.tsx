import * as React from 'react';
import FontStyles100 from '@fontsource/inter/100.css';
import FontStyles200 from '@fontsource/inter/200.css';
import FontStyles300 from '@fontsource/inter/300.css';
import FontStyles400 from '@fontsource/inter/400.css';
import FontStyles500 from '@fontsource/inter/500.css';
import FontStyles600 from '@fontsource/inter/600.css';
import FontStyles700 from '@fontsource/inter/700.css';
import FontStyles800 from '@fontsource/inter/800.css';
import FontStyles900 from '@fontsource/inter/900.css';
import { Button } from '@nextui-org/button';
import { Image as NextUIImage } from '@nextui-org/image';
import { NextUIProvider as NextUIv2Provider } from '@nextui-org/system';
import { cssBundleHref } from '@remix-run/css-bundle';
import { json, type LinksFunction, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Scripts,
  useFetchers,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider as RemixThemesProvider } from 'next-themes';
import NProgress from 'nprogress';
import photoSwipeStyles from 'photoswipe/dist/photoswipe.css';
import { getSelectorsByUserAgent } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer';
import { useChangeLanguage } from 'remix-i18next';
import Image, { MimeType } from 'remix-image';
import { getClientIPAddress, getClientLocales, useHydrated } from 'remix-utils';
import { toast } from 'sonner';
// @ts-ignore
import swiperStyles from 'swiper/css';
// @ts-ignore
import swiperAutoPlayStyles from 'swiper/css/autoplay';
// @ts-ignore
import swiperFreeModeStyles from 'swiper/css/free-mode';
// @ts-ignore
import swiperPaginationStyles from 'swiper/css/navigation';
// @ts-ignore
import swiperNavigationStyles from 'swiper/css/pagination';
// @ts-ignore
import swiperThumbsStyles from 'swiper/css/thumbs';

import Home from './assets/icons/HomeIcon';
import Refresh from './assets/icons/RefreshIcon';
import pageNotFound from './assets/images/404.gif';
import logoLoading from './assets/images/logo_loading.png';
import { BreadcrumbItem } from './components/elements/Breadcrumb';
import Layout from './components/layouts/Layout';
import nProgressStyles from './components/styles/nprogress.css';
import { listThemes } from './constants/settings';
import { useIsBot } from './context/isbot.context';
import { i18nCookie, i18next } from './services/i18n';
import { getUserFromCookie } from './services/supabase';
import { getListGenre, getListLanguages } from './services/tmdb/tmdb.server';
import tailwindStylesheetUrl from './styles/tailwind.css';
import * as gtag from './utils/client/gtags.client';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const themeValues = {
  light: 'light',
  dark: 'dark',
  'light-red': 'light-red',
  'light-yellow': 'light-yellow',
  'light-green': 'light-green',
  'light-cyan': 'light-cyan',
  'light-purple': 'light-purple',
  'light-pink': 'light-pink',
  'dark-red': 'dark-red',
  'dark-yellow': 'dark-yellow',
  'dark-green': 'dark-green',
  'dark-cyan': 'dark-cyan',
  'dark-purple': 'dark-purple',
  'dark-pink': 'dark-pink',
  cupcake: 'cupcake',
  bumblebee: 'bumblebee',
  emerald: 'emerald',
  corporate: 'corporate',
  synthwave: 'synthwave',
  retro: 'retro',
  cyberpunk: 'cyberpunk',
  valentine: 'valentine',
  halloween: 'halloween',
  garden: 'garden',
  forest: 'forest',
  aqua: 'aqua',
  lofi: 'lofi',
  pastel: 'pastel',
  fantasy: 'fantasy',
  wireframe: 'wireframe',
  luxury: 'luxury',
  dracula: 'dracula',
  cmyk: 'cmyk',
  autumn: 'autumn',
  business: 'business',
  acid: 'acid',
  lemonade: 'lemonade',
  night: 'night',
  coffee: 'coffee',
  winter: 'winter',
};

export const links: LinksFunction = () => {
  return [
    { rel: 'manifest', href: '/resources/manifest-v0.0.1.json' },
    { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
    // Preload CSS as a resource to avoid render blocking
    {
      rel: 'preload',
      as: 'style',
      href: tailwindStylesheetUrl,
    },
    ...(cssBundleHref ? [{ rel: 'preload', as: 'style', href: cssBundleHref }] : []),
    { rel: 'preload', as: 'style', href: FontStyles100 },
    { rel: 'preload', as: 'style', href: FontStyles200 },
    { rel: 'preload', as: 'style', href: FontStyles300 },
    { rel: 'preload', as: 'style', href: FontStyles400 },
    { rel: 'preload', as: 'style', href: FontStyles500 },
    { rel: 'preload', as: 'style', href: FontStyles600 },
    { rel: 'preload', as: 'style', href: FontStyles700 },
    { rel: 'preload', as: 'style', href: FontStyles800 },
    { rel: 'preload', as: 'style', href: FontStyles900 },
    { rel: 'stylesheet', href: tailwindStylesheetUrl },
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
    { rel: 'stylesheet', href: swiperStyles },
    { rel: 'stylesheet', href: swiperPaginationStyles },
    { rel: 'stylesheet', href: swiperNavigationStyles },
    { rel: 'stylesheet', href: swiperThumbsStyles },
    { rel: 'stylesheet', href: swiperAutoPlayStyles },
    { rel: 'stylesheet', href: swiperFreeModeStyles },
    { rel: 'stylesheet', href: nProgressStyles },
    { rel: 'stylesheet', href: photoSwipeStyles },
    { rel: 'stylesheet', href: FontStyles100 },
    { rel: 'stylesheet', href: FontStyles200 },
    { rel: 'stylesheet', href: FontStyles300 },
    { rel: 'stylesheet', href: FontStyles400 },
    { rel: 'stylesheet', href: FontStyles500 },
    { rel: 'stylesheet', href: FontStyles600 },
    { rel: 'stylesheet', href: FontStyles700 },
    { rel: 'stylesheet', href: FontStyles800 },
    { rel: 'stylesheet', href: FontStyles900 },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: 'Sora - Free Movies and Free Series',
    description:
      'Watch Sora Online For Free! Sora is a multinational website for movies, series and anime fans. ',
    keywords:
      'Sora, Sora movie, sora movies, Watch movies online, watch series online, watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, watch movies, anime free to watch and download, free anime, watch anime online, watch anime, anime, watch anime online free, watch anime free, watchsub',
    'og:type': 'website',
    'og:site_name': 'Sora',
    'og:url': 'https://sorachill.vercel.app',
    'og:title': 'Sora - Free Movies and Free Series',
    'og:image': 'https://sorachill.vercel.app/api/ogimage?it=home',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:description':
      'Watch Sora Online For Free! Sora is a multinational website for movies, series and anime fans - Very fast streaming - Click NOW',
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
        RESPONSIVE_IMAGES: process.env.RESPONSIVE_IMAGES,
        IMAGE_PROXY: process.env.IMAGE_PROXY,
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
    <BreadcrumbItem to="/" key="home">
      <Home width={16} height={16} />
    </BreadcrumbItem>
  ),
};

function useLoadingIndicator() {
  const navigation = useNavigation();

  const fetchers = useFetchers();
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
}

let isMount = true;

const Document = ({ children, title }: DocumentProps) => {
  const location = useLocation();
  const matches = useMatches();
  const { locale, gaTrackingId, ENV } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  const isBot = useIsBot();
  const isHydrated = useHydrated();
  useLoadingIndicator();
  const color = React.useMemo(() => {
    if (isHydrated) {
      return getComputedStyle(document.documentElement).getPropertyValue(
        '--theme-background-title-bar',
      );
    }
    return '0 0 0';
  }, [isHydrated]);

  React.useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

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
    <html lang={locale} dir={i18n.dir()} suppressHydrationWarning>
      <head>
        {title ? <title>{title}</title> : null}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="darkreader-lock" content="disable darkreader" />
        <meta name="msvalidate.01" content="1445DD7580898781011249BF246A21AD" />
        <meta name="theme-color" content={`hsl(${color})`} />
        <Meta />
        <Links />
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
  const isHydrated = useHydrated();
  const { user, locale } = useLoaderData<typeof loader>();
  const isBot = useIsBot();
  useChangeLanguage(locale);
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

  return (
    <Document>
      <WrapBalancerProvider>
        <RemixThemesProvider
          defaultTheme="system"
          attribute="class"
          enableColorScheme
          enableSystem
          themes={listThemes}
          value={themeValues}
        >
          <AnimatePresence>
            {!isHydrated && process.env.NODE_ENV !== 'development' && !isBot ? (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed left-0 top-0 z-[9999] block h-full w-full bg-background"
              >
                <div className="relative top-1/2 m-auto mt-[-77px] block h-0 w-0">
                  <div className="mb-5 flex	items-center justify-center">
                    <Image
                      width="100px"
                      height="100px"
                      className="mr-5 rounded-full"
                      title="Logo Loading"
                      alt="Logo Loading"
                      src={logoLoading}
                      placeholder="empty"
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
                    <h1 className="bg-gradient-to-tr from-secondary to-primary to-50% bg-clip-text !text-3xl font-bold tracking-normal text-transparent md:!text-5xl">
                      SORA
                    </h1>
                  </div>
                  <div className="h-9 w-9 animate-spin">
                    <div className="h-full w-full rounded-[50%] border-4 border-y-primary" />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <NextUIv2Provider>
            <Layout user={user} />
          </NextUIv2Provider>
        </RemixThemesProvider>
      </WrapBalancerProvider>
    </Document>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  const isProd = process.env.NODE_ENV === 'production';

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = isProd
          ? 'Oops! Looks like you tried to visit a page that you do not have access to.'
          : error.data;
        break;
      case 404:
        message = isProd
          ? 'Oops! Looks like you tried to visit a page that does not exist.'
          : error.data;
        break;
      default:
        throw new Error(error.data || error.statusText);
    }
    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <RemixThemesProvider
          defaultTheme="system"
          attribute="class"
          enableColorScheme
          enableSystem
          themes={listThemes}
          value={themeValues}
        >
          <div className="flex h-screen flex-col items-center justify-center gap-y-4">
            <NextUIImage width={480} src={pageNotFound} alt="404" className="object-cover" />
            <h1 className="text-center text-warning">
              {error.status} {error.statusText}
            </h1>
            <p>{message}</p>
            <div className="flex w-full flex-row items-center justify-center gap-x-4">
              <Button
                size="md"
                variant="ghost"
                color="success"
                startContent={<Home />}
                type="button"
                onPress={() => {
                  window.location.href = '/';
                }}
              >
                Back to Home
              </Button>
              <Button
                size="md"
                variant="ghost"
                color="warning"
                startContent={<Refresh filled />}
                type="button"
                onPress={() => {
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </RemixThemesProvider>
      </Document>
    );
  } else if (error instanceof Error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return (
      <Document title="Error!">
        <RemixThemesProvider
          defaultTheme="system"
          attribute="class"
          enableColorScheme
          enableSystem
          themes={listThemes}
          value={themeValues}
        >
          <div className="flex h-screen flex-col items-center justify-center gap-y-4">
            <NextUIImage width={480} src={pageNotFound} alt="404" className="object-cover" />
            <h1 className="text-center text-danger">There was an error</h1>
            <p>{error.message}</p>
            <div className="flex w-full flex-row items-center justify-center gap-x-4">
              <Button
                size="md"
                variant="ghost"
                color="success"
                startContent={<Home />}
                type="button"
                onPress={() => {
                  window.location.href = '/';
                }}
              >
                Back to Home
              </Button>
              <Button
                size="md"
                variant="ghost"
                color="warning"
                startContent={<Refresh filled />}
                type="button"
                onPress={() => {
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </RemixThemesProvider>
      </Document>
    );
  } else {
    return (
      <Document title="Error!">
        <RemixThemesProvider
          defaultTheme="system"
          attribute="class"
          enableColorScheme
          enableSystem
          themes={listThemes}
          value={themeValues}
        >
          <div className="flex h-screen flex-col items-center justify-center gap-y-4">
            <NextUIImage width={480} src={pageNotFound} alt="404" className="object-cover" />
            <h1 className="text-center text-danger">Unknown error</h1>
            <div className="flex w-full flex-row items-center justify-center gap-x-4">
              <Button
                size="md"
                variant="ghost"
                color="success"
                startContent={<Home />}
                type="button"
                onPress={() => {
                  window.location.href = '/';
                }}
              >
                Back to Home
              </Button>
              <Button
                size="md"
                variant="ghost"
                color="warning"
                startContent={<Refresh filled />}
                type="button"
                onPress={() => {
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </RemixThemesProvider>
      </Document>
    );
  }
}

export default App;
