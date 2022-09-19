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
} from '@remix-run/react';
import {
  NextUIProvider,
  Text,
  Image,
  globalCss,
  createTheme,
  Link as NextLink,
} from '@nextui-org/react';
import { ThemeProvider as RemixThemesProvider } from 'next-themes';
// @ts-ignore
import swiperStyles from 'swiper/css';
// @ts-ignore
import swiperPaginationStyles from 'swiper/css/navigation';
// @ts-ignore
import swiperNavigationStyles from 'swiper/css/pagination';
import type { User } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import nProgressStyles from 'nprogress/nprogress.css';
import { useChangeLanguage } from 'remix-i18next';
import { useTranslation } from 'react-i18next';
import photoSwipeStyles from 'photoswipe/dist/photoswipe.css';
import remixImageStyles from 'remix-image/remix-image.css';

import { getListGenre } from '~/services/tmdb/tmdb.server';
import Layout from '~/src/components/layouts/Layout';
import styles from '~/styles/app.css';
import { getUser } from './services/auth.server';
import { getSession } from './services/sessions.server';
import pageNotFound from './src/assets/images/404.gif';
import i18next from './i18n/i18next.server';
import i18nCookie from './services/cookie.server';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
}

interface LoaderDataType {
  user?: User;
  locale: string;
  genresMovie: Awaited<ReturnType<typeof getListGenre>>;
  genresTv: Awaited<ReturnType<typeof getListGenre>>;
}

const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  'html, body': {
    height: '100%',
    margin: 0,
    padding: 0,
  },
});

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      backgroundTransparent: 'rgba(255, 255, 255, 0)',
    },
  },
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      backgroundTransparent: 'rgba(0, 0, 0, 0)',
    },
  },
});

const bumblebeeTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // background colors
      background: '$white',
      backgroundAlpha: 'rgba(255, 255, 255, 0.8)',
      foreground: '$black',
      backgroundContrast: '$white',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',

      // brand colors
      primaryLight: '#FBEAAB',
      primaryLightHover: '#F5D880',
      primaryLightActive: '#ECC45F',
      primaryLightContrast: '#C08921',
      primary: '#e0a82e',
      primaryBorder: '#E0A82E',
      primaryBorderHover: '#C08921',
      primarySolidHover: '#A16C17',
      primarySolidContrast: '$white',
      primaryShadow: '#E0A82E',

      secondaryLight: '#FEFAD5',
      secondaryLightHover: '#FEF4AB',
      secondaryLightActive: '#FDEC81',
      secondaryLightContrast: '#90730E',
      secondary: '#f9d72f',
      secondaryBorder: '#F9D72F',
      secondaryBorderHover: '#D6B422',
      secondarySolidHover: '#B39317',
      secondaryShadow: '#F9D72F',
    },
  },
  className: 'bumblebee-theme',
});

const autumnTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // background colors
      background: '#f1f1f1',
      backgroundAlpha: 'rgba(255, 255, 255, 0.8)',
      foreground: '$black',
      backgroundContrast: '#826A5C',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',

      // brand colors
      primaryLight: '#F39694',
      primaryLightHover: '#DC5B63',
      primaryLightActive: '#BA3148',
      primaryLightContrast: '#78022C',
      primary: '#8C0327',
      primaryBorder: '#8C0327',
      primaryBorderHover: '#78022C',
      primarySolidHover: '#64012E',
      primarySolidContrast: '$white',
      primaryShadow: '#8C0327',

      secondaryLight: '#FDE8DD',
      secondaryLightHover: '#FBCDBC',
      secondaryLightActive: '#F3A898',
      secondaryLightContrast: '#7D1932',
      secondary: '#D85251',
      secondaryBorder: '#D85251',
      secondaryBorderHover: '#B93B45',
      secondarySolidHover: '#9B283B',
      secondaryShadow: '#D85251',

      success: '#499380',
      warning: '#E97F14',
      error: '#DF1A2F',
    },
  },
  className: 'autumn-theme',
});

const retroTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      // background colors
      background: '#e2d8b3',
      backgroundAlpha: 'rgb(226, 216, 179, 0.8)',
      foreground: '$black',
      backgroundContrast: '#7d7259',
      backgroundTransparent: 'rgba(0, 0, 0, 0)',

      // brand colors
      primaryLight: '#FDE2D7',
      primaryLightHover: '#FACDC1',
      primaryLightActive: '#F5B9B0',
      primaryLightContrast: '#CD6C70',
      primary: '#ef9995',
      primaryBorder: '#EF9995',
      primaryBorderHover: '#CD6C70',
      primarySolidHover: '#AC4B57',
      primarySolidContrast: '$white',
      primaryShadow: '#EF9995',

      secondaryLight: '#F2FCF2',
      secondaryLightHover: '#E6F9E8',
      secondaryLightActive: '#D3EFD9',
      secondaryLightContrast: '#347562',
      secondary: '#a4cbb4',
      secondaryBorder: '#A4CBB4',
      secondaryBorderHover: '#77AE93',
      secondarySolidHover: '#529279',
      secondaryShadow: '#A4CBB4',

      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
    },
  },
  className: 'retro-theme',
});

const synthwaveTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      // background
      background: '#2d365f',
      backgroundAlpha: 'rgb(45, 54, 95, 0.6)',
      foreground: '#d1c7db',
      backgroundContrast: '#1F1A23',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',

      // brand colors
      primaryLight: '#FEAEC9',
      primaryLightHover: '#FC86B9',
      primaryLightActive: '#FA67B5',
      primaryLightContrast: '#D427A5',
      primary: '#f736b0',
      primaryBorder: '#F736B0',
      primaryBorderHover: '#D427A5',
      primarySolidHover: '#B11B98',
      primarySolidContrast: '$white',
      primaryShadow: '#F736B0',

      secondaryLight: '#DDFEFE',
      secondaryLightHover: '#BDF8FD',
      secondaryLightActive: '#9BEDFB',
      secondaryLightContrast: '#1C558C',
      secondary: '#58c7f3',
      secondaryBorder: '#58C7F3',
      secondaryBorderHover: '#409ED0',
      secondarySolidHover: '#2C78AE',
      secondaryShadow: '#58C7F3',

      success: '#2DB4A4',
      warning: '#DAA507',
      error: '#FA1B0F',
    },
  },
  className: 'synthwave-theme',
});

const nightTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      // background
      background: '#101729',
      backgroundAlpha: 'rgb(16, 23, 41, 0.6)',
      foreground: '$white',
      backgroundContrast: '#1E293B',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',

      // brand colors
      primaryLight: '#AFF5FE',
      primaryLightHover: '#87E8FC',
      primaryLightActive: '#69D7FA',
      primaryLightContrast: '#2894D5',
      primary: '#38bdf8',
      primaryBorder: '#38BDF8',
      primaryBorderHover: '#2894D5',
      primarySolidHover: '#1C70B2',
      primarySolidContrast: '$white',
      primaryShadow: '#38BDF8',

      secondaryLight: '#E6E9FE',
      secondaryLightHover: '#CDD3FE',
      secondaryLightActive: '#B4BCFC',
      secondaryLightContrast: '#292F8F',
      secondary: '#818CF8',
      secondaryBorder: '#818CF8',
      secondaryBorderHover: '#5E68D5',
      secondarySolidHover: '#4149B2',
      secondaryShadow: '#818CF8',

      success: '#2DB4A4',
      warning: '#DAA507',
      error: '#FA1B0F',
      text: '#b6c5f0',
    },
  },
  className: 'night-theme',
});

const draculaTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      // background
      background: '#272935',
      backgroundAlpha: 'rgb(39, 41, 53, 0.6)',
      foreground: '#f8f8f2',
      backgroundContrast: '#414558',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',

      // brand colors
      primaryLight: '#FFC9D8',
      primaryLightHover: '#FFAECC',
      primaryLightActive: '#FF9ACA',
      primaryLightContrast: '#DB58B0',
      primary: '#ff79c6',
      primaryBorder: '#FF79C6',
      primaryBorderHover: '#DB58B0',
      primarySolidHover: '#B73C9B',
      primarySolidContrast: '$white',
      primaryShadow: '#FF79C6',

      secondaryLight: '#F5E9FE',
      secondaryLightHover: '#EBD4FE',
      secondaryLightActive: '#DDBEFD',
      secondaryLightContrast: '#4A2E90',
      secondary: '#bd93f9',
      secondaryBorder: '#BD93F9',
      secondaryBorderHover: '#926BD6',
      secondarySolidHover: '#6C4AB3',
      secondaryShadow: '#BD93F9',

      success: '#50fa7b',
      warning: '#f1fa8c',
      error: '#ff5555',
    },
  },
  className: 'dracula-theme',
});

// for tailwindcss
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
  title: 'Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

const Document = ({ children, title, lang, dir }: DocumentProps) => (
  <html lang={lang} dir={dir}>
    <head>
      {title ? <title>{title}</title> : null}
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      {process.env.NODE_ENV === 'development' && <LiveReload />}
    </body>
  </html>
);

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18next.getLocale(request);
  const session = await getSession(request.headers.get('Cookie'));
  const genresMovie = await getListGenre('movie', locale);
  const genresTv = await getListGenre('tv', locale);

  if (session.has('access_token')) {
    const { user, error } = await getUser(session.get('access_token'));

    if (user && !error) {
      return json<LoaderDataType>({ user, locale, genresMovie, genresTv });
    }
  }

  return json<LoaderDataType>(
    { locale, genresMovie, genresTv },
    {
      headers: { 'Set-Cookie': await i18nCookie.serialize(locale) },
    },
  );
};

export const handle = {
  breadcrumb: () => <Link to="/">Home</Link>,
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
const App = () => {
  globalStyles();
  const outlet = useOutlet();
  const fetchers = useFetchers();
  const transition = useTransition();
  const matches: RouteMatch[] = useMatches();
  const { user, locale } = useLoaderData<LoaderDataType>();

  const { i18n } = useTranslation();
  useChangeLanguage(locale);

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

  return (
    <Document lang={locale} dir={i18n.dir()}>
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
            <Image
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
