/* eslint-disable @typescript-eslint/indent */
import { useRef } from 'react';
import { Badge, Pagination, Spacer } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, useLocation, type RouteMatch } from '@remix-run/react';
import { motion } from 'framer-motion';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getListDetail } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Collection',
      description: `There is no collection with id ${params.collectionsId}`,
    };
  }
  const { detail } = data;
  return {
    title: `${detail?.name || ''} Collection | Sora`,
    description: `${detail?.description || ''}`,
    keywords: `${detail?.name || ''}`,
    'og:url': `https://sora-anime.vercel.app/collections/${params.collectionsId}`,
    'og:title': `${detail?.name || ''} Collection | Sora`,
    'og:description': `${detail?.description || ''}`,
  };
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { collectionsId } = params;
  const cid = Number(collectionsId);

  return json(
    {
      detail: await getListDetail(cid, locale),
    },
    { headers: { 'Cache-Control': CACHE_CONTROL.collection } },
  );
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <NavLink to="/collections" aria-label="Collections">
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
            Collections
          </Badge>
        )}
      </NavLink>
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink
        to={`/collections/${match.params.collectionsId}`}
        aria-label={match.data?.detail?.name || match.params.collectionsId}
      >
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
            {match.data?.detail?.name || match.params.collectionsId}
          </Badge>
        )}
      </NavLink>
    </>
  ),
  miniTitle: (match: RouteMatch) => ({
    title: match.data?.detail?.name || 'Collection',
    showImage: false,
  }),
  showListViewChangeButton: true,
};

const CollectionDetail = () => {
  const { detail } = useLoaderData<typeof loader>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const rootData = useTypedRouteLoaderData('root');
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(
    detail?.items || [],
    20,
  );

  return (
    <motion.div
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center px-3 pb-16 sm:px-0"
    >
      <div ref={ref} />
      {detail && detail.items && detail.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={currentData}
          listName={detail?.name}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          itemsType="movie-tv"
        />
      )}
      <Spacer y={1} />
      {maxPage > 1 && (
        <div className="flex flex-row items-center">
          <Pagination
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => {
              gotoPage(page);
              ref.current?.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'nearest',
              });
            }}
            css={{ marginTop: '2rem' }}
            {...(isSm && { size: 'xs' })}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CollectionDetail;
