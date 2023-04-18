/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */

import { Badge, Col, Row } from '@nextui-org/react';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import { NavLink, useLoaderData, type RouteMatch } from '@remix-run/react';

import { getAnimeEpisodeInfo } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
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

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink
      to={`/anime/${match.params.animeId}/`}
      aria-label={match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
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
          {match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
        </Badge>
      )}
    </NavLink>
  ),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  miniTitle: (match: RouteMatch, parentMatch?: RouteMatch) => ({
    title:
      parentMatch?.data?.detail?.title?.userPreferred ||
      parentMatch?.data?.detail?.title?.english ||
      parentMatch?.data?.detail?.title?.romaji ||
      parentMatch?.data?.detail?.title?.native ||
      '',
    subtitle: 'Episodes',
    showImage: parentMatch?.data?.detail?.image !== undefined,
    imageUrl: parentMatch?.data?.detail?.image,
  }),
  preventScrollToTop: true,
  disableLayoutPadding: true,
  customHeaderBackgroundColor: true,
  customHeaderChangeColorOnScroll: true,
};

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
