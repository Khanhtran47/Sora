import { startTransition } from 'react';
import { loadServiceWorker } from '@remix-pwa/sw';
import { RemixBrowser } from '@remix-run/react';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { getInitialNamespaces } from 'remix-i18next';

import { i18n } from '~/services/i18n';

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
    startTransition(() => {
      // After i18next has been initialized, we can hydrate the app
      // We need to wait to ensure translations are loaded before the hydration
      // Here wrap RemixBrowser in I18nextProvider from react-i18next
      hydrateRoot(
        document,
        <I18nextProvider i18n={i18next}>
          <RemixBrowser />
        </I18nextProvider>,
      );
    }),
  )
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });

loadServiceWorker({
  serviceWorkerUrl: `/sw.js${
    window.process.env.NODE_ENV === 'production'
      ? `?version=${window.process.env.VERCEL_GIT_COMMIT_SHA}`
      : ''
  }`,
});
