/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { json } from '@remix-run/node';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  Outlet,
  NavLink,
  RouteMatch,
  useLocation,
} from '@remix-run/react';
import { Container, Badge } from '@nextui-org/react';

import { getAnimeInfo } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import getProviderList from '~/services/provider.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import AnimeDetail from '~/src/components/media/AnimeDetail';
import WatchTrailerModal from '~/src/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

export const loader = async ({ request, params }: LoaderArgs) => {
  const { animeId } = params;
  const aid = Number(animeId);
  if (!animeId) throw new Response('Not Found', { status: 404 });
  await authenticate(request);
  const detail = await getAnimeInfo(aid);
  if (!detail) throw new Response('Not Found', { status: 404 });
  const title = detail.title?.english || detail.title?.userPreferred || detail.title?.romaji || '';
  const orgTitle = detail.title?.native;
  const year = detail.releaseDate;
  const animeType = detail?.type?.toLowerCase() || 'tv';
  const providers = await getProviderList(
    'anime',
    title,
    orgTitle,
    year,
    undefined,
    aid,
    animeType,
  );

  if (providers && providers.length > 0) {
    return json({ detail, providers });
  }
  return json({ detail }, { headers: { 'Cache-Control': CACHE_CONTROL.detail } });
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Anime',
      description: `There is no anime with the ID: ${params.animeId}`,
    };
  }
  const { detail } = data;
  const { title, color, description } = detail || {};
  return {
    title: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD online Free - Sora`,
    description: description
      ? description?.replace(/<\/?[^>]+(>|$)/g, '')
      : `Watch ${
          title?.userPreferred || title?.english || title?.romaji || title?.native || ''
        } in full HD online with Subtitle`,
    keywords: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, Stream ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD, Online ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, Streaming ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, English, Subtitle ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    }, English Subtitle`,
    ...(color ? { 'theme-color': color } : null),
    'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}`,
    'og:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD online Free - Sora`,
    'og:description': description
      ? description?.replace(/<\/?[^>]+(>|$)/g, '')
      : `Watch ${
          title?.userPreferred || title?.english || title?.romaji || title?.native || ''
        } in full HD online with Subtitle`,
    'og:image': `https://img.anili.st/media/${params.animeId}`,
    'twitter:card': 'summary_large_image',
    'twitter:site': '@sora_anime',
    'twitter:domain': 'sora-anime.vercel.app',
    'twitter:url': `https://sora-anime.vercel.app/anime/${params.animeId}`,
    'twitter:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD online Free - Sora`,
    'twitter:description': description
      ? description?.replace(/<\/?[^>]+(>|$)/g, '')
      : `Watch ${
          title?.userPreferred || title?.english || title?.romaji || title?.native || ''
        } in full HD online with Subtitle`,
    'twitter:image': `https://img.anili.st/media/${params.animeId}`,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink
      to={`/anime/${match.params.animeId}/overview`}
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
};

const AnimeDetailPage = () => {
  const { detail } = useLoaderData<typeof loader>();
  const { state } = useLocation();
  const currentTime = state && (state as { currentTime: number | undefined }).currentTime;
  const [visible, setVisible] = React.useState(false);
  const Handler = () => {
    setVisible(true);
  };
  const closeHandler = () => {
    setVisible(false);
  };

  return (
    <>
      <AnimeDetail item={detail} handler={Handler} />
      <Container
        as="div"
        fluid
        responsive
        justify="center"
        css={{
          display: 'flex',
          margin: 0,
          padding: 0,
        }}
      >
        <Outlet />
      </Container>
      {detail && detail.trailer && (
        <WatchTrailerModal
          trailer={detail.trailer}
          visible={visible}
          closeHandler={closeHandler}
          currentTime={Number(currentTime)}
        />
      )}
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};

export default AnimeDetailPage;
