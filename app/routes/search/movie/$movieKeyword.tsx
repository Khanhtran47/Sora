import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams } from '@remix-run/react';
import { Input, Grid, Container, Button, Pagination, useInput } from '@nextui-org/react';

import { getSearchMovies } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';

type LoaderData = {
  searchResults: Awaited<ReturnType<typeof getSearchMovies>>;
};

export const loader: LoaderFunction = async ({ request, params }: DataFunctionArgs) => {
  const keyword = params?.movieKeyword || '';
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      searchResults: await getSearchMovies(keyword),
    });
  }
  return json<LoaderData>({
    searchResults: await getSearchMovies(keyword, page),
  });
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { movieKeyword } = useParams();
  const { value, bindings } = useInput(movieKeyword || '');
  const [listName] = React.useState('Search Results');

  const paginationChangeHandler = (page: number) =>
    navigate(`/search/movie/${movieKeyword}?page=${page}`);
  const onClickSearch = () => navigate(`/search/movie/${value}`);
  return (
    <>
      <Grid.Container gap={1} css={{ padding: '30px 10px' }}>
        <Grid>
          <Input
            {...bindings}
            clearable
            bordered
            initialValue={movieKeyword}
            color="primary"
            fullWidth
            helperText="Input movie name and search"
          />
        </Grid>
        <Grid>
          <Button auto onClick={onClickSearch}>
            Search
          </Button>
        </Grid>
      </Grid.Container>
      <Container fluid display="flex" justify="center" direction="column" alignItems="center">
        {searchResults?.items.length > 0 && (
          <MediaList listType="grid" items={searchResults.items} listName={listName} />
        )}
        <Pagination
          total={searchResults.totalPages}
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
