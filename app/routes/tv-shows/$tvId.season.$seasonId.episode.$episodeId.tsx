/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  Link,
  RouteMatch,
  useParams,
  useFetcher,
  useLocation,
} from '@remix-run/react';
import { Container, Spacer, Loading, Radio } from '@nextui-org/react';
import { ClientOnly } from 'remix-utils';
import { isDesktop } from 'react-device-detect';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import i18next from '~/i18n/i18next.server';
import { getTvShowDetail, getTvShowIMDBId, getTranslations } from '~/services/tmdb/tmdb.server';
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
import { loklokGetTvEpInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import TMDB from '~/utils/media';
import Player from '~/utils/player';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
import useMediaQuery from '~/hooks/useMediaQuery';
import { User } from '@supabase/supabase-js';
import updateHistory from '~/utils/update-history';
import { getUserFromCookie, insertHistory } from '~/services/supabase';

type LoaderData = {
  provider?: string;
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
  imdbId: Awaited<ReturnType<typeof getTvShowIMDBId>>;
  data?: Awaited<ReturnType<typeof getMovieInfo>>;
  sources?: IMovieSource[] | undefined;
  subtitles?: IMovieSubtitle[] | undefined;
  user?: User;
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Episode',
      description: `This season of tv show doesn't have episode ${params.episodeId}`,
    };
  }
  const { detail } = data;
  return {
    title: `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} HD online Free - Sora`,
    description: `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
    keywords: `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Stream ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} HD, Online ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Streaming ${detail.name} season ${params.seasonId} episode ${params.episodeId}, English, Subtitle ${detail.name} season ${params.seasonId} episode ${params.episodeId}, English Subtitle`,
    'og:url': `https://sora-movie.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/episode/${params.episodeId}`,
    'og:title': `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} HD online Free - Sora`,
    'og:description': `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
    'og:image': TMDB.backdropUrl(detail?.backdrop_path || '', 'w780'),
    refresh: {
      httpEquiv: 'Content-Security-Policy',
      content: 'upgrade-insecure-requests',
    },
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const locale = await i18next.getLocale(request);
  const { tvId, seasonId, episodeId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not Found', { status: 404 });

  const [detail, imdbId, user] = await Promise.all([
    getTvShowDetail(tid),
    getTvShowIMDBId(tid),
    getUserFromCookie(request.headers.get('Cookie') || ''),
  ]);

  if (user) {
    insertHistory({
      user_id: user.id,
      media_type: 'movie',
      duration: (detail?.episode_run_time?.[0] || 0) * 60,
      watched: 0,
      route: url.pathname + url.search,
      media_id: (detail?.id || tid).toString(),
      poster: TMDB.backdropUrl(detail?.backdrop_path || '', 'w300'),
      title: detail?.name || detail?.original_name || undefined,
      overview: detail?.overview || undefined,
      season: seasonId,
      episode: episodeId,
    });
  }

  if (provider === 'Loklok') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const tvDetail = await loklokGetTvEpInfo(idProvider, Number(episodeId) - 1);
    return json<LoaderData>({
      provider,
      detail,
      imdbId,
      sources: tvDetail?.sources,
      subtitles: tvDetail?.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
      })),
      user,
    });
  }
  if (provider === 'Flixhq') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const tvDetail = await getMovieInfo(idProvider);
    const tvEpisodeDetail = tvDetail?.episodes?.find(
      (episode) => episode.season === Number(seasonId) && episode.number === Number(episodeId),
    );
    if (tvEpisodeDetail) {
      const tvEpisodeStreamLink = await getMovieEpisodeStreamLink(
        tvEpisodeDetail?.id || '',
        tvDetail?.id || '',
      );
      return json<LoaderData>({
        provider,
        detail,
        imdbId,
        data: tvDetail,
        sources: tvEpisodeStreamLink?.sources,
        subtitles: tvEpisodeStreamLink?.subtitles,
        user,
      });
    }
  }
  if (provider === 'Embed') {
    return json<LoaderData>({
      detail,
      imdbId,
      user,
    });
  }
  let search;
  let tvDetail;
  let tvEpisodeDetail;
  let tvEpisodeStreamLink;
  if ((detail && detail.original_language === 'en') || locale === 'en') {
    search = await getMovieSearch(detail?.name || '');
    const findMovie: IMovieResult | undefined = search?.results.find(
      (item) => item.title === detail?.name,
    );
    if (findMovie && findMovie.id) {
      tvDetail = await getMovieInfo(findMovie.id);
      tvEpisodeDetail = tvDetail?.episodes?.find(
        (episode) => episode.season === Number(seasonId) && episode.number === Number(episodeId),
      );
      if (tvEpisodeDetail) {
        tvEpisodeStreamLink = await getMovieEpisodeStreamLink(
          tvEpisodeDetail?.id || '',
          tvDetail?.id || '',
        );
      }
    }
  } else {
    const translations = await getTranslations('tv', tid);
    const findTranslation = translations?.translations.find((item) => item.iso_639_1 === 'en');
    if (findTranslation) {
      search = await getMovieSearch(detail?.name || '');
      const findMovie: IMovieResult | undefined = search?.results.find(
        (item) => item.title === detail?.name,
      );
      if (findMovie && findMovie.id) {
        tvDetail = await getMovieInfo(findMovie.id);
        tvEpisodeDetail = tvDetail?.episodes?.find(
          (episode) => episode.season === Number(seasonId) && episode.number === Number(episodeId),
        );
        if (tvEpisodeDetail) {
          tvEpisodeStreamLink = await getMovieEpisodeStreamLink(
            tvEpisodeDetail?.id || '',
            tvDetail?.id || '',
          );
        }
      }
    }
  }

  if (!imdbId || !detail) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    imdbId,
    data: tvDetail,
    sources: tvEpisodeStreamLink?.sources,
    subtitles: tvEpisodeStreamLink?.subtitles,
    user,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link to={`/tv-shows/${match.params.tvId}`}>{match.params.tvId}</Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/`}>
        Season {match.params.seasonId}
      </Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/episode/${match.params.episodeId}`}
      >
        Episode {match.params.episodeId}
      </Link>
    </>
  ),
};

const EpisodeWatch = () => {
  const { provider, detail, imdbId, sources, subtitles, user } = useLoaderData<LoaderData>();
  const { seasonId, episodeId } = useParams();
  const isSm = useMediaQuery(960, 'max');
  const id = detail && detail.id;
  const [player, setPlayer] = React.useState<string>('1');
  const [source, setSource] = React.useState<string>(Player.moviePlayerUrl(Number(id), 1));

  const fetcher = useFetcher();
  const location = useLocation();

  React.useEffect(
    () =>
      player === '2'
        ? setSource(Player.tvPlayerUrl(Number(imdbId), Number(player), Number(episodeId) || 1))
        : setSource(
            Player.tvPlayerUrl(
              Number(detail?.id),
              Number(player),
              Number(seasonId) || 1,
              Number(episodeId),
            ),
          ),
    [player, imdbId, seasonId, episodeId, detail?.id],
  );
  const subtitleSelector = subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
    html: lang.toString(),
    url: url.toString(),
    ...(provider === 'Flixhq' && lang === 'English' && { default: true }),
    ...(provider === 'Loklok' && lang === 'en' && { default: true }),
  }));
  const qualitySelector = sources?.map(
    ({ quality, url }: { quality: number | string; url: string }) => ({
      html: quality.toString(),
      url: url.toString(),
      ...(provider === 'Flixhq' && quality === 'auto' && { default: true }),
      ...(provider === 'Loklok' && Number(quality) === 720 && { default: true }),
    }),
  );
  return (
    <Container
      fluid
      css={{
        paddingTop: '100px',
        paddingLeft: '88px',
        paddingRight: '23px',
        '@smMax': {
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
                    title: detail?.name,
                    url:
                      provider === 'Flixhq'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'auto',
                          )?.url
                        : provider === 'Loklok'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              Number(item.quality) === 720,
                          )?.url
                        : sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'auto',
                          )?.url || '',
                    subtitle: {
                      url:
                        provider === 'Flixhq'
                          ? subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
                            )?.url
                          : provider === 'Loklok'
                          ? subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
                            )?.url
                          : subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
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
                    layers: [
                      {
                        name: 'title',
                        html: `<span>${detail?.name} - SS ${seasonId} - EP ${episodeId}</span>`,
                        style: {
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          fontSize: '1.125rem',
                        },
                      },
                    ],
                  }}
                  qualitySelector={qualitySelector || []}
                  subtitleSelector={subtitleSelector || []}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  subtitleOptions={{
                    parent_tmdb_id: detail?.id,
                    season_number: Number(seasonId),
                    episode_number: Number(episodeId),
                    type: 'episode',
                  }}
                  getInstance={(art) => {
                    art.on('ready', () => {
                      const t = new URLSearchParams(location.search).get('t');
                      if (t) {
                        art.currentTime = Number(t);
                      }
                    });

                    if (user) {
                      updateHistory(
                        art,
                        fetcher,
                        user.id,
                        location.pathname + location.search,
                        'tv',
                        detail?.name || detail?.name || '',
                        detail?.overview || '',
                        seasonId,
                        episodeId,
                      );
                    }
                    art.on('pause', () => {
                      art.layers.title.style.display = 'block';
                    });
                    art.on('play', () => {
                      art.layers.title.style.display = 'none';
                    });
                    art.on('hover', (state: boolean) => {
                      art.layers.title.style.display = state || !art.playing ? 'block' : 'none';
                    });
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

export default EpisodeWatch;

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};
