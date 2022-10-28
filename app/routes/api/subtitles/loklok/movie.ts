/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { IMovieSubtitle } from '~/services/consumet/flixhq/flixhq.types';
import { loklokSearchMovieSub } from '~/services/loklok';

type LoaderData = {
  subtitles: IMovieSubtitle[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') || '';
  const orgTitle = url.searchParams.get('orgTitle') || '';
  const year = Number(url.searchParams.get('year'));

  const subtitles = await loklokSearchMovieSub(title, orgTitle, year);

  return json<LoaderData>({ subtitles });
};
