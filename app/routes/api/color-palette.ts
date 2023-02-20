import { json } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/node'

import { lruCache } from '~/services/lru-cache';
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
  await authenticate(request, undefined, true)
  const url = new URL(request.url)
  const color = url.searchParams.get('color')

  const cacheKey = `color-${color}`
  if (lruCache) {
    const cacheColor = lruCache.get<ColorPalette | undefined>(cacheKey)
    if (cacheColor) {
      console.info('Cache color', cacheKey)
      return json(cacheColor, { status: 200, headers: { 'Cache-Control': 'max-age=31536000' } })
    }
  }
  try {
    const res = await fetch(`${process.env.COLOR_PALETTE_API}/color/${color}`);
    if (!res.ok) throw new Error(JSON.stringify(await res.json()));
    const data = await res.json() as Result;

    if (lruCache) lruCache.set(cacheKey, data)

    return json(data, { status: 200, headers: { 'Cache-Control': 'max-age=31536000' } })
  } catch (error) {
    console.error(error)
  }
  return json({ error: 'Something went wrong' }, { status: 500 })
}
