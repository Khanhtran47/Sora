/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { json, MetaFunction } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Col } from '@nextui-org/react';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { authenticate } from '~/services/supabase';
import { getAnimeEpisodeInfo } from '~/services/consumet/anilist/anilist.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import ListEpisodes from '~/components/elements/shared/ListEpisodes';

export const loader = async ({ params, request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const { animeId } = params;
  if (!animeId) throw new Response('Not Found', { status: 404 });

  const episodes = await getAnimeEpisodeInfo(animeId);
  if (!episodes) throw new Response('Not Found', { status: 404 });
  return json({ episodes }, { headers: { 'Cache-Control': CACHE_CONTROL.episode } });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/episodes`,
});

const EpisodesPage = () => {
  const { episodes } = useLoaderData<typeof loader>();
  const animeData = useTypedRouteLoaderData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;

  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: '0 0.75rem',
        '@xs': {
          padding: '0 3vw',
        },
        '@sm': {
          padding: '0 6vw',
        },
        '@md': {
          padding: '0 12vw',
        },
      }}
    >
      <Col
        css={{
          width: '100%',
          '@xs': { width: '66.6667%' },
        }}
      >
        <ListEpisodes
          type="anime"
          id={detail?.id}
          episodes={episodes}
          providers={animeData?.providers || []}
        />
      </Col>
    </Row>
  );
};

export default EpisodesPage;
