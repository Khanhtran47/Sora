import { resolve } from 'node:path';
import { createCookie } from '@remix-run/node';
import Backend from 'i18next-fs-backend';
import { RemixI18Next } from 'remix-i18next';

import { i18n } from './i18n.config';

const TEN_YEARS_IN_SECONDS = 10 * 365 * 24 * 60 * 60;

export const i18nCookie = createCookie('i18n', {
  sameSite: 'lax',
  path: '/',
  maxAge: TEN_YEARS_IN_SECONDS,
});

export const i18next = new RemixI18Next({
  detection: {
    cookie: i18nCookie,
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    },
  },
  backend: Backend,
});
