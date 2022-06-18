import { renderToString } from 'react-dom/server';
import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/node';
import { getCssText, NextUIProvider } from '@nextui-org/react';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(
    <NextUIProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NextUIProvider>,
  ).replace('__STYLES__', getCssText());

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
