/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, Link, RouteMatch, useFetcher } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { getTvShowDetail } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import MediaDetail from '~/src/components/media/MediaDetail';
import WatchTrailerModal, { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { tvId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not Found', { status: 404 });

  const detail = await getTvShowDetail(tid, locale);

  if (!tid) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ detail });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/tv-show/${match.params.tvId}`}>{match.params.tvId}</Link>
  ),
};

const TvShowDetail = () => {
  const { detail } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const [visible, setVisible] = React.useState(false);
  const [trailer, setTrailer] = React.useState<Trailer>({});
  const Handler = (id: number) => {
    setVisible(true);
    fetcher.load(`/tv-shows/${id}/videos`);
  };
  const closeHandler = () => {
    setVisible(false);
    setTrailer({});
  };
  React.useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);

  return (
    <>
      <MediaDetail type="tv" item={detail} handler={Handler} />
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
      <WatchTrailerModal trailer={trailer} visible={visible} closeHandler={closeHandler} />
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

export default TvShowDetail;
