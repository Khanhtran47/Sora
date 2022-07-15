import * as React from 'react';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';
import { NextUIProvider, Text, Image, createTheme } from '@nextui-org/react';
import useDarkMode from 'use-dark-mode';
import swiperStyles from 'swiper/swiper.min.css';
import Layout from '~/src/components/Layout';
import styles from '~/styles/app.css';
import pageNotFound from './src/assets/images/404.gif';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

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

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
const App = () => {
  const darkMode = useDarkMode(false);

  return (
    <Document>
      <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
        <Layout>
          <Outlet />
        </Layout>
      </NextUIProvider>
    </Document>
  );
};

// How NextUIProvider should be used on CatchBoundary
// https://remix.run/docs/en/v1/api/conventions#catchboundary
export const CatchBoundary = () => {
  const caught = useCatch();
  const darkMode = useDarkMode(false);

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
      <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
        <Layout>
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
        </Layout>
      </NextUIProvider>
    </Document>
  );
};

// How NextUIProvider should be used on ErrorBoundary
// https://remix.run/docs/en/v1/api/conventions#errorboundary
export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  const darkMode = useDarkMode(false);
  return (
    <Document title="Error!">
      <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
        <Layout>
          <Text h1 color="error" css={{ textAlign: 'center' }}>
            [ErrorBoundary]: There was an error: {error.message}
          </Text>
        </Layout>
      </NextUIProvider>
    </Document>
  );
};

export default App;
