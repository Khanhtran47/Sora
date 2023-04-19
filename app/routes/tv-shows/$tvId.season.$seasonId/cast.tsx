/* eslint-disable @typescript-eslint/no-throw-literal */
import { useRef } from 'react';
import { Badge, Pagination, Row, Spacer } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, type RouteMatch } from '@remix-run/react';
import i18next from '~/i18n/i18next.server';

import { authenticate } from '~/services/supabase';
import { getTvSeasonCredits } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import useSplitArrayIntoPage from '~/hooks/useSplitArrayIntoPage';
import MediaList from '~/components/media/MediaList';
import Flex from '~/components/styles/Flex.styles';

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
    <NavLink
      to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/cast`}
      aria-label="Cast"
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
          Cast
        </Badge>
      )}
    </NavLink>
  ),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  miniTitle: (match: RouteMatch, parentMatch: RouteMatch) => ({
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
                block: 'start',
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

export default TvSeasonCastPage;
