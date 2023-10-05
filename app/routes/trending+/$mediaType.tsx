import { type LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import type { Handle } from '~/types/handle';
import { redirectWithToast } from '~/utils/server/toast-session.server';
import { trendingPages } from '~/constants/tabLinks';

export const handle: Handle = {
  showTabLink: true,
  tabLinkPages: ({ params }) => {
    const { mediaType } = params;
    const tabLinkPages = trendingPages[`${mediaType as 'all' | 'movie' | 'tv' | 'people'}`];
    return tabLinkPages;
  },
  tabLinkTo: ({ params }) => `/trending/${params.mediaType}`,
};
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { mediaType } = params;
  if (!mediaType || !['all', 'movie', 'tv', 'people'].includes(mediaType))
    return redirectWithToast(request, `/trending/all/today`, {
      type: 'error',
      title: 'Error',
      description: 'Invalid media type',
    });
  return null;
};

const TrendingMediaPage = () => <Outlet />;

export default TrendingMediaPage;
