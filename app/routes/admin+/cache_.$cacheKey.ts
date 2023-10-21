import { json, type DataFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';

import { authenticate } from '~/services/supabase';
import { lruCache } from '~/utils/server/cache.server';

export async function loader({ request, params }: DataFunctionArgs) {
  await authenticate(request, undefined, true);

  const { cacheKey } = params;
  invariant(cacheKey, 'cacheKey is required');
  return json({
    cacheKey,
    value: lruCache.get(cacheKey),
  });
}
