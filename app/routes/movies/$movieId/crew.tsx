/* eslint-disable @typescript-eslint/no-throw-literal */
import { useRef } from 'react';
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Pagination, Spacer } from '@nextui-org/react';

import { authenticate } from '~/services/supabase';
import { getCredits } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import { useMediaQuery } from '@react-hookz/web';

import MediaList from '~/components/media/MediaList';
import Flex from '~/components/styles/Flex.styles';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const { movieId } = params;
  const mid = Number(movieId);

  if (!mid) throw new Response('Not found', { status: 404 });
  const credits = await getCredits('movie', mid);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json(
    { crew: [...postFetchDataHandler(credits.crew, 'people')] },
    { headers: { 'Cache-Control': CACHE_CONTROL.detail } },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/crew`,
});

const MovieCrewPage = () => {
  const { crew } = useLoaderData<typeof loader>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const ref = useRef<HTMLDivElement>(null);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(crew || [], 20);

  return (
    <>
      <Row
        fluid
        justify="center"
        align="center"
        css={{
          display: 'flex',
          flexDirection: 'column',
          '@xsMax': {
            paddingLeft: '$sm',
            paddingRight: '$sm',
          },
        }}
      >
        <div ref={ref} />
        {currentData && currentData.length > 0 && (
          <MediaList
            key={`crew-page-${currentPage}`}
            listType="grid"
            items={currentData}
            virtual
            itemsType="people"
          />
        )}
      </Row>
      <Spacer y={1} />
      {maxPage > 1 && (
        <Flex direction="row" justify="center">
          <Pagination
            total={maxPage}
            initialPage={currentPage}
            // shadow
            onChange={(page) => {
              gotoPage(page);
              ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
              });
            }}
            css={{ marginTop: '2rem' }}
            {...(isSm && { size: 'xs' })}
          />
        </Flex>
      )}
    </>
  );
};

export default MovieCrewPage;
