import type { FetcherWithComponents } from '@remix-run/react';
import type Artplayer from 'artplayer';

export default function updateHistory(
  art: Artplayer,
  fetcher: FetcherWithComponents<unknown>,
  id: string,
  route: string,
  title: string,
  overview: string,
  season?: string,
  episode?: string,
) {
  let played = false;

  art.on('play', () => {
    played = true;
  });

  art.on('destroy', () => {
    if (played) {
      fetcher.submit(
        {
          user_id: id,
          duration: art.duration.toString(),
          watched: art.currentTime.toString(),
          route,
          poster: art.poster,
          title,
          overview,
          season: season ?? '',
          episode: episode ?? '',
        },
        { method: 'post', action: '/api/history' },
      );
    }
  });
}
