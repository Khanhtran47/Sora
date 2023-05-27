import { useRef } from 'react';
import { Pagination } from '@nextui-org/pagination';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, type RouteMatch } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getTvSeasonCredits } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const locale = await i18next.getLocale(request);
  const { tvId, seasonId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not found', { status: 404 });
  const credits = await getTvSeasonCredits(tid, Number(seasonId), locale);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json(
    { cast: [...postFetchDataHandler(credits.cast, 'people')] },
    { headers: { 'Cache-Control': CACHE_CONTROL.detail } },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/cast`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <BreadcrumbItem
      to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/cast`}
      key={`tv-shows-${match.params.tvId}-season-${match.params.seasonId}-cast`}
    >
      Cast
    </BreadcrumbItem>
  ),
  miniTitle: (_match: RouteMatch, parentMatch: RouteMatch) => ({
    title: `${parentMatch.data?.detail?.name || parentMatch.data?.detail?.original_name} - ${
      parentMatch.data?.seasonDetail?.name
    }`,
    subtitle: 'Cast',
    showImage: parentMatch.data?.seasonDetail?.poster_path !== undefined,
    imageUrl: TMDB.posterUrl(parentMatch.data?.seasonDetail?.poster_path || '', 'w92'),
  }),
};

const TvSeasonCastPage = () => {
  const { cast } = useLoaderData<typeof loader>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const ref = useRef<HTMLDivElement>(null);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(cast || [], 20);

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      <div ref={ref} />
      <MediaList listType="grid" items={currentData} itemsType="people" />
      {maxPage > 1 ? (
        <div className="mt-7 flex flex-row justify-center">
          <Pagination
            showControls={!isSm}
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => {
              gotoPage(page);
              // scroll to top after changing page
              ref.current?.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'nearest',
              });
            }}
            {...(isSm && { size: 'xs' })}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TvSeasonCastPage;
