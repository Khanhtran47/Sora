/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useOutlet,
  useFetchers,
  useTransition,
  useMatches,
  RouteMatch,
  useLocation,
} from '@remix-run/react';
import { NextUIProvider, Text, Image as NextImage, Link as NextLink } from '@nextui-org/react';
import { ThemeProvider as RemixThemesProvider } from 'next-themes';
// @ts-ignore
import swiperStyles from 'swiper/css';
// @ts-ignore
import swiperPaginationStyles from 'swiper/css/navigation';
// @ts-ignore
import swiperNavigationStyles from 'swiper/css/pagination';
import type { User } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';
import NProgress from 'nprogress';
import nProgressStyles from 'nprogress/nprogress.css';
import { useChangeLanguage } from 'remix-i18next';
import { useTranslation } from 'react-i18next';
import photoSwipeStyles from 'photoswipe/dist/photoswipe.css';
import remixImageStyles from 'remix-image/remix-image.css';
import { MetronomeLinks } from '@metronome-sh/react';
import Image, { MimeType } from 'remix-image';

import * as gtag from '~/utils/gtags.client';
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
import { getListGenre, getListLanguages } from '~/services/tmdb/tmdb.server';
import Layout from '~/src/components/layouts/Layout';
import styles from '~/styles/app.css';
import Home from '~/src/assets/icons/HomeIcon.js';
import { getUser } from './services/auth.server';
import { getSession } from './services/sessions.server';
import pageNotFound from './src/assets/images/404.gif';
import i18next from './i18n/i18next.server';
import i18nCookie from './services/cookie.server';
import logoLoading from './src/assets/images/logo_loading.png';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
  gaTrackingId?: string;
}

interface LoaderDataType {
  user?: User;
  locale: string;
  genresMovie: Awaited<ReturnType<typeof getListGenre>>;
  genresTv: Awaited<ReturnType<typeof getListGenre>>;
  languages: Awaited<ReturnType<typeof getListLanguages>>;
  gaTrackingId: string | undefined;
}

export const links: LinksFunction = () => [
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/favicons/apple-touch-icon.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '512x512',
    href: '/favicons/android-chrome-512x512.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: '/favicons/android-chrome-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicons/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicons/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'icon', href: '/favicon.ico' },
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
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Sora - Free Movies and Free Series',
  viewport: 'width=device-width,initial-scale=1',
  description:
    'Watch Sora Online For Free! Sora is a multinational website for movies, series and anime fans. ',
  keywords:
    'Watch movies online, watch series online, watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch, watch movies, anime free to watch and download, free anime, watch anime online, watch anime, anime, watch anime online free',
  'og:type': 'website',
  'og:url': 'https://sora-movie.vervel.app',
  'og:title': 'Sora - Free Movies and Free Series',
  'og:image':
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5298bac0-b8bf-4c80-af67-725c1272dbb0/ddnbut6-17aefce2-bb77-4091-9c5d-6e0933f8e17a.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzUyOThiYWMwLWI4YmYtNGM4MC1hZjY3LTcyNWMxMjcyZGJiMFwvZGRuYnV0Ni0xN2FlZmNlMi1iYjc3LTQwOTEtOWM1ZC02ZTA5MzNmOGUxN2EuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.FOyQ7bWyeWdLg4fLDoeBhBjaxmNtQNV-MZA40AOk-4A',
  'og:image:width': '650',
  'og:image:height': '350',
  'og:description':
    'Watch Sora Online For Free! Sora is a multinational website for movies, series and anime fans - Very fast streaming - No Registration Required - Click NOW',
});

const Document = ({ children, title, lang, dir, gaTrackingId }: DocumentProps) => {
  const location = useLocation();
  React.useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);
  return (
    <html lang={lang} dir={dir}>
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <MetronomeLinks />
      </head>
      <body>
        {process.env.NODE_ENV === 'development' || !gaTrackingId ? null : (
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
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18next.getLocale(request);
  const session = await getSession(request.headers.get('Cookie'));
  const gaTrackingId = process.env.GA_TRACKING_ID;

  if (session.has('access_token')) {
    const [{ user, error }, genresMovie, genresTv, languages] = await Promise.all([
      getUser(session.get('access_token')),
      getListGenre('movie', locale),
      getListGenre('tv', locale),
      getListLanguages(),
    ]);

    if (user && !error) {
      return json<LoaderDataType>({ user, locale, genresMovie, genresTv, languages, gaTrackingId });
    }
  }

  return json<LoaderDataType>(
    {
      locale,
      genresMovie: await getListGenre('movie', locale),
      genresTv: await getListGenre('tv', locale),
      languages: await getListLanguages(),
      gaTrackingId,
    },
    {
      headers: { 'Set-Cookie': await i18nCookie.serialize(locale) },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <Link to="/">
      <Home width={16} height={16} />
    </Link>
  ),
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
const App = () => {
  globalStyles();
  const outlet = useOutlet();
  const fetchers = useFetchers();
  const transition = useTransition();
  const matches: RouteMatch[] = useMatches();
  const { user, locale, gaTrackingId } = useLoaderData<LoaderDataType>();

  const { i18n } = useTranslation();
  useChangeLanguage(locale);
  const [isLoading, setIsLoading] = React.useState(true);

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  const state = React.useMemo<'idle' | 'loading'>(() => {
    const states = [transition.state, ...fetchers.map((fetcher) => fetcher.state)];
    if (states.every((item) => item === 'idle')) return 'idle';
    return 'loading';
  }, [transition.state, fetchers]);

  React.useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === 'loading') NProgress.start();
    // when the state is idle then we can to complete the progress bar
    if (state === 'idle') NProgress.done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transition.state]);

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
    <Document lang={locale} dir={i18n.dir()} gaTrackingId={gaTrackingId}>
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
          {isLoading && (
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
                      backgroundImage: 'linear-gradient(45deg, #0072F5 -20%, #FF4ECD 50%)',
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
                  <div className="h-full w-full border-4 border-t-purple-500 border-b-purple-700 rounded-[50%]" />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <NextUIProvider>
          <Layout user={user} matches={matches}>
            <AnimatePresence exitBeforeEnter initial={false}>
              {outlet}
            </AnimatePresence>
          </Layout>
        </NextUIProvider>
      </RemixThemesProvider>
    </Document>
  );
};

// How NextUIProvider should be used on CatchBoundary
// https://remix.run/docs/en/v1/api/conventions#catchboundary
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
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <>
            <Text h1 color="warning" css={{ textAlign: 'center' }}>
              {caught.status} {caught.statusText} {message}
            </Text>
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
            <Text
              h1
              size={20}
              css={{
                textAlign: 'center',
              }}
              weight="bold"
            >
              <NextLink href="/">Go Back</NextLink>
            </Text>
          </>
        </NextUIProvider>
      </RemixThemesProvider>
    </Document>
  );
};

// How NextUIProvider should be used on ErrorBoundary
// https://remix.run/docs/en/v1/api/conventions#errorboundary
export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  const isProd = process.env.NODE_ENV === 'production';
  return (
    <Document title="Error!">
      <RemixThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <Text h1 color="error" css={{ textAlign: 'center' }}>
            {isProd
              ? 'Some thing went wrong'
              : `[ErrorBoundary]: There was an error: ${error.message}`}
          </Text>
          <Text
            h1
            size={20}
            css={{
              textAlign: 'center',
            }}
            weight="bold"
          >
            <NextLink href="/">Go Back</NextLink>
          </Text>
        </NextUIProvider>
      </RemixThemesProvider>
    </Document>
  );
};

export default App;
