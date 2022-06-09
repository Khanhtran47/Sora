// eslint-disable-next-line import/no-extraneous-dependencies
import createCache from '@emotion/cache';

export default function createEmotionCache() {
  return createCache({ key: 'css' });
}
