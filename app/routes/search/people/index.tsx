import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Input, Grid, Container, Button, Pagination, useInput } from '@nextui-org/react';

import { getListPeople } from '~/services/tmdb/tmdb.server';
import PeopleList from '~/src/components/people/PeopleList';

type LoaderData = {
  people: Awaited<ReturnType<typeof getListPeople>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
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

const SearchRoute = () => {
  const { people } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { value, bindings } = useInput('');

  const paginationChangeHandler = (page: number) => navigate(`/people/popular?page=${page}`);
  const onClickSearch = () => navigate(`/search/people/${value}`);
  return (
    <>
      <Grid.Container gap={1} css={{ padding: '30px 10px' }}>
        <Grid>
          <Input
            {...bindings}
            labelPlaceholder="Search"
            clearable
            bordered
            color="primary"
            fullWidth
            helperText="Input tv name and search"
          />
        </Grid>
        <Grid>
          <Button auto onClick={onClickSearch}>
            Search
          </Button>
        </Grid>
      </Grid.Container>
      <Container fluid display="flex" justify="center" direction="column" alignItems="center">
        {people?.results.length > 0 && (
          <PeopleList listType="grid" items={people.results} listName="Popular People" />
        )}
        <Pagination
          total={people.total_pages}
          initialPage={people.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
        />
      </Container>
    </>
  );
};

export default SearchRoute;
