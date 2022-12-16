/* eslint-disable @typescript-eslint/indent */
import { useLoaderData, useNavigate, useLocation, NavLink } from '@remix-run/react';
import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Container, Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { authenticate } from '~/services/supabase';
import { getListTvShows } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import MediaList from '~/src/components/media/MediaList';

type LoaderData = {
  shows: Awaited<ReturnType<typeof getListTvShows>>;
};

export const meta: MetaFunction = () => ({
  title: 'Watch Popular movies and tv shows free | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/tv-shows/popular',
  'og:title': 'Watch Popular movies and tv shows free | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
});

export const loader: LoaderFunction = async ({ request }) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    shows: await getListTvShows('popular', locale, page),
  });
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/tv-shows/popular" aria-label="Popular Tv">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Popular Tv
        </Badge>
      )}
    </NavLink>
  ),
};

const ListTvShows = () => {
  const { shows } = useLoaderData<LoaderData>();
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
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => navigate(`/tv-shows/popular?page=${page}`);

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
        {shows && shows.items && shows.items.length > 0 && (
          <MediaList
            listType="grid"
            showListTypeChangeButton
            items={shows.items}
            listName={t('popularTv')}
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            showPagination
            totalPages={shows?.totalPages}
            currentPage={shows?.page}
            onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
          />
        )}
      </Container>
    </motion.div>
  );
};

export default ListTvShows;
