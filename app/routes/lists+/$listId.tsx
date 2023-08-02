import { useRef } from 'react';
import { Pagination } from '@nextui-org/pagination';
import { Spacer } from '@nextui-org/spacer';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import { motion } from 'framer-motion';

import type { Handle } from '~/types/handle';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getListDetail } from '~/services/tmdb/tmdb.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const meta = mergeMeta<typeof loader>(({ data, params }) => {
  if (!data) {
    return [
      { title: 'Missing List' },
      { name: 'description', content: `There is no list with id ${params.listId}` },
    ];
  }
  const { detail } = data;
  return [
    { title: `Sora - ${detail?.name || ''}` },
    { name: 'description', content: `${detail?.description || ''}` },
    { name: 'keywords', content: `${detail?.name || ''}` },
    {
      property: 'og:url',
      content: `https://sorachill.vercel.app/lists/${params.listId}`,
    },
    { property: 'og:title', content: `Sora - ${detail?.name || ''}` },
    { property: 'og:description', content: `${detail?.description || ''}` },
    { name: 'twitter:title', content: `Sora - ${detail?.name || ''}` },
    { name: 'twitter:description', content: `${detail?.description || ''}` },
  ];
});

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { listId } = params;
  const cid = Number(listId);

  return json(
    {
      detail: await getListDetail(cid, locale),
    },
    { headers: { 'Cache-Control': CACHE_CONTROL.collection } },
  );
};

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <>
      <BreadcrumbItem to="/lists/" key="lists">
        {t('featured-lists')}
      </BreadcrumbItem>
      <BreadcrumbItem to={`/lists/${match.params.listId}`} key={`lists-${match.params.listId}`}>
        {match.data?.detail?.name || match.params.listId}
      </BreadcrumbItem>
    </>
  ),
  miniTitle: ({ match, t }) => ({
    title: match.data?.detail?.name || t('featured-lists'),
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
            // showControls={!isSm}
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
            {...(isSm && { size: 'sm' })}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CollectionDetail;
