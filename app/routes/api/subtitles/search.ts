/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { getSubtitlesSearch } from '~/services/open-subtitles/open-subtitles.server';

type LoaderData = {
  subtitlesSearch: Awaited<ReturnType<typeof getSubtitlesSearch>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const tmdb_id = url.searchParams.get('tmdb_id');
  const query = url.searchParams.get('query');
  const language = url.searchParams.get('language');
  let page = Number(url.searchParams.get('page'));
  if (!page && (page < 1 || page > 1000)) page = 1;
  const subtitlesSearch = await getSubtitlesSearch(
    undefined,
    undefined,
    Number(tmdb_id),
    undefined,
    undefined,
    undefined,
    query ? query : undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    language ? language : undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    page,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  );

  return json<LoaderData>({ subtitlesSearch });
};
