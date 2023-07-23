import { Outlet } from '@remix-run/react';

import type { Handle } from '~/types/handle';
import { genrePages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/genres" key="genres">
      {t('genres')}
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: genrePages,
  tabLinkTo: () => '/genres',
  miniTitle: ({ t }) => ({
    title: t('genres'),
    showImage: false,
  }),
};

const GenresPage = () => <Outlet />;

export default GenresPage;
