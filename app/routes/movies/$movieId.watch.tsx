/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { Suspense, useMemo } from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  NavLink,
  RouteMatch,
  useFetcher,
  useLocation,
} from '@remix-run/react';
import { Container, Spacer, Loading, Badge } from '@nextui-org/react';
import { ClientOnly, useRouteData } from 'remix-utils';
import { isDesktop } from 'react-device-detect';
import Hls from 'hls.js';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';

import { authenticate, insertHistory } from '~/services/supabase';
import {
  getMovieDetail,
  getRecommendation,
  // getTranslations,
  getImdbRating,
} from '~/services/tmdb/tmdb.server';
import {
  // getMovieSearch,
  getMovieInfo,
  getMovieEpisodeStreamLink,
} from '~/services/consumet/flixhq/flixhq.server';
import {
  // IMovieResult,
  IMovieSource,
  IMovieSubtitle,
} from '~/services/consumet/flixhq/flixhq.types';
import {
  getKissKhInfo,
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
} from '~/services/kisskh/kisskh.server';
import {
  // loklokSearchMovieSub,
  loklokGetMovieInfo,
} from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
// import i18next from '~/i18n/i18next.server';
import TMDB from '~/utils/media';
import updateHistory from '~/utils/update-history';
import useMediaQuery from '~/hooks/useMediaQuery';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import PlayerError from '~/src/components/elements/player/PlayerError';
import WatchDetail from '~/src/components/elements/shared/WatchDetail';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Movie',
      description: `There is no movie with the ID: ${params.movieId}`,
    };
  }
  const { detail } = data || {};
  return {
    title: `Watch ${detail?.title || ''} HD online Free - Sora`,
    description: `Watch ${detail?.title || ''} in full HD online with Subtitle`,
    keywords: `Watch ${detail?.title || ''}, Stream ${detail?.title || ''}, Watch ${
      detail?.title || ''
    } HD, Online ${detail?.title || ''}, Streaming ${detail?.title || ''}, English, Subtitle ${
      detail?.title || ''
    }, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/watch`,
    'og:title': `Watch ${detail?.title || ''} HD online Free - Sora`,
    'og:description': `Watch ${detail?.title || ''} in full HD online with Subtitle`,
    'og:image': detail?.backdrop_path ? TMDB.backdropUrl(detail?.backdrop_path, 'w780') : undefined,
    refresh: {
      httpEquiv: 'Content-Security-Policy',
      content: 'upgrade-insecure-requests',
    },
  };
};

