import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation, type RouteMatch } from '@remix-run/react';
import { motion } from 'framer-motion';
import i18next from '~/i18n/i18next.server';

import { getPeopleCredits } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const loader = async ({ request, params }: LoaderArgs) => {
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

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/people/${params.peopleId}/credits`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink to={`/people/${match.params.peopleId}/credits`} aria-label="Credits">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Credits
        </Badge>
      )}
    </NavLink>
  ),
  miniTitle: (_match: RouteMatch, parentMatch: RouteMatch) => ({
    title: parentMatch.data?.detail?.name || 'People',
    subtitle: 'Credits',
    showImage: parentMatch.data?.detail?.profile_path !== undefined,
    imageUrl: TMDB.profileUrl(parentMatch.data?.detail?.profile_path, 'w45'),
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
        items={credits?.cast}
        itemsType="movie-tv"
        listType="grid"
      />
    </motion.div>
  );
};

export default CreditsPage;
