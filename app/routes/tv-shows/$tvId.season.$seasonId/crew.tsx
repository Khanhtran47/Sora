/* eslint-disable @typescript-eslint/no-throw-literal */
import { useRef } from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Pagination, Spacer } from '@nextui-org/react';

import i18next from '~/i18n/i18next.server';
import { authenticate } from '~/services/supabase';
import { getTvSeasonCredits } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { IMedia } from '~/types/media';

import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import useMediaQuery from '~/hooks/useMediaQuery';

import MediaList from '~/src/components/media/MediaList';
import Flex from '~/src/components/styles/Flex.styles';

type LoaderData = {
  crew: IMedia[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const { tvId, seasonId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not found', { status: 404 });
  const credits = await getTvSeasonCredits(tid, Number(seasonId), locale);

  if (!credits) throw new Response('Not found', { status: 404 });

  return json<LoaderData>({ crew: [...postFetchDataHandler(credits.crew, 'people')] });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/crew`,
});

const TvSeasonCrewPage = () => {
  const { crew } = useLoaderData<LoaderData>();
  const isSm = useMediaQuery('(max-width: 650px)');
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

export default TvSeasonCrewPage;
