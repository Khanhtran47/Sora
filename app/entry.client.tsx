import { hydrate } from 'react-dom';
import { RemixBrowser } from '@remix-run/react';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { getInitialNamespaces } from 'remix-i18next';

import i18n from './i18n/i18n.config';
import { ClientCacheProvider } from './context/client.context';

i18next
  .use(initReactI18next) // Tell i18next to use the react-i18next plugin
  .use(LanguageDetector) // Setup a client-side language detector
  .use(Backend) // Setup your backend
  .init({
    ...i18n, // spread the configuration
    // This function detects the namespaces your routes rendered while SSR use
    ns: getInitialNamespaces(),
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      // Here only enable htmlTag detection, we'll detect the language only
      // server-side with remix-i18next, by using the `<html lang>` attribute
      // we can communicate to the client the language detected server-side
      order: ['htmlTag'],
      // Because we only use htmlTag, there's no reason to cache the language
      // on the browser, so we disable it
      caches: [],
    },
  })
  .then(() =>
    // After i18next has been initialized, we can hydrate the app
    // We need to wait to ensure translations are loaded before the hydration
    // Here wrap RemixBrowser in I18nextProvider from react-i18next
    hydrate(
      <ClientCacheProvider>
        <I18nextProvider i18n={i18next}>
          <RemixBrowser />
        </I18nextProvider>
      </ClientCacheProvider>,
      document,
    ),
  );

function cloneObject<T>(obj: T): T {
  const clone: T = {} as T;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] != null) {
      if (`${obj[key]}` === '[object Window]') {
        delete obj[key];
        // eslint-disable-next-line no-continue
        continue;
      }
      clone[key] = cloneObject(obj[key]);
    } else clone[key] = obj[key];
  }
  return clone;
}

// Use the window load event to keep the page load performant
async function loadSW() {
  console.log('loaded');

  return navigator.serviceWorker
    .register(
      `/entry.worker.js${
        window.process.env.NODE_ENV === 'production'
          ? `?version=${window.process.env.VERCEL_GIT_COMMIT_SHA}`
          : ''
      }`,
    )
    .then(() => navigator.serviceWorker.ready)
    .then(() => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          JSON.stringify(
            cloneObject({
              type: 'SYNC_REMIX_MANIFEST',
              manifest: window.__remixManifest,
            }),
          ),
        );
      } else {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          navigator.serviceWorker.controller?.postMessage(
            JSON.stringify(
              cloneObject({
                type: 'SYNC_REMIX_MANIFEST',
                manifest: window.__remixManifest,
              }),
            ),
          );
        });
      }
    })
    .catch((error) => {
      console.error('Service worker registration failed', error);
    });
}
if ('serviceWorker' in navigator) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadSW();
  } else {
    window.addEventListener('load', loadSW);
  }
}
