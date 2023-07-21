import { Outlet } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Trending' },
  { name: 'keywords', content: 'trending, trending movies, trending tv shows, trending anime' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/trending/' },
  { property: 'og:title', content: 'Sora - Trending' },
  { name: 'description', content: 'Trending' },
  { property: 'og:description', content: 'Trending' },
  { name: 'twitter:title', content: 'Sora - Trending' },
  { name: 'twitter:description', content: 'Trending' },
]);

export const handle: Handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/trending/" key="trending">
      Trending
    </BreadcrumbItem>
  ),
};

const Trending = () => <Outlet />;

export default Trending;
