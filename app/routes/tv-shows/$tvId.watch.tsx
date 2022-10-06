/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Link, RouteMatch } from '@remix-run/react';
import { Container, Row, Radio, Dropdown, Spacer } from '@nextui-org/react';

import { getTvShowDetail, getTvShowIMDBId } from '~/services/tmdb/tmdb.server';
import Player from '~/utils/player';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
import useWindowSize from '~/hooks/useWindowSize';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
  imdbId: Awaited<ReturnType<typeof getTvShowIMDBId>>;
};

export const meta: MetaFunction = () => ({
  refresh: {
    httpEquiv: 'Content-Security-Policy',
    content: 'upgrade-insecure-requests',
  },
});

export const loader: LoaderFunction = async ({ params }) => {
  const { tvId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not Found', { status: 404 });

  const [detail, imdbId] = await Promise.all([getTvShowDetail(tid), getTvShowIMDBId(tid)]);

  if (!imdbId || !detail) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    imdbId,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link to={`/tv-shows/${match.params.tvId}`}>{match.params.tvId}</Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link to={`/tv-shows/${match.params.tvId}/watch`}>Watch</Link>
    </>
  ),
};

const TvWatch = () => {
  const { detail, imdbId } = useLoaderData<LoaderData>();
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(
    Player.tvPlayerUrl(Number(detail?.id), 1, 1, 1),
  );
  const [season, setSeason] = React.useState(
    new Set([detail && detail.seasons && detail.seasons[1]?.name]),
  );
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
  const { width } = useWindowSize();

  React.useEffect(() => {
    const seasonInfo = detail?.seasons?.find((s) => s?.name === season.values().next().value);
    setListEpisode(Array.from({ length: seasonInfo?.episode_count || 0 }, (_, i) => i + 1));
  }, [season]);

  React.useEffect(() => {
    const seasonInfo = detail?.seasons?.find((s) => s?.name === season.values().next().value);
    player === '2'
      ? setSource(
          Player.tvPlayerUrl(Number(imdbId), Number(player), seasonInfo?.season_number || 1),
        )
      : setSource(
          Player.tvPlayerUrl(
            Number(detail?.id),
            Number(player),
            seasonInfo?.season_number || 1,
            Number(episode.values().next().value),
          ),
        );
  }, [player, imdbId, detail?.id, season, episode]);
  return (
    <Container
      fluid
      css={{
        paddingTop: '100px',
        paddingLeft: '88px',
        paddingRight: 0,
        '@smMax': {
          paddingLeft: '1rem',
          paddingBottom: '65px',
        },
      }}
    >
      <Row>
        <iframe
          id="iframe"
          src={source}
          style={{
            top: 0,
            left: 0,
            width: `${width && width < 960 ? `${width - 32}px` : `${width && width - 100}px`}`,
            height: `${width && width < 960 ? `${(width - 16) / 1.5}px` : '577px'}`,
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
