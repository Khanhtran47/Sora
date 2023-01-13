/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type {LoaderArgs} from '@remix-run/node';

import getProviderList from '~/services/provider.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request);

  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const title = url.searchParams.get('title');
  const orgTitle = url.searchParams.get('orgTitle');
  const year = url.searchParams.get('year');
  const season = url.searchParams.get('season');
  if (!title || !type) throw new Response('Missing params', { status: 400 });
  const provider = await getProviderList(type, title, orgTitle, year, season);
  if (provider && provider.length > 0) return json({ provider }, { status: 200, headers: { 'Cache-Control': CACHE_CONTROL.default } });

  return json({
    provider: undefined,
  }, {
    headers: {
      'Cache-Control': CACHE_CONTROL.default,
    }
  });
};
