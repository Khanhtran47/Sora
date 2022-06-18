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
import { NextUIProvider, Text } from '@nextui-org/react';
import { withEmotionCache } from '@emotion/react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import theme from './src/utils/theme';
import ClientStyleContext from './src/components/ClientStyleContext';
import Layout from './src/components/Layout';
import styles from './styles/app.css';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

// for tailwindcss
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
  },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

const Document = withEmotionCache(({ children, title }: DocumentProps, emotionCache) => {
  const clientStyleData = React.useContext(ClientStyleContext);

  // Only executed on client
  useEnhancedEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const { tags } = emotionCache.sheet;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData.reset();
  }, []);

  return (
    <html lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="emotion-insertion-point" content="emotion-insertion-point" />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
});

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
        <Layout>
          <Text h1 color="warning" css={{ textAlign: 'center' }}>
            [CatchBoundary]: {caught.status} {caught.statusText} {message}
          </Text>
        </Layout>
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
