/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, Link, RouteMatch } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { getAnimeInfo } from '~/services/consumet/anilist/anilist.server';
import AnimeDetail from '~/src/components/anime/AnimeDetail';
import WatchTrailerModal from '~/src/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { animeId } = params;
  const aid = Number(animeId);

  if (!aid) throw new Response('Not Found', { status: 404 });

  const detail = await getAnimeInfo(aid);

  if (!detail) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ detail });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/anime/${match.params.animeId}/overview`}>{match.params.animeId}</Link>
  ),
};

const MovieDetail = () => {
  const { detail } = useLoaderData<LoaderData>();
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
        <WatchTrailerModal trailer={detail.trailer} visible={visible} closeHandler={closeHandler} />
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
