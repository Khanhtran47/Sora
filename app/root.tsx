import * as React from 'react';
import type { LinksFunction, MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from '@remix-run/react';
import { NextUIProvider, Text } from '@nextui-org/react';
import swiperStyles from 'swiper/swiper.min.css';
import Layout from './src/components/Layout';
import styles from './styles/app.css';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

// for tailwindcss
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: swiperStyles },
];

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = () =>
  json({
    ENV: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
  });

const Document = ({ children, title }: DocumentProps) => {
  const data = useLoaderData();

  return (
    <html lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
const App = () => (
  <Document>
    <NextUIProvider>
      <Layout>
        <Outlet />
      </Layout>
    </NextUIProvider>
  </Document>
);

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
      <NextUIProvider>
        <Text h1 color="warning" css={{ textAlign: 'center' }}>
          [CatchBoundary]: {caught.status} {caught.statusText} {message}
        </Text>
      </NextUIProvider>
    </Document>
  );
};

// How NextUIProvider should be used on ErrorBoundary
// https://remix.run/docs/en/v1/api/conventions#errorboundary
export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return (
    <Document title="Error!">
      <NextUIProvider>
        <Text h1 color="error" css={{ textAlign: 'center' }}>
          [ErrorBoundary]: There was an error: {error.message}
        </Text>
      </NextUIProvider>
    </Document>
  );
};

export default App;
