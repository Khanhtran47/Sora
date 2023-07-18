import { Outlet } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import { searchPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  { title: 'Sora - Search' },
  { name: 'description', content: 'Search Movies, Tv Series and Anime on Sora' },
  { property: 'og:url', content: 'https://sorachill.vercel.app/search' },
  { property: 'og:title', content: 'Sora - Search' },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=search' },
  { property: 'og:description', content: 'Search Movies, Tv Series and Anime on Sora' },
  { name: 'twitter:title', content: 'Sora - Search' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=search' },
  { name: 'twitter:description', content: 'Search Movies, Tv Series and Anime on Sora' },
]);

export const handle = {
  breadcrumb: () => (
    <BreadcrumbItem to="/search" key="search">
      Search
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: searchPages,
  tabLinkTo: () => '/search/',
  miniTitle: () => ({
    title: 'Search',
    showImage: false,
  }),
};

const SearchPage = () => <Outlet />;

export default SearchPage;
