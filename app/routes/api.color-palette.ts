import { json, type LoaderArgs } from '@remix-run/node';

import { cachified, lruCache } from '~/services/lru-cache';
import { authenticate } from '~/services/supabase';

interface Result {
  color: ColorPalette;
}

export interface ColorPalette {
  '50': string;
  '100': string;
  '200': string;
  '300': string;
  '400': string;
  '500': string;
  '600': string;
  '700': string;
  '800': string;
  '900': string;
}

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request, undefined, true);
  const url = new URL(request.url);
  const color = url.searchParams.get('color');
  const colorData = await cachified({
    key: `color-${color}`,
    ttl: 1000 * 60 * 60 * 24 * 30,
    staleWhileRevalidate: 1000 * 60 * 60 * 24 * 365,
    cache: lruCache,
    request,
    getFreshValue: async () => {
      try {
        const res = await fetch(`https://www.tints.dev/api/color/${color}`);
        if (!res.ok) throw new Error(JSON.stringify(await res.json()));
        const data = (await res.json()) as Result;
        return data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return { error: 'Something went wrong' };
      }
    },
    checkValue: (value: unknown) => {
      if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length > 0;
      }
      return false;
    },
  });
  if ((colorData as { error: string })?.error) {
    return json(colorData, { status: 500 });
  }
  return json(colorData, { status: 200, headers: { 'Cache-Control': 'max-age=31536000' } });
};
