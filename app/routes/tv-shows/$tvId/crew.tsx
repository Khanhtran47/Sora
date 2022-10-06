/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row } from '@nextui-org/react';
import { getCredits } from '~/services/tmdb/tmdb.server';
import { IPeople } from '~/services/tmdb/tmdb.types';
import PeopleList from '~/src/components/people/PeopleList';

type LoaderData = {
  crew: IPeople[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { tvId } = params;
  const mid = Number(tvId);

  if (!mid) throw new Response('Not found', { status: 404 });
  const credits = await getCredits('tv', mid);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json<LoaderData>({ crew: credits.crew });
};

const CrewPage = () => {
  const { crew } = useLoaderData<LoaderData>();

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
      {crew && crew.length > 0 && (
        <PeopleList listType="grid" items={crew.slice(0, 24)} listName="Crew" />
      )}
    </Row>
  );
};

export default CrewPage;
