/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { json, MetaFunction } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Col } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';

import { authenticate } from '~/services/supabase';
import { getAnimeEpisodeInfo } from '~/services/consumet/anilist/anilist.server';
import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import { CACHE_CONTROL } from '~/utils/server/http';

import useMediaQuery from '~/hooks/useMediaQuery';

import ListEpisodes from '~/components/elements/shared/ListEpisodes';

export const loader = async ({ params, request }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const { animeId } = params;
  const aid = Number(animeId);
  if (!aid) throw new Response('Not Found', { status: 404 });

  const episodes = await getAnimeEpisodeInfo(aid);
  if (!episodes) throw new Response('Not Found', { status: 404 });
  return json({ episodes }, { headers: { 'Cache-Control': CACHE_CONTROL.episode } });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/episodes`,
});

const EpisodesPage = () => {
  const { episodes } = useLoaderData<typeof loader>();
  const animeData:
    | {
        detail: IAnimeInfo;
        providers: {
          id?: string | number | null;
          provider: string;
          episodesCount?: number;
        }[];
      }
    | undefined = useRouteData('routes/anime/$animeId');
  const detail = animeData && animeData.detail;
  const isSm = useMediaQuery('(max-width: 650px)');

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
      <Col span={isSm ? 12 : 8}>
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
