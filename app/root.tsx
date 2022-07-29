import * as React from 'react';
import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
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
} from '@remix-run/react';
import { NextUIProvider, Text, Image, globalCss, createTheme, Link } from '@nextui-org/react';
import { ThemeProvider as RemixThemesProvider } from 'next-themes';
import swiperStyles from 'swiper/swiper.min.css';
import type { User } from '@supabase/supabase-js';
import { AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import nProgressStyles from 'nprogress/nprogress.css';
import reactTabsStyles from 'react-tabs/style/react-tabs.css';

import Layout from '~/src/components/Layout';
import styles from '~/styles/app.css';
import { getUser } from './services/auth.server';
import { getSession } from './services/sessions.server';
import pageNotFound from './src/assets/images/404.gif';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

interface LoaderDataType {
  user?: User;
}

const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
});

const lightTheme = createTheme({
  type: 'light',
  theme: {},
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {},
});

// for tailwindcss
export const links: LinksFunction = () => [
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
    href: nProgressStyles,
  },
  {
    rel: 'stylesheet',
    href: reactTabsStyles,
  },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

const Document = ({ children, title }: DocumentProps) => (
  <html lang="en">
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
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('access_token')) {
    const { user, error } = await getUser(session.get('access_token'));

    if (user && !error) {
      return json<LoaderDataType>({ user });
    }
  }

  return null;
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
const App = () => {
  globalStyles();
  const outlet = useOutlet();
  const loaderData = useLoaderData<LoaderDataType>();
  const transition = useTransition();

  const fetchers = useFetchers();

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

  return (
    <Document>
      <RemixThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <Layout user={loaderData?.user ?? undefined}>
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
              <Link href="/">Go Back</Link>
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
            <Link href="/">Go Back</Link>
          </Text>
        </NextUIProvider>
      </RemixThemesProvider>
    </Document>
  );
};

export default App;
