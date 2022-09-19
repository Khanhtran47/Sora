import { LoaderFunction, json, Response } from '@remix-run/node';
// @ts-expect-error: no type
import { convert } from 'subtitle-converter';
import axios from 'axios';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.searchParams.get('url');
  if (!path || typeof path !== 'string') throw new Response('Invalid request', { status: 400 });

  const response = await axios.get(encodeURI(path));
  // const response = (await fetch(encodeURI(path))).arrayBuffer();
  const { subtitle } = convert(response.data, '.vtt');
  if (!subtitle) throw new Response('Cannot convert', { status: 400 });
  // return json(subtitle);
  return new Response(subtitle, {
    headers: { 'content-type': 'text/vtt' },
  });
};
