import { redirect, type LoaderArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import type { Handle } from '~/types/handle';
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
export const loader = async ({ params }: LoaderArgs) => {
  const { mediaType } = params;
  if (!mediaType || !['all', 'movie', 'tv', 'people'].includes(mediaType))
    return redirect(`/trending/all/today`);
  return null;
};

const TrendingMediaPage = () => <Outlet />;

export default TrendingMediaPage;
