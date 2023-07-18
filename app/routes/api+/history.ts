import { redirect, type ActionArgs } from '@remix-run/node';

import { authenticate, insertHistory } from '~/services/supabase';

export const action = async ({ request }: ActionArgs) => {
  const headers = new Headers();
  const user = await authenticate(request, true, true);

  if (!user) return new Response(null, { headers, status: 401 });

  const data = await request.clone().formData();

  const user_id = data.get('user_id')?.toString();
  const duration = Number(data.get('duration'));
  const watched = Number(data.get('watched'));
  const route = data.get('route')?.toString();
  const poster = data.get('poster')?.toString();
  const title = data.get('title')?.toString();
  const overview = data.get('overview')?.toString();
  const season = data.get('season')?.toString();
  const episode = data.get('episode')?.toString();
  const media_type = data.get('media_type')?.toString() as 'movie' | 'tv' | 'anime';

  if (user.id !== user_id) return new Response(null, { headers, status: 400 });

  if (user_id && duration && route) {
    const { error } = await insertHistory({
      user_id: user_id,
      media_type,
      duration: Math.round(duration),
      watched: Math.floor(watched),
      media_id: route.split('/')[2],
      route: route,
      poster: poster,
      title: title,
      overview: overview,
      season: season,
      episode: episode,
    });

    if (!error) return new Response(null, { status: 201 });
  }

  return new Response(null, { status: 400 });
};

export const loader = async () => {
  return redirect('/');
};
