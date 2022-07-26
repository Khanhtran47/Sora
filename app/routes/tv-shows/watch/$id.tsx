import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { Container, Row, Radio, Col } from '@nextui-org/react';
import { getTvShowDetail } from '~/services/tmdb/tv.server';
import Player from '~/utils/player';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
};

export const meta: MetaFunction = () => ({
  'Content-Security-Policy': 'upgrade-insecure-requests',
  title: 'My Amazing App',
});

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const mid = Number(id);
  return json<LoaderData>({
    detail: await getTvShowDetail(mid),
  });
};

const TvWatch = () => {
  const { detail } = useLoaderData<LoaderData>();
  const location = useLocation();
  const id = location.pathname.split('/')[3];
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(Player.tvPlayerUrl(Number(id), 1));
  // console.log(detail);
  // console.log(source);
  React.useEffect(() => {
    player === '2'
      ? setSource(Player.tvPlayerUrl(detail.imdb_id, Number(player))) // ! Don't have imdb id for tv show
      : setSource(Player.tvPlayerUrl(Number(id), Number(player)));
  }, [player]);
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
