import { useRef } from 'react';
import { Pagination } from '@nextui-org/pagination';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import type { loader as tvSeasonIdLoader } from '~/routes/tv-shows+/$tvId_.season.$seasonId';
import { i18next } from '~/services/i18n';
import { authenticate } from '~/services/supabase';
import { getTvSeasonCredits } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId, seasonId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not found', { status: 404 });
  const credits = await getTvSeasonCredits(tid, Number(seasonId), locale);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json(
    { crew: [...postFetchDataHandler(credits.crew, 'people')] },
    { headers: { 'Cache-Control': CACHE_CONTROL.detail } },
  );
};

export const meta = mergeMeta<
  null,
  { 'routes/tv-shows+/$tvId_.season.$seasonId': typeof tvSeasonIdLoader }
>(({ params, matches }) => {
  const tvSeasonData = matches.find(
    (match) => match.id === 'routes/tv-shows+/$tvId_.season.$seasonId',
  )?.data;
  if (!tvSeasonData?.seasonDetail) {
    return [
      { title: 'Missing Season' },
      { name: 'description', content: `There is no season with the ID: ${params.seasonId}` },
    ];
  }
  const { detail, seasonDetail } = tvSeasonData;
  const { name } = detail || {};
  return [
    { title: `Sora - ${name} ${seasonDetail?.name || ''} - Crew` },
    {
      property: 'og:url',
      content: `https://sorachill.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/crew`,
    },
    { property: 'og:title', content: `Sora - ${name} ${seasonDetail?.name || ''} - Crew` },
    { name: 'twitter:title', content: `Sora - ${name} ${seasonDetail?.name || ''} - Crew` },
  ];
});

export const handle: Handle = {
  breadcrumb: ({ match, t }) => (
    <BreadcrumbItem
      to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/crew`}
      key={`tv-shows-${match.params.tvId}-season-${match.params.seasonId}-crew`}
    >
      {t('crew')}
    </BreadcrumbItem>
  ),
  miniTitle: ({ parentMatch, t }) => ({
    title: `${parentMatch?.data?.detail?.name || parentMatch?.data?.detail?.original_name} - ${
      parentMatch?.data?.seasonDetail?.name
    }`,
    subtitle: t('crew'),
    showImage: parentMatch?.data?.seasonDetail?.poster_path !== undefined,
    imageUrl: TMDB.posterUrl(parentMatch?.data?.seasonDetail?.poster_path || '', 'w92'),
  }),
};

const TvSeasonCrewPage = () => {
  const { crew } = useLoaderData<typeof loader>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const ref = useRef<HTMLDivElement>(null);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(crew || [], 20);

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      <div ref={ref} />
      <MediaList items={currentData} itemsType="people" listType="grid" />
      {maxPage > 1 ? (
        <div className="mt-7 flex flex-row justify-center">
          <Pagination
            // showControls={!isSm}
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => {
              gotoPage(page);
              ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center',
              });
            }}
            {...(isSm && { size: 'xs' })}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TvSeasonCrewPage;
