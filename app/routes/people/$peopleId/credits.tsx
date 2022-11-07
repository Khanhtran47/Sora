/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';
import { getPeopleCredits } from '~/services/tmdb/tmdb.server';
import { MediaListTable } from '~/src/components/media/list';

type LoaderData = {
  credits: Awaited<ReturnType<typeof getPeopleCredits>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { peopleId } = params;
  const pid = Number(peopleId);
  if (!pid) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    credits: await getPeopleCredits(pid, undefined, locale),
  });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/people/${params.peopleId}/credits`,
});

const CreditsPage = () => {
  const { credits } = useLoaderData<LoaderData>();

  return <MediaListTable items={credits?.cast || []} simplified sorted />;
};

export default CreditsPage;
