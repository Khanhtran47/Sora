/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, Link, RouteMatch, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { getAnimeInfo } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';
import getProviderList from '~/services/provider.server';

import AnimeDetail from '~/src/components/media/AnimeDetail';
import WatchTrailerModal from '~/src/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
  providers?: {
    id?: string | number | null;
    provider: string;
    episodesCount?: number;
  }[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
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
  return json<LoaderData>({ detail });
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Anime',
      description: `There is no anime with the ID: ${params.animeId}`,
    };
  }
  const { detail } = data;
  const { title, color, description } = detail;
  return {
    title: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } HD online Free - Sora`,
    description:
      description.replace(/<\/?[^>]+(>|$)/g, '') ||
      `Watch ${
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
    'og:description':
      description.replace(/<\/?[^>]+(>|$)/g, '') ||
      `Watch ${
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
    'twitter:description':
      description.replace(/<\/?[^>]+(>|$)/g, '') ||
      `Watch ${
        title?.userPreferred || title?.english || title?.romaji || title?.native || ''
      } in full HD online with Subtitle`,
    'twitter:image': `https://img.anili.st/media/${params.animeId}`,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link
      to={`/anime/${match.params.animeId}/overview`}
      aria-label={match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
    >
      {match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
    </Link>
  ),
};

const AnimeDetailPage = () => {
  const { detail } = useLoaderData<LoaderData>();
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
