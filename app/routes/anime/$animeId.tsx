/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { LoaderFunction, json, MetaFunction, redirect } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, Link, RouteMatch, useLocation } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { getAnimeInfo } from '~/services/consumet/anilist/anilist.server';
import { getUserFromCookie, verifyReqPayload } from '~/services/supabase';

import AnimeDetail from '~/src/components/anime/AnimeDetail';
import WatchTrailerModal from '~/src/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [user, verified] = await Promise.all([
    getUserFromCookie(request.headers.get('Cookie') || ''),
    await verifyReqPayload(request),
  ]);

  if (!user || !verified) return redirect('/sign-out?ref=/sign-in');

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
  const { title } = detail;
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
    'og:url': `https://sora-movie.vercel.app/anime/${params.animeId}`,
    'og:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } HD online Free - Sora`,
    'og:description': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } in full HD online with Subtitle`,
    'og:image': detail.cover,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/anime/${match.params.animeId}/overview`}>{match.params.animeId}</Link>
  ),
};

const MovieDetail = () => {
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
        css={{
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

export default MovieDetail;
