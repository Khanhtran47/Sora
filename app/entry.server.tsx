/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { resolve } from 'node:path';
import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import isbot from 'isbot';
import { renderToString } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { etag } from 'remix-etag';

import { otherRootRouteHandlers } from '~/services/other-root-routes.server';
import { IsBotProvider } from '~/context/isbot.context';

import i18n from './i18n/i18n.config';
import i18next from './i18n/i18next.server';

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

  const isbotRender = isbot.spawn();
  isbotRender.exclude([
    'Checkly',
    'Checkly, https://www.checklyhq.com',
    'Checkly/1.0 (https://www.checklyhq.com)',
    'googlebot',
    'googlebot/2.1 (+http://www.google.com/bot.html)',
    'bingbot',
    'bingbot/2.0 (+http://www.bing.com/bingbot.htm)',
    'discordbot',
    'Discordbot/2.0',
    'twitterbot',
    'Twitterbot/1.0',
    'vercel',
    'Vercel/1.0 (https://vercel.com/docs/bots)',
  ]);
  isbotRender.extend(['chrome-lighthouse']);

  const markup = renderToString(
    <IsBotProvider isBot={isbotRender(request.headers.get('User-Agent') ?? '')}>
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>
    </IsBotProvider>,
  );

  responseHeaders.set('Content-Type', 'text/html');

  const response = new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });

  return etag({ request, response });
}
