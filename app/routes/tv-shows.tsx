import { Outlet } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import { tvPages } from '~/constants/tabLinks';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta(() => [
  {
    name: 'keywords',
    content:
      'watch free tv shows, free tv shows to watch online, watch tv shows online free, free tv shows streaming, free tv shows full, free tv shows download, watch tv shows hd, tv shows to watch, hd tv shows, stream tv shows, tv shows to stream, watch tv shows free',
  },
  { property: 'og:image', content: 'https://sorachill.vercel.app/api/ogimage?it=tvshows' },
  { name: 'twitter:image', content: 'https://sorachill.vercel.app/api/ogimage?it=tvshows' },
]);

export const handle: Handle = {
  breadcrumb: ({ t }) => (
    <BreadcrumbItem to="/tv-shows" key="tv-shows">
      {t('tv-shows')}
    </BreadcrumbItem>
  ),
  showTabLink: true,
  tabLinkPages: tvPages,
  tabLinkTo: () => '/tv-shows',
  hideTabLinkWithLocation: (locationPathname: string) => {
    if (locationPathname.split('/')[2]?.match(/^\d+$/) || locationPathname === '/tv-shows')
      return true;
    return false;
  },
};

const TvPage = () => <Outlet />;

export default TvPage;
