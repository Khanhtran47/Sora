import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { searchPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta: MetaFunction = () => ({
  title:
    'Search Movies, Tv Series and Anime HD - Watch Movies, Tv Series and Anime HD Online on Sora',
  description:
    "Sora's advanced search allows you to run extremely powerful queries over all people and titles. Find exactly what you're looking for!",
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/search',
  'og:title':
    'Search Movies, Tv Series and Anime HD - Watch Movies, Tv Series and Anime HD Online on Sora',
  'og:image': 'https://sora-anime.vercel.app/api/ogimage?it=search',
  'og:description':
    "Sora's advanced search allows you to run extremely powerful queries over all people and titles. Find exactly what you're looking for!",
});

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
