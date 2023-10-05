import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion } from 'framer-motion';

import type { Handle } from '~/types/handle';
import type { loader as peopleIdLoader } from '~/routes/people+/$peopleId';
import { i18next } from '~/services/i18n';
import { getPeopleCredits } from '~/services/tmdb/tmdb.server';
import type { IPeopleDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import { useTypedRouteLoaderData } from '~/utils/react/hooks/useTypedRouteLoaderData';
import { CACHE_CONTROL } from '~/utils/server/http';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const { peopleId } = params;
  const pid = Number(peopleId);
  if (!pid) throw new Response('Not Found', { status: 404 });

  return json(
    {
      credits: await getPeopleCredits(pid, undefined, locale),
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta = mergeMeta<null, { 'routes/people+/$peopleId': typeof peopleIdLoader }>(
  ({ params, matches }) => {
    const peopleData = matches.find((match) => match.id === 'routes/people+/$peopleId')?.data;
    if (!peopleData) {
      return [
        { title: 'Missing People' },
        { name: 'description', content: `There is no people with the ID: ${params.peopleId}` },
      ];
    }
    const { detail } = peopleData;
    const { name } = detail || {};
    const peopleTitle = name || '';
    return [
      { title: `Sora - ${peopleTitle} - Credits` },
      {
        property: 'og:url',
        content: `https://sorachill.vercel.app/people/${params.peopleId}/credits`,
      },
      { property: 'og:title', content: `Sora - ${peopleTitle} - Credits` },
      { name: 'twitter:title', content: `Sora - ${peopleTitle} - Credits` },
    ];
  },
);

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/people/${match.params.peopleId}/credits`}
      key={`people-${match.params.peopleId}-credits`}
    >
      {t('credits')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ parentMatch, t }) => ({
    title: parentMatch
      ? (parentMatch?.data as { detail: IPeopleDetail })?.detail?.name || 'People'
      : 'People',
    subtitle: t('credits'),
    showImage: parentMatch
      ? (parentMatch?.data as { detail: IPeopleDetail })?.detail?.profile_path !== undefined
      : false,
    imageUrl: parentMatch
      ? TMDB.profileUrl(
          (parentMatch?.data as { detail: IPeopleDetail })?.detail?.profile_path,
          'w45',
        )
      : undefined,
  }),
};

const CreditsPage = () => {
  const { credits } = useLoaderData<typeof loader>();
  const location = useLocation();
  const rootData = useTypedRouteLoaderData('root');
  // TODO: Add filter and sort data

  return (
    <motion.div
      key={location.key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MediaList
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        isCreditsCard
        // @ts-expect-error
        items={credits?.cast}
        itemsType="movie-tv"
        listType="grid"
      />
    </motion.div>
  );
};

export default CreditsPage;
