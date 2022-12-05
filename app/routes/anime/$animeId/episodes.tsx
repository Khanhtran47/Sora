/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Row, Col } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';

import { authenticate } from '~/services/supabase';
import { getAnimeEpisodeInfo } from '~/services/consumet/anilist/anilist.server';
import { IAnimeInfo } from '~/services/consumet/anilist/anilist.types';
import useMediaQuery from '~/hooks/useMediaQuery';

import ListEpisodes from '~/src/components/elements/shared/ListEpisodes';

type LoaderData = {
  episodes: Awaited<ReturnType<typeof getAnimeEpisodeInfo>>;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  await authenticate(request);

  const { animeId } = params;
  const aid = Number(animeId);
  if (!aid) throw new Response('Not Found', { status: 404 });

  const episodes = await getAnimeEpisodeInfo(aid);
  if (!episodes) throw new Response('Not Found', { status: 404 });
  return json<LoaderData>({ episodes });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/episodes`,
});

const EpisodesPage = () => {
  const { episodes } = useLoaderData<LoaderData>();
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
