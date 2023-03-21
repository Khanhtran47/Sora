/* eslint-disable @typescript-eslint/indent */
import { json, MetaFunction } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useLocation, NavLink, RouteMatch } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Spacer, Badge, Pagination } from '@nextui-org/react';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';

import { authenticate } from '~/services/supabase';
import { getListDetail } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import MediaList from '~/components/media/MediaList';
import Flex from '~/components/styles/Flex.styles';
import { useMediaQuery } from '@react-hookz/web';

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
};

const CollectionDetail = () => {
  const { detail } = useLoaderData<typeof loader>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const rootData = useTypedRouteLoaderData('root');
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
      className="w-full flex justify-center flex-col items-center px-3 sm:px-0 pb-16"
    >
      {detail && detail.items && detail.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={currentData}
          listName={detail?.name}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          virtual
        />
      )}
      <Spacer y={1} />
      {maxPage > 1 && (
        <Flex direction="row" justify="center">
          <Pagination
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => {
              gotoPage(page);
            }}
            css={{ marginTop: '2rem' }}
            {...(isSm && { size: 'xs' })}
          />
        </Flex>
      )}
    </motion.div>
  );
};

export default CollectionDetail;
