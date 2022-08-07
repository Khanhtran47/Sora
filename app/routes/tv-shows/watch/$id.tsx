/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, useParams } from '@remix-run/react';
import { Container, Row, Radio, Dropdown, Spacer } from '@nextui-org/react';

import { getTvShowDetail, getTvShowIMDBId } from '~/services/tmdb/tmdb.server';
import Player from '~/utils/player';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
  imdbId: Awaited<ReturnType<typeof getTvShowIMDBId>>;
};

export const meta: MetaFunction = () => ({
  'Content-Security-Policy': 'upgrade-insecure-requests',
  title: 'My Amazing App',
});

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const tid = Number(id);

  if (!tid) throw new Response('Not Found', { status: 404 });
  const detail = await getTvShowDetail(tid);
  const imdbId = await getTvShowIMDBId(tid);

  if (!imdbId) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    imdbId,
  });
};

const TvWatch = () => {
  const { detail, imdbId } = useLoaderData<LoaderData>();
  const { id } = useParams();
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(Player.tvPlayerUrl(Number(id), 1, 1, 1));
  const [season, setSeason] = React.useState(new Set([detail?.seasons[1]?.name]));
  const [listEpisode, setListEpisode] = React.useState<number[]>([]);
  const [episode, setEpisode] = React.useState(new Set(['1']));

  const selectedSeason = React.useMemo(
    () => Array.from(season).join(', ').replaceAll('_', ' '),
    [season],
  );
  const selectedEpisode = React.useMemo(
    () => Array.from(episode).join(', ').replaceAll('_', ' '),
    [episode],
  );

  React.useEffect(() => {
    const seasonInfo = detail?.seasons.find((s) => s?.name === season.values().next().value);
    setListEpisode(Array.from({ length: seasonInfo?.episode_count || 0 }, (_, i) => i + 1));
  }, [season]);

  React.useEffect(() => {
    const seasonInfo = detail?.seasons.find((s) => s?.name === season.values().next().value);
    player === '2'
      ? setSource(Player.tvPlayerUrl(imdbId, Number(player), seasonInfo?.season_number || 1))
      : setSource(
          Player.tvPlayerUrl(
            Number(id),
            Number(player),
            seasonInfo?.season_number || 1,
            Number(episode.values().next().value),
          ),
        );
  }, [player, imdbId, id, season, episode]);
  return (
    <Container fluid>
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
      <Spacer y={1} />
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
          // @ts-expect-error: this is expected
          sandbox
        />
      </Row>
      <Spacer y={1} />
      <Row>
        <Dropdown>
          <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedSeason}</Dropdown.Button>
          <Dropdown.Menu
            aria-label="Single selection actions"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={season}
            onSelectionChange={setSeason}
          >
            {detail?.seasons.map((item) => (
              <Dropdown.Item key={item?.name}>{item?.name}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Spacer x={1} />
        <Dropdown>
          <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedEpisode}</Dropdown.Button>
          <Dropdown.Menu
            aria-label="Single selection actions"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={episode}
            onSelectionChange={setEpisode}
          >
            {listEpisode.map((item) => (
              <Dropdown.Item key={item.toString()}>{item}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Row>
    </Container>
  );
};

export default TvWatch;

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};
