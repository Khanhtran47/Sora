import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { Container, Row, Radio } from '@nextui-org/react';

import { getTvShowIMDBId } from '~/services/tmdb/tmdb.server';
import Player from '~/utils/player';

type LoaderData = {
  imdbId: Awaited<ReturnType<typeof getTvShowIMDBId>>;
};

export const meta: MetaFunction = () => ({
  'Content-Security-Policy': 'upgrade-insecure-requests',
  title: 'My Amazing App',
});

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const tid = Number(id);
  return json<LoaderData>({
    imdbId: await getTvShowIMDBId(tid),
  });
};

const TvWatch = () => {
  const { imdbId } = useLoaderData<LoaderData>();
  const { id } = useParams();
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(Player.tvPlayerUrl(Number(id), 1));

  React.useEffect(
    () =>
      player === '2'
        ? setSource(Player.tvPlayerUrl(imdbId, Number(player))) // ! Don't have imdb id for tv show
        : setSource(Player.tvPlayerUrl(Number(id), Number(player))),
    [player, imdbId, id],
  );
  return (
    <Container
      fluid
      css={{
        margin: 0,
        padding: 0,
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
            width: '70%',
            height: '70%',
          }}
          frameBorder="0"
          title="movie-player"
          allowFullScreen
          scrolling="no"
          sandbox
        />
      </Row>
    </Container>
  );
};

export default TvWatch;
