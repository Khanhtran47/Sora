import * as React from 'react';
import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Input, Grid, Container, Button, Pagination, useInput } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { getTrending } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', locale, page),
  });
};

const SearchRoute = () => {
  const { todayTrending } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const { value, bindings } = useInput('');
  const isXs = useMediaQuery(650);
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/search/movie?page=${page}`);
  const onClickSearch = () => navigate(`/search/movie/${value}`);
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
        {todayTrending?.items.length > 0 && (
          <MediaList listType="grid" items={todayTrending.items} listName={t('todayTrending')} />
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
