/* eslint-disable @typescript-eslint/indent */
import { useLoaderData, useNavigate, useLocation, NavLink } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { Container, Badge } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { authenticate } from '~/services/supabase';
import { getListDiscover } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = () => ({
  title: 'Discover and Watch movies and tv shows free | Sora',
  description:
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
  keywords:
    'watch free movies, free movies to watch online, watch movies online free, free movies streaming, free movies full, free movies download, watch movies hd, movies to watch',
  'og:url': 'https://sora-anime.vercel.app/tv-shows/discover',
  'og:title': 'Discover and Watch movies and tv shows free | Sora',
  'og:description':
    'Official Sora website to watch movies online HD for free, Watch TV show & TV series and Download all movies and series FREE',
});

export const loader = async ({ request }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const withGenres = url.searchParams.get('with_genres') || undefined;
  let sortBy = url.searchParams.get('sort_by') || undefined;
  if (sortBy && !sortBy.includes('.')) sortBy += sortBy === 'original_title' ? '.asc' : '.desc';
  const voteCountGte = url.searchParams.get('vote_count.gte') || 300;
  const withOriginalLanguage = url.searchParams.get('with_original_language') || undefined;
  const withStatus = url.searchParams.get('with_status') || undefined;
  const withType = url.searchParams.get('with_type') || undefined;
  const firstAirDateGte = url.searchParams.get('date.gte') || undefined;
  const firstAirDateLte = url.searchParams.get('date.lte') || undefined;
  const voteAverageGte = url.searchParams.get('vote_average.gte') || undefined;
  const voteAverageLte = url.searchParams.get('vote_average.lte') || undefined;
  const withRuntimeGte = url.searchParams.get('with_runtime.gte') || undefined;
  const withRuntimeLte = url.searchParams.get('with_runtime.lte') || undefined;

  return json(
    {
      shows: await getListDiscover(
        'tv',
        withGenres,
        sortBy,
        locale,
        page,
        undefined,
        undefined,
        firstAirDateGte,
        firstAirDateLte,
        withOriginalLanguage,
        Number(voteCountGte),
        voteAverageGte ? Number(voteAverageGte) : undefined,
        voteAverageLte ? Number(voteAverageLte) : undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        withRuntimeGte ? Number(withRuntimeGte) : undefined,
        withRuntimeLte ? Number(withRuntimeLte) : undefined,
        withStatus,
        withType,
      ),
      withGenres,
      withOriginalLanguage,
      withStatus,
      withType,
      sortBy,
      voteAverageGte,
      voteAverageLte,
      firstAirDateGte,
      firstAirDateLte,
      withRuntimeGte,
      withRuntimeLte,
      voteCountGte: Number(voteCountGte),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.discover,
      },
    },
  );
};

export const handle = {
  breadcrumb: () => (
    <NavLink to="/tv-shows?index" aria-label="Discover tv">
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
          Discover Tv
        </Badge>
      )}
    </NavLink>
  ),
};

const ListTvShows = () => {
  const {
    shows,
    withGenres,
    withOriginalLanguage,
    withStatus,
    withType,
    sortBy,
    firstAirDateGte,
    firstAirDateLte,
    voteAverageGte,
    voteAverageLte,
    withRuntimeGte,
    withRuntimeLte,
    voteCountGte,
  } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const paginationChangeHandler = (page: number) => {
    let url = `?page=${page}`;

    if (withGenres) url += `&with_genres=${withGenres}`;
    if (withOriginalLanguage) url += `&with_original_language=${withOriginalLanguage}`;
    if (withStatus) url += `&with_status=${withStatus}`;
    if (withType) url += `&with_type=${withType}`;
    if (firstAirDateGte) url += `&date.gte=${firstAirDateGte}`;
    if (firstAirDateLte) url += `&date.lte=${firstAirDateLte}`;
    if (voteAverageGte) url += `&vote_average.gte=${voteAverageGte}`;
    if (voteAverageLte) url += `&vote_average.lte=${voteAverageLte}`;
    if (withRuntimeGte) url += `&with_runtime.gte=${withRuntimeGte}`;
    if (withRuntimeLte) url += `&with_runtime.lte=${withRuntimeLte}`;
    if (voteCountGte) url += `&vote_count.gte=${voteCountGte}`;
    if (sortBy) url += `&sort_by=${sortBy}`;

    navigate(url);
  };
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
        responsive={false}
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
            listName={t('discoverTv')}
            showFilterButton
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            mediaType="tv"
            languages={rootData?.languages}
            showPagination
            totalPages={shows.totalPages}
            currentPage={shows.page}
            onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
          />
        )}
      </Container>
    </motion.div>
  );
};

export default ListTvShows;
