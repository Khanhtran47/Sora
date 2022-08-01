/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, useLocation } from '@remix-run/react';
import { Container, Row, Radio } from '@nextui-org/react';

import { getMovieDetail } from '~/services/tmdb/tmdb.server';
import Player from '~/utils/player';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
};

export const meta: MetaFunction = () => ({
  title: 'My Amazing App',
  refresh: {
    httpEquiv: 'Content-Security-Policy',
    content: 'upgrade-insecure-requests',
  },
});

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const mid = Number(id);

  if (!mid) throw new Response('Not Found', { status: 404 });

  const detail = await getMovieDetail(mid);

  if (!detail) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
  });
};

const MovieWatch = () => {
  const { detail } = useLoaderData<LoaderData>();
  const location = useLocation();
  const id = location.pathname.split('/')[3];
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(Player.moviePlayerUrl(Number(id), 1));
  console.log(detail);
  console.log(source);
  React.useEffect(
    () =>
      player === '2'
        ? setSource(Player.moviePlayerUrl(Number(detail.imdb_id), Number(player)))
        : setSource(Player.moviePlayerUrl(Number(id), Number(player))),
    [player, detail.imdb_id, id],
  );
  return (
    <Container
      fluid
      css={{
        margin: 0,
      }}
    >
      <Row>
        <Radio.Group
          label="Choose Player"
          defaultValue="1"
          orientation="horizontal"
          value={player}
          onChange={setPlayer}
        >
          <Radio value="1">Player 1</Radio>
          <Radio value="2">Player 2</Radio>
          <Radio value="3">Player 3</Radio>
        </Radio.Group>
      </Row>
      <Row css={{ height: '100vh' }}>
        <iframe
          id="iframe"
          src={source}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          frameBorder="0"
          title="movie-player"
          allowFullScreen
          scrolling="no"
          // @ts-expect-error: this is expected
          sandbox
        />
      </Row>
    </Container>
  );
};

export default MovieWatch;

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};
