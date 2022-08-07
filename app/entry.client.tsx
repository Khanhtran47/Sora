import { hydrateRoot } from 'react-dom/client';
import { hydrate } from 'react-dom';
import { RemixBrowser } from '@remix-run/react';

if (process.env.NODE_ENV === 'test') {
  hydrate(<RemixBrowser />, document);
} else {
  hydrateRoot(document, <RemixBrowser />);
}
