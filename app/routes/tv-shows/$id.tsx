/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet } from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { getTvShowDetail } from '~/services/tmdb/tmdb.server';
import MediaDetail from '~/src/components/Media/MediaDetail';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { id } = params;
  const tid = Number(id);

  if (!tid) throw new Response('Not Found', { status: 404 });

  const detail = await getTvShowDetail(tid, locale);

  if (!tid) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ detail });
};

const TvShowDetail = () => {
  const { detail } = useLoaderData<LoaderData>();

  return (
    <>
      <MediaDetail type="tv" item={detail} />
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
