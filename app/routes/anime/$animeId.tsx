/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, Link, RouteMatch, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { getAnimeInfo } from '~/services/consumet/anilist/anilist.server';
import { authenticate } from '~/services/supabase';

import AnimeDetail from '~/src/components/anime/AnimeDetail';
import WatchTrailerModal from '~/src/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticate(request);

  const { animeId } = params;
  const aid = Number(animeId);

  if (!aid) throw new Response('Not Found', { status: 404 });

  const detail = await getAnimeInfo(aid);

  if (!detail) throw new Response('Not Found', { status: 404 });

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
  const { title, color } = detail;
  return {
    title: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } HD online Free - Sora`,
    description: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } in full HD online with Subtitle`,
    keywords: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    }, Stream ${title?.userPreferred || title?.english || title?.romaji || title?.native}, Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } HD, Online ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    }, Streaming ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    }, English, Subtitle ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    }, English Subtitle`,
    ...(color ? { 'theme-color': color } : null),
    'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}`,
    'og:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } HD online Free - Sora`,
    'og:description': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } in full HD online with Subtitle`,
    'og:image': `https://img.anili.st/media/${params.animeId}`,
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