type DataLoader = {
  provider?: string;
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
  recommendations: Awaited<ReturnType<typeof getRecommendation>>;
  data?: Awaited<ReturnType<typeof getMovieInfo>>;
  sources?: IMovieSource[] | undefined;
  subtitles?: IMovieSubtitle[] | undefined;
  userId?: string;
  imdbRating?: { count: number; star: number };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticate(request, true, true, true);

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid || !provider || !idProvider) throw new Response('Not Found', { status: 404 });
  const [detail, recommendations] = await Promise.all([
    getMovieDetail(mid),
    getRecommendation('movie', mid),
  ]);
  if (!detail) throw new Response('Not Found', { status: 404 });

  if (user) {
    insertHistory({
      user_id: user.id,
      media_type: 'movie',
      duration: (detail?.runtime || 0) * 60,
      watched: 0,
      route: url.pathname + url.search,
      media_id: (detail?.id || mid).toString(),
      poster: TMDB.backdropUrl(detail?.backdrop_path || '', 'w300'),
      title: detail?.title || detail?.original_title || undefined,
      overview: detail?.overview || undefined,
    });
  }

  if (provider === 'Loklok') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [movieDetail, imdbRating] = await Promise.all([
      loklokGetMovieInfo(idProvider),
      detail?.imdb_id ? getImdbRating(detail?.imdb_id) : undefined,
    ]);
    return json<DataLoader>({
      provider,
      detail,
      recommendations,
      imdbRating,
      sources: movieDetail?.sources,
      subtitles: movieDetail?.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
      })),
      userId: user?.id,
    });
  }

  if (provider === 'Flixhq') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [movieDetail, imdbRating] = await Promise.all([
      getMovieInfo(idProvider),
      detail?.imdb_id ? getImdbRating(detail?.imdb_id) : undefined,
    ]);
    const movieStreamLink = await getMovieEpisodeStreamLink(
      movieDetail?.episodes[0].id || '',
      movieDetail?.id || '',
    );
    return json<DataLoader>({
      provider,
      detail,
      recommendations,
      imdbRating,
      data: movieDetail,
      sources: movieStreamLink?.sources,
      subtitles: movieStreamLink?.subtitles,
      userId: user?.id,
    });
  }

  if (provider === 'KissKh') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [episodeDetail, imdbRating] = await Promise.all([
      getKissKhInfo(Number(idProvider)),
      detail?.imdb_id ? getImdbRating(detail?.imdb_id) : undefined,
    ]);
    const [episodeStream, episodeSubtitle] = await Promise.all([
      getKissKhEpisodeStream(Number(episodeDetail?.episodes[0]?.id)),
      episodeDetail?.episodes[0] && episodeDetail?.episodes[0].sub > 0
        ? getKissKhEpisodeSubtitle(Number(episodeDetail?.episodes[0]?.id))
        : undefined,
    ]);

    return json<DataLoader>({
      provider,
      detail,
      recommendations,
      imdbRating,
      sources: [{ url: episodeStream?.Video || '', isM3U8: true, quality: 'auto' }],
      subtitles: episodeSubtitle?.map((sub) => ({
        lang: sub.label,
        url: sub.src,
        ...(sub.default && { default: true }),
      })),
      userId: user?.id,
    });
  }

  if (provider === 'Embed') {
    const imdbRating = detail?.imdb_id ? await getImdbRating(detail?.imdb_id) : undefined;
    return json<DataLoader>({
      detail,
      recommendations,
      imdbRating,
      userId: user?.id,
    });
  }
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <NavLink
        to={`/movies/${match.params.movieId}`}
        aria-label={match.data?.detail?.title || match.params.movieId}
      >
        {({ isActive }) => (
          <Badge
            color="primary"
            variant="flat"
            css={{
              opacity: isActive ? 1 : 0.7,
              transition: 'opacity 0.25s ease 0s',
              '&:hover': { opacity: 0.8 },
            }}
          >
            {match.data?.detail?.title || match.params.movieId}
          </Badge>
        )}
      </NavLink>
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink to={`/movies/${match.params.movieId}/watch`}>
        {({ isActive }) => (
          <Badge
            color="primary"
            variant="flat"
            css={{
              opacity: isActive ? 1 : 0.7,
              transition: 'opacity 0.25s ease 0s',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Watch
          </Badge>
        )}
      </NavLink>
    </>
  ),
};

