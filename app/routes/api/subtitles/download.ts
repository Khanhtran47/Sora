/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { getSubtitleDownload } from '~/services/open-subtitles/open-subtitles.server';

type LoaderData = {
  subtitle: Awaited<ReturnType<typeof getSubtitleDownload>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const file_id = url.searchParams.get('file_id');
  const subtitle = await getSubtitleDownload(Number(file_id));

  return json<LoaderData>({ subtitle });
};
