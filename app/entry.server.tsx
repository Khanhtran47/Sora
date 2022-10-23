import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { CssBaseline } from '@nextui-org/react';
import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { resolve } from 'node:path';
import postCss, { AcceptedPlugin } from 'postcss';
import postCssPresetEnv from 'postcss-preset-env';

import i18next from './i18n/i18next.server';
import i18n from './i18n/i18n.config';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  const instance = createInstance();

  // Then we could detect locale from the request
  const lng = await i18next.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  const ns = i18next.getRouteNamespaces(remixContext);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend
    .init({
      ...i18n, // spread the configuration
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
      backend: {
        loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
        // Disable cache for translation files in development
        requestOptions: { cache: process.env.NODE_ENV === 'production' ? 'default' : 'no-cache' },
      },
    });

  // Then you can render your app wrapped in the I18nextProvider as in the
  // entry.client file
  const styles = CssBaseline.flush();
  const { css } = await postCss([
    postCssPresetEnv({
      browsers: 'last 2 versions',
      stage: 2,
      autoprefixer: {},
    }) as AcceptedPlugin,
  ]).process(styles.props.dangerouslySetInnerHTML.__html, {
    from: undefined,
  });

  const html = renderToString(
    <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>,
  ).replace(/<\/head>/, `<style id="stitches" suppressHydrationWarning>${css}</style></head>`);

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${html}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
