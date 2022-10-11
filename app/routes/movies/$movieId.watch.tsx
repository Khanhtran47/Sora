/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Link, RouteMatch } from '@remix-run/react';
import { Container, Spacer, Loading, Radio } from '@nextui-org/react';
import { ClientOnly } from 'remix-utils';
import { isDesktop } from 'react-device-detect';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import i18next from '~/i18n/i18next.server';
import { getMovieDetail, getTranslations } from '~/services/tmdb/tmdb.server';
import {
  getMovieSearch,
  getMovieInfo,
  getMovieEpisodeStreamLink,
} from '~/services/consumet/flixhq/flixhq.server';
import {
  IMovieResult,
  IMovieSource,
  IMovieSubtitle,
} from '~/services/consumet/flixhq/flixhq.types';
import TMDB from '~/utils/media';
import Player from '~/utils/player';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
import useMediaQuery from '~/hooks/useMediaQuery';
import { loklokSearchMovieSub } from '~/services/loklok';

export const meta: MetaFunction = () => ({
  refresh: {
    httpEquiv: 'Content-Security-Policy',
    content: 'upgrade-insecure-requests',
  },
});

type DataLoader = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
  data?: Awaited<ReturnType<typeof getMovieInfo>>;
  sources?: IMovieSource[] | undefined;
  subtitles?: IMovieSubtitle[] | undefined;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });
  const detail = await getMovieDetail(mid);
  let search;
  let movieDetail;
  let movieStreamLink;
  let loklokSubtitles: IMovieSubtitle[] = [];
  if ((detail && detail.original_language === 'en') || locale === 'en') {
    search = await getMovieSearch(detail?.title || '');
    const findMovie: IMovieResult | undefined = search?.results.find(
      (item) => item.title === detail?.title,
    );
    if (findMovie && findMovie.id) {
      movieDetail = await getMovieInfo(findMovie.id);
      movieStreamLink = await getMovieEpisodeStreamLink(
        movieDetail?.episodes[0].id || '',
        movieDetail?.id || '',
      );
    }

    loklokSubtitles = await loklokSearchMovieSub(
      detail?.title ?? '',
      detail?.original_title ?? '',
      new Date(detail?.release_date ?? 1000).getFullYear(),
    );
  } else {
    const translations = await getTranslations('movie', mid);
    const findTranslation = translations?.translations.find((item) => item.iso_639_1 === 'en');
    if (findTranslation) {
      search = await getMovieSearch(findTranslation.data?.title || '');
      const findMovie: IMovieResult | undefined = search?.results.find(
        (item) => item.title === findTranslation.data?.title,
      );
      if (findMovie && findMovie.id) {
        movieDetail = await getMovieInfo(findMovie.id);
        movieStreamLink = await getMovieEpisodeStreamLink(
          movieDetail?.episodes[0].id || '',
          movieDetail?.id || '',
        );
      }
      loklokSubtitles = await loklokSearchMovieSub(
        findTranslation.data?.title ?? '',
        '',
        new Date(detail?.release_date ?? 1000).getFullYear(),
      );
    }
  }
  if (!detail) throw new Response('Not Found', { status: 404 });

  return json<DataLoader>({
    detail,
    data: movieDetail,
    sources: movieStreamLink?.sources,
    subtitles: [...(movieStreamLink?.subtitles ?? []), ...loklokSubtitles],
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
  const { detail, data, sources, subtitles } = useLoaderData<DataLoader>();
  const isSm = useMediaQuery(960, 'max');
  const id = detail && detail.id;
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(Player.moviePlayerUrl(Number(id), 1));
  React.useEffect(
    () =>
      player === '2'
        ? setSource(Player.moviePlayerUrl(Number(detail?.imdb_id), Number(player)))
        : setSource(Player.moviePlayerUrl(Number(id), Number(player))),
    [player, detail?.imdb_id, id],
  );
  const subtitleSelector = subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
    html: lang.toString(),
    url: url.toString(),
    ...(lang === 'English' && { default: true }),
  }));
  const qualitySelector = sources?.map(
    ({ quality, url, isM3U8 }: { quality: number | string; url: string; isM3U8: boolean }) => ({
      html: `${quality.toString()}P`,
      url: isM3U8 ? url.toString() : '',
      ...(quality === 'auto' && { default: true }),
    }),
  );
  return (
    <Container
      fluid
      css={{
        paddingTop: '100px',
        paddingLeft: '88px',
        paddingRight: '23px',
        '@mdMax': {
          paddingLeft: '1rem',
          paddingBottom: '65px',
        },
      }}
    >
      <ClientOnly fallback={<Loading type="default" />}>
        {() => (
          <>
            <AspectRatio.Root ratio={7 / 3}>
              {sources ? (
                <ArtPlayer
                  option={{
                    title: data?.title,
                    url:
                      sources?.find(
                        (item: { quality: number | string; url: string }) =>
                          item.quality === 'auto',
                      )?.url || '',
                    subtitle: {
                      url:
                        subtitles?.find(
                          (item: { lang: string; url: string }) => item.lang === 'English',
                        )?.url || '',
                      encoding: 'utf-8',
                      style: {
                        fontSize: isDesktop ? '40px' : '20px',
                      },
                    },
                    poster: TMDB.backdropUrl(detail?.backdrop_path || '', isSm ? 'w780' : 'w1280'),
                    isLive: false,
                    autoMini: true,
                    backdrop: true,
                    playsInline: true,
                    autoPlayback: true,
                  }}
                  qualitySelector={qualitySelector || []}
                  subtitleSelector={subtitleSelector || []}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  subtitleOptions={{
                    tmdb_id: detail?.id,
                    type: 'movie',
                  }}
                  getInstance={(art) => {
                    console.log(art);
                  }}
                />
              ) : (
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
              )}
            </AspectRatio.Root>

            {!sources && (
              <>
                <Spacer y={1} />
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
              </>
            )}
          </>
        )}
      </ClientOnly>
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
