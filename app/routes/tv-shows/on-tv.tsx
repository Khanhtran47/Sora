import * as React from 'react';
import { useLoaderData, useNavigate, useLocation, Link } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { Container, Pagination } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { getListTvShows } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  shows: Awaited<ReturnType<typeof getListTvShows>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18next.getLocale(request);
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    shows: await getListTvShows('on_the_air', locale, page),
  });
};

export const handle = {
  breadcrumb: () => <Link to="/tv-shows/on-tv">On the air Tv</Link>,
};

const ListTvShows = () => {
  const { shows } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const location = useLocation();
  const isXs = useMediaQuery(650);
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/tv-shows/on-tv?page=${page}`);

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
        {shows?.items.length > 0 && (
          <MediaList listType="grid" items={shows.items} listName={t('onTv')} />
        )}
        <Pagination
          total={shows.totalPages}
          initialPage={shows.page}
          shadow
          onChange={paginationChangeHandler}
          css={{ marginTop: '30px' }}
          {...(isXs && { size: 'xs' })}
        />
      </Container>
    </motion.div>
  );
};

export default ListTvShows;
