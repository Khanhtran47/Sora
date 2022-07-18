import { DataFunctionArgs } from '@remix-run/node';
import { getTrending } from '~/services/tmdb.server';
import { MediaType, TimeWindowType } from '~/services/tmdb.types';

// endpoint: /api/trending?page=
export async function loader({ request }: DataFunctionArgs) {
  const url = new URL(request.url);
  let type = url.searchParams.get('mediaType') as MediaType;
  let timeWindow = url.searchParams.get('timeWindow') as TimeWindowType;
  let page = Number(url.searchParams.get('page'));

  // if (!type || (type !== 'movie' && type !== 'tv' && type !== 'all')) type = 'all';
  // if (!timeWindow || (timeWindow !== 'day' && timeWindow !== 'week')) timeWindow = 'day';
  // if (!page || page < 1 || page > 1000) page = 1;

  return getTrending(type, timeWindow, page);
}
