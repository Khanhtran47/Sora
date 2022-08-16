// for saving selected language
import { createCookie } from '@remix-run/node';

const i18nCookie = createCookie('i18n', {
  sameSite: 'lax',
  path: '/',
});

export default i18nCookie;
