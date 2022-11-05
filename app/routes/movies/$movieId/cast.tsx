/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row } from '@nextui-org/react';

import { authenticate } from '~/services/supabase';
import { getCredits } from '~/services/tmdb/tmdb.server';
import { IPeople } from '~/services/tmdb/tmdb.types';
import PeopleList from '~/src/components/people/PeopleList';

type LoaderData = {
  cast: IPeople[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticate(request);

  const { movieId } = params;
  const mid = Number(movieId);

  if (!mid) throw new Response('Not found', { status: 404 });
  const credits = await getCredits('movie', mid);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json<LoaderData>({ cast: credits.cast });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-movies.vercel.app/movies/${params.movieId}/cast`,
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
      {/*
        TODO: Need react virtual to load this list
        This list has a lot of items, so i limit it to 24 items until we install react virtual
      */}
      {cast && cast.length > 0 && (
        <PeopleList listType="grid" items={cast.slice(0, 24)} listName="Cast" virtual />
      )}
    </Row>
  );
};

export default CastPage;
