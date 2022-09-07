/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Link, RouteMatch } from '@remix-run/react';
import { Container, Row, Radio, Spacer } from '@nextui-org/react';

import i18next from '~/i18n/i18next.server';
import { getMovieDetail, getMovieTranslations } from '~/services/tmdb/tmdb.server';
import { getSearchMedia, getLoklokMovieDetail } from '~/services/loklok/loklok.server';
import { Result } from '~/services/loklok/loklok.types';
import Player from '~/utils/player';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
import useWindowSize from '~/hooks/useWindowSize';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
  search: Awaited<ReturnType<typeof getSearchMedia>>;
  movieDetail: Awaited<ReturnType<typeof getLoklokMovieDetail>>;
};

export const meta: MetaFunction = () => ({
  refresh: {
    httpEquiv: 'Content-Security-Policy',
    content: 'upgrade-insecure-requests',
  },
});

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });
  const detail = await getMovieDetail(mid);
  let search;
  let movieDetail;
  if ((detail && detail.original_language === 'en') || locale === 'en') {
    search = await getSearchMedia(detail?.title || '');
    const findMovie: Result | undefined = search?.find((item) => item.name === detail?.title);
    if (findMovie && findMovie.id) {
      movieDetail = await getLoklokMovieDetail(Number(findMovie.id));
    }
  } else {
    const translations = await getMovieTranslations('movie', mid);
    const findTranslation = translations?.translations.find((item) => item.iso_639_1 === 'en');
    if (findTranslation) {
      search = await getSearchMedia(findTranslation.data?.title || '');
      const findMovie: Result | undefined = search?.find(
        (item) => item.name === findTranslation.data?.title,
      );
      if (findMovie && findMovie.id) {
        movieDetail = await getLoklokMovieDetail(Number(findMovie.id));
      }
    }
  }

  if (!detail || !search) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    search,
    movieDetail,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link to={`/movies/${match.params.movieId}`}>{match.params.movieId}</Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link to={`/movies/${match.params.movieId}/watch`}>Watch</Link>
    </>
  ),
};

const MovieWatch = () => {
  const { detail, search, movieDetail } = useLoaderData<LoaderData>();
  console.log('🚀 ~ file: $movieId.watch.tsx ~ line 62 ~ MovieWatch ~ movieDetail', movieDetail);
  console.log('🚀 ~ file: $movieId.watch.tsx ~ line 57 ~ MovieWatch ~ search', search);
  const id = detail && detail.id;
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(Player.moviePlayerUrl(Number(id), 1));
  const { width } = useWindowSize();
  React.useEffect(
    () =>
      player === '2'
        ? setSource(Player.moviePlayerUrl(Number(detail?.imdb_id), Number(player)))
        : setSource(Player.moviePlayerUrl(Number(id), Number(player))),
    [player, detail?.imdb_id, id],
  );
  return (
    <Container
      fluid
      css={{
        paddingTop: '100px',
        paddingLeft: '88px',
        paddingRight: 0,
        '@mdMax': {
          paddingLeft: '1rem',
          paddingBottom: '65px',
        },
      }}
    >
      {/* <Row>
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
          scrolling="no"
          // @ts-expect-error: this is expected
          sandbox
        />
      </Row> */}
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
