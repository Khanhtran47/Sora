import { DataFunctionArgs, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Container, Pagination } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { getTrending } from '~/services/tmdb/tmdb.server';

import MediaList from '~/src/components/Media/MediaList';

import useMediaQuery from '~/hooks/useMediaQuery';

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
  // weekTrending: Awaited<ReturnType<typeof getTrending>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));
  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      todayTrending: await getTrending('all', 'day'),
      // weekTrending: await getTrending('all', 'week'),
    });
  }

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', page),
    // weekTrending: await getTrending('all', 'week', page),
  });
};

const Trending = () => {
  const { todayTrending } = useLoaderData<LoaderData>() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const isXs = useMediaQuery(650);
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/trending?page=${page}`);

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
    </motion.div>
  );
};

export default Trending;
