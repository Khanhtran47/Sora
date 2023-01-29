/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import i18next from '~/i18n/i18next.server';
import { getPeopleCredits } from '~/services/tmdb/tmdb.server';
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

const CreditsPage = () => {
  const { credits } = useLoaderData<typeof loader>();

  return <MediaListTable items={credits?.cast || []} simplified sorted />;
};

export default CreditsPage;
