/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row } from '@nextui-org/react';

import i18next from '~/i18n/i18next.server';
import { getTvSeasonCredits } from '~/services/tmdb/tmdb.server';
import { IPeople } from '~/services/tmdb/tmdb.types';
import PeopleList from '~/src/components/people/PeopleList';

type LoaderData = {
  cast: IPeople[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { tvId, seasonId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not found', { status: 404 });
  const credits = await getTvSeasonCredits(tid, Number(seasonId), locale);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json<LoaderData>({ cast: credits.cast });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-movie.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/cast`,
});

const CastPage = () => {
  const { cast } = useLoaderData<LoaderData>();

  return (
    <Row
      fluid
      justify="center"
      align="center"
      css={{
        flexDirection: 'column',
        '@xsMax': {
          paddingLeft: 'calc(var(--nextui-space-sm))',
          paddingRight: 'calc(var(--nextui-space-sm))',
        },
        '@xs': {
          paddingLeft: '88px',
          paddingRight: '1rem',
        },
      }}
    >
      {cast && cast.length > 0 && (
        <PeopleList listType="grid" items={cast} listName="Cast" virtual />
      )}
    </Row>
  );
};

export default CastPage;
