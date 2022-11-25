/* eslint-disable @typescript-eslint/indent */
import { DataFunctionArgs, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, useLocation, Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Container, Pagination } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { authenticate } from '~/services/supabase';
import { getTrending } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
  // weekTrending: Awaited<ReturnType<typeof getTrending>>;
};

export const meta: MetaFunction = () => ({
  title: 'Watch Top Trending movies and tv shows free | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/trending',
  'og:title': 'Watch Top Trending movies and tv shows free | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
});

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page'));

  if (!page || page < 1 || page > 1000) {
    return json<LoaderData>({
      todayTrending: await getTrending('all', 'day', locale),
      // weekTrending: await getTrending('all', 'week'),
    });
  }

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', locale, page),
    // weekTrending: await getTrending('all', 'week', page),
  });
};

export const handle = {
  breadcrumb: () => (
    <Link to="/trending" aria-label="Trending Page">
      Today Trending
    </Link>
  ),
};

const Trending = () => {
  const { todayTrending } = useLoaderData<LoaderData>() || {};
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const isXs = useMediaQuery('(max-width: 650px)');
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
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
        {todayTrending && todayTrending.items && todayTrending.items.length > 0 && (
          <MediaList
            listType="grid"
            showListTypeChangeButton
            items={todayTrending?.items}
            listName={t('todayTrending')}
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
        )}
        <Pagination
          total={todayTrending?.totalPages}
          initialPage={todayTrending?.page}
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
