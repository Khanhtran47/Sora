import * as React from 'react';
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { Container, Row, Radio, Col } from '@nextui-org/react';
import { getMovieDetail } from '~/services/tmdb/movies.server';
import Player from '~/utils/player';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const mid = Number(id);
  return json<LoaderData>({
    detail: await getMovieDetail(mid),
  });
};

const MovieWatch = () => {
  const { detail } = useLoaderData<LoaderData>();
  const location = useLocation();
  const id = location.pathname.split('/')[3];
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(Player.moviePlayerUrl(Number(id), 1));
  // console.log(detail);
  // console.log(source);
  React.useEffect(() => {
    player === '2'
      ? setSource(Player.moviePlayerUrl(detail.imdb_id, Number(player)))
      : setSource(Player.moviePlayerUrl(Number(id), Number(player)));
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
      <Row>
        <iframe
          id="iframe"
          src={source}
          width="100%"
          height="600px"
          frameBorder="0"
          title="movie-player"
        />
      </Row>
    </Container>
  );
};

export default MovieWatch;
