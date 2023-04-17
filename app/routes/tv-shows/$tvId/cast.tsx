/* eslint-disable @typescript-eslint/no-throw-literal */
import { useRef } from 'react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Pagination } from '@nextui-org/react';

import { authenticate } from '~/services/supabase';
import { getCredits } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import { useMediaQuery } from '@react-hookz/web';

import MediaList from '~/components/media/MediaList';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const { tvId } = params;
  const mid = Number(tvId);

  if (!mid) throw new Response('Not found', { status: 404 });
  const credits = await getCredits('tv', mid);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json(
    { cast: [...postFetchDataHandler(credits.cast, 'people')] },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/cast`,
});

const TvCastPage = () => {
  const { cast } = useLoaderData<typeof loader>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const ref = useRef<HTMLDivElement>(null);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(cast || [], 20);

  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-y-4 px-3 sm:px-3.5 xl:px-4 2xl:px-5">
      <div ref={ref} />
      {currentData && currentData.length > 0 ? (
        <MediaList
          key={`cast-page-${currentPage}`}
          listType="grid"
          items={currentData}
          virtual
          itemsType="people"
        />
      ) : null}
      {maxPage > 1 ? (
        <div className="flex flex-row justify-center">
          <Pagination
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
            css={{ marginTop: '2rem' }}
            {...(isSm && { size: 'sm' })}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TvCastPage;
