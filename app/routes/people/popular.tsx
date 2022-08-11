import * as React from 'react';
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';

import PeopleList from '~/src/components/people/PeopleList';
import { getListPeople } from '~/services/tmdb/tmdb.server';
import useMediaQuery from '~/hooks/useMediaQuery';

type LoaderData = {
  people: Awaited<ReturnType<typeof getListPeople>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));

  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      people: await getListPeople('popular'),
    });
  }
  return json<LoaderData>({
    people: await getListPeople('popular', undefined, page),
  });
};

const ListPeoplePopular = () => {
  const { people } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const location = useLocation();
  const isXs = useMediaQuery(650);

  const paginationChangeHandler = (page: number) => navigate(`/people/popular?page=${page}`);

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        fluid
        display="flex"
        justify="center"
        css={{
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {people?.results.length > 0 && (
          <PeopleList listType="grid" items={people.results} listName="Popular People" />
        )}
        <Pagination
          total={people.total_pages}
          initialPage={people.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      </Container>
    </motion.div>
  );
};

export default ListPeoplePopular;
