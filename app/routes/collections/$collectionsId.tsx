import { useRef } from 'react';
import { Pagination } from '@nextui-org/pagination';
import { Spacer } from '@nextui-org/spacer';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useLocation, type RouteMatch } from '@remix-run/react';
import { motion } from 'framer-motion';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getListDetail } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

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
      <BreadcrumbItem to="/collections" key="collections">
        Collections
      </BreadcrumbItem>
      <BreadcrumbItem
        to={`/collections/${match.params.collectionsId}`}
        key={`collections-${match.params.collectionsId}`}
      >
        {match.data?.detail?.name || match.params.collectionsId}
      </BreadcrumbItem>
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
      <MediaList
        listType="grid"
        showListTypeChangeButton
        items={currentData}
        listName={detail?.name}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        itemsType="movie-tv"
      />
      <Spacer y={5} />
      {maxPage > 1 && (
        <div className="mt-7 flex flex-row items-center">
          <Pagination
            showControls={!isSm}
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
            {...(isSm && { size: 'xs' })}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CollectionDetail;
