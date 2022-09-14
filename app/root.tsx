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
import swiperStyles from 'swiper/swiper.min.css';
import swiperPaginationStyles from 'swiper/components/pagination/pagination.min.css';
import swiperNavigationStyles from 'swiper/components/navigation/navigation.min.css';
import type { User } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import nProgressStyles from 'nprogress/nprogress.css';
import { useChangeLanguage } from 'remix-i18next';
import { useTranslation } from 'react-i18next';
import photoSwipeStyles from 'photoswipe/dist/photoswipe.css';
import remixImageStyles from 'remix-image/remix-image.css';

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

const greenTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      // brand colors
      primaryLight: '$green200',
      primaryLightHover: '$green300',
      primaryLightActive: '$green400',
      primaryLightContrast: '$green600',
      primary: '#4ADE7B',
      primaryBorder: '$green500',
      primaryBorderHover: '$green600',
      primarySolidHover: '$green700',
      primarySolidContrast: '$white',
      primaryShadow: '$green500',

      backgroundTransparent: 'rgba(255, 255, 255, 0)',
    },
  },
  className: 'green-theme',
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

  if (session.has('access_token')) {
    const { user, error } = await getUser(session.get('access_token'));

    if (user && !error) {
      return json<LoaderDataType>({ user, locale });
    }
  }

  return json<LoaderDataType>(
    { locale },
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
    if (theme === 'green') {
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
        themes={['light', 'dark', 'green']}
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
          green: greenTheme.className,
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
