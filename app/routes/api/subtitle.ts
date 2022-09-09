// import { LoaderFunction, json } from '@remix-run/node';
// import { convert } from 'subtitle-converter';

// export const loader: LoaderFunction = async ({ request }) => {
//   const url = new URL(request.url);
//   const path = url.searchParams.get('url');
//   if (!path || typeof path !== 'string') throw new Response('Invalid request', { status: 400 });
//   const response = (await fetch(encodeURI(path))).json();
//   const { subtitle } = convert(response, '.vtt');
//   if (!subtitle) throw new Response('Cannot convert', { status: 400 });
//   return json(subtitle);
// };
