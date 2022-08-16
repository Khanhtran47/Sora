import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Input, Grid, Container, Button, Pagination, useInput } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { getListPeople } from '~/services/tmdb/tmdb.server';
import PeopleList from '~/src/components/people/PeopleList';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  people: Awaited<ReturnType<typeof getListPeople>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    people: await getListPeople('popular', locale, page),
  });
};

const SearchRoute = () => {
  const { people } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { value, bindings } = useInput('');
  const isXs = useMediaQuery(650);
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/people/popular?page=${page}`);
  const onClickSearch = () => navigate(`/search/people/${value}`);
  return (
    <>
      <Grid.Container gap={1} css={{ padding: '30px 10px' }}>
        <Grid>
          <Input
            {...bindings}
            labelPlaceholder={t('searchPlaceHolder')}
            clearable
            bordered
            color="primary"
            fullWidth
            helperText={t('searchHelper')}
          />
        </Grid>
        <Grid>
          <Button auto onClick={onClickSearch}>
            {t('search')}
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
        {people?.results.length > 0 && (
          <PeopleList listType="grid" items={people.results} listName={t('popularPeople')} />
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
    </>
  );
};

export default SearchRoute;
