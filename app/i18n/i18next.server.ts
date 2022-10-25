import { createCookie } from '@remix-run/node';
import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next';
import i18n from '~/i18n/i18n.config';

export const i18nCookie = createCookie('i18n', {
  sameSite: 'lax',
  path: '/',
});

const i18next = new RemixI18Next({
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

export default i18next;
