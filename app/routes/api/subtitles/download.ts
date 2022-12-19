/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { getSubtitleDownload } from '~/services/open-subtitles/open-subtitles.server';

type LoaderData = {
  subtitle: Awaited<ReturnType<typeof getSubtitleDownload>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const file_id = url.searchParams.get('file_id');
  const sub_format = url.searchParams.get('sub_format') as 'srt' | 'webvtt';
  if (!file_id || !sub_format) throw { status: 400, message: 'Missing file_id or sub_format' };
  const subtitle = await getSubtitleDownload(Number(file_id), sub_format);

  return json<LoaderData>({ subtitle });
};
