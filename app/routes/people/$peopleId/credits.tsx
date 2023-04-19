/* eslint-disable @typescript-eslint/no-throw-literal */

import { Badge } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, type RouteMatch } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';

import { getPeopleCredits } from '~/services/tmdb/tmdb.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { MediaListTable } from '~/components/media/list';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  miniTitle: (match: RouteMatch, parentMatch: RouteMatch) => ({
    title: parentMatch.data?.detail?.name || 'People',
    subtitle: 'Credits',
    showImage: parentMatch.data?.detail?.profile_path !== undefined,
    imageUrl: TMDB.profileUrl(parentMatch.data?.detail?.profile_path, 'w45'),
  }),
};

const CreditsPage = () => {
  const { credits } = useLoaderData<typeof loader>();

  return <MediaListTable items={credits?.cast || []} simplified sorted />;
};

export default CreditsPage;
