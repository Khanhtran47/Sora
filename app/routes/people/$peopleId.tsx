import { Spacer } from '@nextui-org/spacer';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData, type RouteMatch } from '@remix-run/react';

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

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing People',
      description: `There is no people with the ID: ${params.peopleId}`,
    };
  }
  const { detail } = data;
  return {
    title: `${detail?.name || ''} | Sora - Watch The Best of Movies, TV Shows & Animes`,
    description: `Watch ${detail?.name || ''} movies and series in full HD online with Subtitle`,
    keywords: `watch ${detail?.name || ''} free, watch ${detail?.name || ''} movies, watch ${
      detail?.name || ''
    } series, stream ${detail?.name || ''} series, ${detail?.name || ''} movies online free`,
    'og:url': `https://sorachill.vercel.app/people/${params.peopleId}`,
    'og:title': `${detail?.name || ''} | Sora - Watch The Best of Movies, TV Shows & Animes`,
    'og:description': `Watch ${
      detail?.name || ''
    } movies and series in full HD online with Subtitle`,
    'og:image': detail?.profile_path ? TMDB.profileUrl(detail?.profile_path, 'w185') : undefined,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <BreadcrumbItem to="/people" key="people">
        Popular People
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tabLinkTo: (params: any) => `/people/${params.peopleId}`,
  miniTitle: (match: RouteMatch) => ({
    title: match.data?.detail?.name || 'People',
    subtitle: 'Overview',
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
