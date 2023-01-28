/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { getCssText } from '@nextui-org/react';
import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { resolve } from 'node:path';
import { etag } from 'remix-etag';
import isbot from 'isbot';

import { IsBotProvider } from '~/context/isbot.context';
import { otherRootRouteHandlers } from '~/services/other-root-routes.server';

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
      },
    });

  // Then you can render your app wrapped in the I18nextProvider as in the
  // entry.client file

  for (const handler of otherRootRouteHandlers) {
    const otherRouteResponse = await handler(request, remixContext);
    if (otherRouteResponse) return otherRouteResponse;
  }

  isbot.exclude([
    'Checkly',
    'Checkly, https://www.checklyhq.com',
    'Checkly/1.0 (https://www.checklyhq.com)',
  ]);

  let markup = renderToString(
    <IsBotProvider isBot={isbot(request.headers.get('User-Agent') ?? '')}>
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>
    </IsBotProvider>,
  );

  markup = markup.replace(
    /<style id="stitches">.*<\/style>/g,
    `<style id="stitches">${getCssText()}</style>`,
  );

  responseHeaders.set('Content-Type', 'text/html');

  const response = new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });

  return etag({ request, response });
}
