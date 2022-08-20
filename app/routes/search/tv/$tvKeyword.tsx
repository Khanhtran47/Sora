import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData, useNavigate, useParams, Link, RouteMatch } from '@remix-run/react';
import { Input, Grid, Container, Button, Pagination, useInput } from '@nextui-org/react';

import { getSearchTvShows } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';

type LoaderData = {
  searchResults: Awaited<ReturnType<typeof getSearchTvShows>>;
};

export const loader: LoaderFunction = async ({ request, params }: DataFunctionArgs) => {
  const keyword = params?.tvKeyword || '';
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      searchResults: await getSearchTvShows(keyword),
    });
  }
  return json<LoaderData>({
    searchResults: await getSearchTvShows(keyword, page),
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/search/tv/${match.params.tvKeyword}`}>{match.params.tvKeyword}</Link>
  ),
};

const SearchRoute = () => {
  const { searchResults } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { tvKeyword } = useParams();
  const { value, bindings } = useInput(tvKeyword || '');
  const { t } = useTranslation();
  const [listName] = React.useState(t('searchResults'));
  const isXs = useMediaQuery(650);

  const paginationChangeHandler = (page: number) =>
    navigate(`/search/tv/${tvKeyword}?page=${page}`);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search/tv/${value}`);
  };
  return (
    <>
      <Form onSubmit={onSubmit}>
        <Grid.Container gap={1} css={{ m: 0, padding: '30px 10px', width: '100%' }}>
          <Grid>
            <Input
              {...bindings}
              clearable
              bordered
              initialValue={tvKeyword}
              color="primary"
              fullWidth
              helperText={t('searchHelper')}
            />
          </Grid>
          <Grid>
            <Button auto type="submit">
              {t('search')}
            </Button>
          </Grid>
        </Grid.Container>
      </Form>
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
        {searchResults?.items.length > 0 && (
          <MediaList listType="grid" items={searchResults.items} listName={listName} />
        )}
        <Pagination
          total={searchResults.totalPages}
          initialPage={searchResults.page}
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
