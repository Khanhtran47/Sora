import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams } from '@remix-run/react';
import { Input, Grid, Container, Button, Pagination, useInput } from '@nextui-org/react';

import { getSearchPerson } from '~/services/tmdb/tmdb.server';
import PeopleList from '~/src/components/people/PeopleList';

type LoaderData = {
  searchResults: Awaited<ReturnType<typeof getSearchPerson>>;
};

export const loader: LoaderFunction = async ({ request, params }: DataFunctionArgs) => {
  const keyword = params?.peopleKeyword || '';
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      searchResults: await getSearchPerson(keyword),
    });
  }
  return json<LoaderData>({
    searchResults: await getSearchPerson(keyword, page),
  });
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { peopleKeyword } = useParams();
  const { value, bindings } = useInput(peopleKeyword || '');
  const [listName] = React.useState('Search Results');

  const paginationChangeHandler = (page: number) =>
    navigate(`/search/people/${peopleKeyword}?page=${page}`);
  const onClickSearch = () => navigate(`/search/people/${value}`);
  return (
    <>
      <Grid.Container gap={1} css={{ padding: '30px 10px' }}>
        <Grid>
          <Input
            {...bindings}
            clearable
            bordered
            initialValue={peopleKeyword}
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
        {searchResults?.results.length > 0 && (
          <PeopleList listType="grid" items={searchResults.results} listName={listName} />
        )}
        <Pagination
          total={searchResults.total_pages}
          initialPage={searchResults.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
        />
      </Container>
    </>
  );
};

export default SearchRoute;
