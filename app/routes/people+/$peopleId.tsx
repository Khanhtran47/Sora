import { Spacer } from '@nextui-org/spacer';
import { json, type LoaderArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getPeopleDetail, getPeopleExternalIds } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { peopleDetailPages } from '~/constants/tabLinks';
import PeopleDetail from '~/components/media/PeopleDetail';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import ErrorBoundaryView from '~/components/elements/shared/ErrorBoundaryView';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { peopleId } = params;
  const pid = Number(peopleId);
  if (!pid) throw new Response('Not Found', { status: 404 });

  const detail = await getPeopleDetail(pid, locale);
  const externalIds = await getPeopleExternalIds(pid, locale);
  if (!detail || !externalIds) throw new Response('Not Found', { status: 404 });

  return json(
    {
      detail,
      externalIds: {
        facebookId: externalIds.facebook_id || null,
        instagramId: externalIds.instagram_id || null,
        twitterId: externalIds.twitter_id || null,
      },
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta = mergeMeta<typeof loader>(({ data, params }) => {
  if (!data) {
    return [
      { title: 'Missing People' },
      { name: 'description', content: `There is no people with the ID: ${params.peopleId}` },
    ];
  }
  const { detail } = data;
  const { name, biography } = detail || {};
  const peopleTitle = name || '';
  return [
    { name: 'description', content: biography },
    {
      name: 'keywords',
      content: `watch ${peopleTitle} free, watch ${peopleTitle} movies, watch ${peopleTitle} series, stream ${peopleTitle} series, ${peopleTitle} movies online free`,
    },
    { property: 'og:description', content: biography },
    {
      property: 'og:image',
      content: detail?.profile_path ? TMDB.profileUrl(detail?.profile_path, 'w185') : undefined,
    },
    { name: 'twitter:description', content: biography },
    {
      name: 'twitter:image',
      content: detail?.profile_path ? TMDB.profileUrl(detail?.profile_path, 'w185') : undefined,
    },
  ];
});

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <>
      <BreadcrumbItem to="/people" key="people">
        {t('popular-people')}
      </BreadcrumbItem>
      <BreadcrumbItem
        to={`/people/${match.params.peopleId}`}
        key={`people-${match.params.peopleId}`}
      >
        {match.data?.detail?.name || match.params.peopleId}
      </BreadcrumbItem>
    </>
  ),
  showTabLink: true,
  tabLinkPages: peopleDetailPages,
  tabLinkTo: ({ params }) => `/people/${params.peopleId}`,
  miniTitle: ({ match, t }) => ({
    title: match.data?.detail?.name || t('people'),
    subtitle: t('overview'),
    showImage: match.data?.detail?.profile_path !== undefined,
    imageUrl: TMDB.profileUrl(match.data?.detail?.profile_path, 'w45'),
  }),
};

const PeopleDetailPage = () => {
  const { detail, externalIds } = useLoaderData<typeof loader>();
  return (
    <div className="mt-9 flex w-full flex-row flex-wrap items-stretch justify-center px-3 sm:px-5">
      <div className="w-full sm:w-1/3">
        <PeopleDetail detail={detail} externalIds={externalIds} />
        <Spacer y={5} />
      </div>
      <div className="w-full sm:w-2/3">
        <Outlet />
      </div>
    </div>
  );
};

export function ErrorBoundary() {
  return (
    <ErrorBoundaryView
      statusHandlers={{
        404: ({ params }) => <p>There is no people with the ID: {params.peopleId}</p>,
      }}
    />
  );
}

export default PeopleDetailPage;
