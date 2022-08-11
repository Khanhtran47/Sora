import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Input, Grid, Container, Button, Pagination, useInput } from '@nextui-org/react';

import { getTrending } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      todayTrending: await getTrending('all', 'day'),
    });
  }

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', page),
  });
};

const SearchRoute = () => {
  const { todayTrending } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { value, bindings } = useInput('');
  const isXs = useMediaQuery(650);

  const paginationChangeHandler = (page: number) => navigate(`/search/tv?page=${page}`);
  const onClickSearch = () => navigate(`/search/tv/${value}`);
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
      <Container
        fluid
        display="flex"
        justify="center"
        direction="column"
        alignItems="center"
        css={{
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {todayTrending?.items.length > 0 && (
          <MediaList listType="grid" items={todayTrending.items} listName="Today Trending" />
        )}
        <Pagination
          total={todayTrending.totalPages}
          initialPage={todayTrending.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      </Container>
    </>
  );
};

export default SearchRoute;
