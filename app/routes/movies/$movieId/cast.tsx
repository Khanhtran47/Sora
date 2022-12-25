/* eslint-disable @typescript-eslint/no-throw-literal */
import { useRef } from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Pagination, Spacer } from '@nextui-org/react';

import { authenticate } from '~/services/supabase';
import { getCredits } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { IMedia } from '~/types/media';

import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import useMediaQuery from '~/hooks/useMediaQuery';

import MediaList from '~/src/components/media/MediaList';
import Flex from '~/src/components/styles/Flex.styles';

type LoaderData = {
  cast: IMedia[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticate(request);

  const { movieId } = params;
  const mid = Number(movieId);

  if (!mid) throw new Response('Not found', { status: 404 });
  const credits = await getCredits('movie', mid);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json<LoaderData>({ cast: [...postFetchDataHandler(credits.cast, 'people')] });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/cast`,
});

const MovieCastPage = () => {
  const { cast } = useLoaderData<LoaderData>();
  const isSm = useMediaQuery('(max-width: 650px)');
  const ref = useRef<HTMLDivElement>(null);
  const { gotoPage, currentPage, maxPage, currentData } = useSplitArrayIntoPage(cast || [], 20);

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
            key={`cast-page-${currentPage}`}
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
              // scroll to top after changing page
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

export default MovieCastPage;
