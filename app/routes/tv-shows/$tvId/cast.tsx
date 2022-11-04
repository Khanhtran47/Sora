/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row } from '@nextui-org/react';

import { getCredits } from '~/services/tmdb/tmdb.server';
import { IPeople } from '~/services/tmdb/tmdb.types';
import PeopleList from '~/src/components/people/PeopleList';
import { getUserFromCookie, verifyReqPayload } from '~/services/supabase';

type LoaderData = {
  cast: IPeople[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [user, verified] = await Promise.all([
    getUserFromCookie(request.headers.get('Cookie') || ''),
    await verifyReqPayload(request),
  ]);

  if (!user || !verified) return redirect('/sign-out?ref=/sign-in');
  const { tvId } = params;
  const mid = Number(tvId);

  if (!mid) throw new Response('Not found', { status: 404 });
  const credits = await getCredits('tv', mid);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json<LoaderData>({ cast: credits.cast });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-movie.vercel.app/tv-shows/${params.tvId}/cast`,
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