const MovieWatch = () => {
  const { provider, detail, recommendations, imdbRating, sources, subtitles, userId } =
    useLoaderData<DataLoader>();
  const rootData:
    | {
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const isSm = useMediaQuery('(max-width: 650px)');
  const id = detail && detail.id;
  const fetcher = useFetcher();
  const location = useLocation();
  const releaseYear = new Date(detail?.release_date || '').getFullYear();
  const qualitySelector = useMemo<
    | {
        default?: boolean | undefined;
        html: string;
        url: string;
        isM3U8: boolean;
        isDASH: boolean;
      }[]
    | undefined
  >(
    () =>
      sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
        html: quality.toString(),
        url: url.toString().startsWith('http:')
          ? `https://cors.proxy.consumet.org/${url.toString()}`
          : url.toString(),
        isM3U8: true,
        isDASH: false,
        ...(provider === 'Flixhq' && quality === 'auto' && { default: true }),
        ...(provider === 'Loklok' && Number(quality) === 720 && { default: true }),
      })),
    [provider, sources],
  );

  const subtitleSelector = useMemo<
    | {
        default?: boolean | undefined;
        html: string;
        url: string;
      }[]
    | undefined
  >(
    ():
      | {
          default?: boolean | undefined;
          html: string;
          url: string;
        }[]
      | undefined =>
      subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
        html: lang.toString(),
        url: url.toString(),
        ...(provider === 'Flixhq' && lang === 'English' && { default: true }),
        ...(provider === 'KissKh' && lang === 'English' && { default: true }),
        ...(provider === 'Loklok' && lang.includes('en') && { default: true }),
      })),
    [provider, subtitles],
  );
  return (
    <Container fluid responsive css={{ margin: 0, padding: 0 }}>
      <ClientOnly fallback={<Loading type="default" />}>
        {() => (
          <Suspense fallback={<Loading type="default" />}>
            {sources ? (
              <ArtPlayer
                key={`${detail?.id}-${provider}`}
                id={Number(id)}
                type="movie"
                autoPlay={false}
                option={{
                  title: detail?.title,
                  url:
                    provider === 'Flixhq'
                      ? sources?.find(
                          (item: { quality: number | string; url: string }) =>
                            item.quality === 'auto',
                        )?.url || sources[0]?.url
                      : provider === 'Loklok'
                      ? sources?.find(
                          (item: { quality: number | string; url: string }) =>
                            Number(item.quality) === 720,
                        )?.url || sources[0]?.url
                      : provider === 'KissKh'
                      ? sources[0]?.url
                      : sources?.find(
                          (item: { quality: number | string; url: string }) =>
                            item.quality === 'auto',
                        )?.url || sources[0]?.url,
                  subtitle: {
                    url:
                      provider === 'Flixhq'
                        ? subtitles?.find((item: { lang: string; url: string }) =>
                            item.lang.includes('English'),
                          )?.url || ''
                        : provider === 'Loklok'
                        ? subtitles?.find((item: { lang: string; url: string }) =>
                            item.lang.includes('English'),
                          )?.url || ''
                        : provider === 'KissKh'
                        ? subtitles?.find(
                            (item: { lang: string; url: string; default?: boolean }) =>
                              item.default,
                          )?.url || ''
                        : subtitles?.find((item: { lang: string; url: string }) =>
                            item.lang.includes('English'),
                          )?.url || '',
                    encoding: 'utf-8',
                    type:
                      provider === 'Flixhq' || provider === 'Loklok'
                        ? 'vtt'
                        : provider === 'KissKh'
                        ? 'srt'
                        : '',
                    style: {
                      fontSize: isDesktop ? '40px' : '20px',
                    },
                  },
                  poster: TMDB.backdropUrl(detail?.backdrop_path || '', isSm ? 'w780' : 'w1280'),
                  isLive: false,
                  backdrop: true,
                  playsInline: true,
                  autoPlayback: true,
                  layers: [
                    {
                      name: 'title',
                      html: `<span>${detail?.title}</span>`,
                      style: {
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        fontSize: '1.125rem',
                      },
                    },
                  ],
                  customType: {
                    m3u8: (video: HTMLMediaElement, url: string) => {
                      if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                      } else {
                        const canPlay = video.canPlayType('application/vnd.apple.mpegurl');
                        if (canPlay === 'probably' || canPlay === 'maybe') {
                          video.src = url;
                        }
                      }
                    },
                  },
                  plugins:
                    provider === 'KissKh'
                      ? [
                          artplayerPluginHlsQuality({
                            setting: true,
                            title: 'Quality',
                            auto: 'Auto',
                          }),
                        ]
                      : [],
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
                  title: detail?.title,
                  sub_format: provider === 'KissKh' ? 'srt' : 'webvtt',
                }}
                getInstance={(art) => {
                  art.on('ready', () => {
                    const t = new URLSearchParams(location.search).get('t');
                    if (t) {
                      art.currentTime = Number(t);
                    }
                  });
                  if (userId) {
                    updateHistory(
                      art,
                      fetcher,
                      userId,
                      location.pathname + location.search,
                      'movie',
                      detail?.title || detail?.original_title || '',
                      detail?.overview || '',
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
              <PlayerError
                title="Video not found"
                message="The video you are trying to watch is not available."
              />
            )}
          </Suspense>
        )}
      </ClientOnly>
      <Container
        fluid
        alignItems="stretch"
        justify="center"
        css={{
          marginTop: '0.75rem',
          padding: '0 0.75rem',
          '@xs': {
            padding: '0 3vw',
          },
          '@sm': {
            padding: '0 6vw',
          },
          '@md': {
            padding: '0 12vw',
          },
        }}
      >
        <WatchDetail
          id={Number(id)}
          type="movie"
          title={`${detail?.title} (${releaseYear})`}
          overview={detail?.overview || ''}
          posterPath={detail?.poster_path ? TMDB.posterUrl(detail?.poster_path, 'w342') : undefined}
          tmdbRating={detail?.vote_average}
          imdbRating={imdbRating?.star}
          genresMedia={detail?.genres}
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          recommendationsMovies={recommendations?.items}
        />
      </Container>
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
