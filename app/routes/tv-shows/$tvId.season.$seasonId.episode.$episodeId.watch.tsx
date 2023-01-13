/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useCatch, useLoaderData, NavLink, RouteMatch } from '@remix-run/react';
import { Container, Spacer, Badge } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';

import { authenticate, insertHistory } from '~/services/supabase';
import {
  getTvShowDetail,
  getTvShowIMDBId,
  getRecommendation,
  getImdbRating,
  getTvSeasonDetail,
} from '~/services/tmdb/tmdb.server';
import { getMovieInfo, getMovieEpisodeStreamLink } from '~/services/consumet/flixhq/flixhq.server';
import {
  getKissKhInfo,
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
} from '~/services/kisskh/kisskh.server';
import { loklokGetTvEpInfo } from '~/services/loklok';
import getProviderList from '~/services/provider.server';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import TMDB from '~/utils/media';
import { TMDB as TmdbUtils } from '~/services/tmdb/utils.server';

import WatchDetail from '~/src/components/elements/shared/WatchDetail';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Episode',
      description: `This season of tv show doesn't have episode ${params.episodeId || ''}`,
    };
  }
  const { detail } = data || {};
  return {
    title: `Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId || ''
    } HD online Free - Sora`,
    description: `Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId
    } in full HD online with Subtitle`,
    keywords: `Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId
    }, Stream ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId || ''
    }, Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId || ''
    } HD, Online ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId || ''
    }, Streaming ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId || ''
    }, English, Subtitle ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId || ''
    }, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${
      params.seasonId
    }/episode/${params.episodeId || ''}`,
    'og:title': `Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId
    } HD online Free - Sora`,
    'og:description': `Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
      params.episodeId
    } in full HD online with Subtitle`,
    'og:image': TMDB.backdropUrl(detail?.backdrop_path || '', 'w780'),
    refresh: {
      httpEquiv: 'Content-Security-Policy',
      content: 'upgrade-insecure-requests',
    },
  };
};

const checkHasNextEpisode = (
  currentEpisode: number,
  totalEpisodes: number,
  totalProviderEpisodes: number,
) => {
  if (totalEpisodes > currentEpisode) {
    return totalProviderEpisodes > currentEpisode;
  }
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await authenticate(request, true, true, true);

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const routePlayer = `${url.pathname}${url.search}`;
  const { tvId, seasonId, episodeId } = params;
  const tid = Number(tvId);
  const sid = Number(seasonId);
  const eid = Number(episodeId);
  if (!tvId || !seasonId || !episodeId || !provider || !idProvider)
    throw new Response('Not Found', { status: 404 });

  const [detail, imdbId, recommendations, seasonDetail] = await Promise.all([
    getTvShowDetail(tid),
    getTvShowIMDBId(tid),
    getRecommendation('tv', tid),
    getTvSeasonDetail(tid, sid),
  ]);
  if (!imdbId || !detail) throw new Response('Not Found', { status: 404 });
  const totalEpisodes = Number(seasonDetail?.episodes.length);
  const title = detail?.name || '';
  const orgTitle = detail?.original_name || '';
  const year = new Date(seasonDetail?.air_date || '').getFullYear();
  const season = seasonDetail?.season_number;
  const titlePlayer = detail?.name || detail?.original_name || '';
  const posterPlayer = TmdbUtils.backdropUrl(detail?.backdrop_path || '', 'w1280');
  const subtitleOptions = {
    parent_tmdb_id: detail?.id,
    season_number: sid,
    episode_number: eid,
    type: 'episode',
    title: detail?.name,
    sub_format: provider === 'KissKh' ? 'srt' : 'webvtt',
  };
  const overview = detail?.overview || undefined;

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

    const [tvDetail, imdbRating, providers] = await Promise.all([
      loklokGetTvEpInfo(idProvider, Number(episodeId) - 1),
      imdbId ? getImdbRating(imdbId) : undefined,
      getProviderList('tv', title, orgTitle, year, season),
    ]);
    const totalProviderEpisodes = Number(tvDetail?.data?.episodeCount);
    const hasNextEpisode = checkHasNextEpisode(eid, totalEpisodes, totalProviderEpisodes);
    return json(
      {
        idProvider,
        provider,
        detail,
        imdbId,
        recommendations,
        imdbRating,
        seasonDetail,
        hasNextEpisode,
        sources: tvDetail?.sources,
        subtitles: tvDetail?.subtitles.map((sub) => ({
          lang: `${sub.language} (${sub.lang})`,
          url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
        })),
        userId: user?.id,
        providers,
        routePlayer,
        titlePlayer,
        id: tid,
        posterPlayer,
        typeVideo: 'tv',
        subtitleOptions,
        overview,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.watch,
        },
      },
    );
  }

  if (provider === 'Flixhq') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [tvDetail, imdbRating, providers] = await Promise.all([
      getMovieInfo(idProvider),
      imdbId ? getImdbRating(imdbId) : undefined,
      getProviderList('tv', title, orgTitle, year, season),
    ]);
    const totalProviderEpisodes = Number(tvDetail?.episodes?.length);
    const hasNextEpisode = checkHasNextEpisode(eid, totalEpisodes, totalProviderEpisodes);
    const tvEpisodeDetail = tvDetail?.episodes?.find(
      (episode) => episode.season === Number(seasonId) && episode.number === Number(episodeId),
    );
    if (tvEpisodeDetail) {
      const tvEpisodeStreamLink = await getMovieEpisodeStreamLink(
        tvEpisodeDetail?.id || '',
        tvDetail?.id || '',
      );
      return json(
        {
          provider,
          idProvider,
          detail,
          imdbId,
          recommendations,
          imdbRating,
          seasonDetail,
          hasNextEpisode,
          data: tvDetail,
          sources: tvEpisodeStreamLink?.sources,
          subtitles: tvEpisodeStreamLink?.subtitles,
          userId: user?.id,
          providers,
          routePlayer,
          titlePlayer,
          id: tid,
          posterPlayer,
          typeVideo: 'tv',
          subtitleOptions,
          overview,
        },
        {
          headers: {
            'Cache-Control': CACHE_CONTROL.watch,
          },
        },
      );
    }
  }

  if (provider === 'KissKh') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });

    const [episodeDetail, imdbRating, providers] = await Promise.all([
      getKissKhInfo(Number(idProvider)),
      imdbId ? getImdbRating(imdbId) : undefined,
      getProviderList('tv', title, orgTitle, year, season),
    ]);
    const totalProviderEpisodes = Number(episodeDetail?.episodes?.length);
    const hasNextEpisode = checkHasNextEpisode(eid, totalEpisodes, totalProviderEpisodes);
    const episodeSearch = episodeDetail?.episodes?.find((e) => e?.number === Number(episodeId));
    const [episodeStream, episodeSubtitle] = await Promise.all([
      getKissKhEpisodeStream(Number(episodeSearch?.id)),
      episodeSearch && episodeSearch.sub > 0
        ? getKissKhEpisodeSubtitle(Number(episodeSearch?.id))
        : undefined,
    ]);

    return json(
      {
        provider,
        idProvider,
        detail,
        imdbId,
        recommendations,
        imdbRating,
        seasonDetail,
        hasNextEpisode,
        sources: [{ url: episodeStream?.Video || '', isM3U8: true, quality: 'auto' }],
        subtitles: episodeSubtitle?.map((sub) => ({
          lang: sub.label,
          url: sub.src,
          ...(sub.default && { default: true }),
        })),
        userId: user?.id,
        providers,
        routePlayer,
        titlePlayer,
        id: tid,
        posterPlayer,
        typeVideo: 'tv',
        subtitleOptions,
        overview,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.watch,
        },
      },
    );
  }

  const [imdbRating, providers] = await Promise.all([
    imdbId ? getImdbRating(imdbId) : undefined,
    getProviderList('tv', title, orgTitle, year, season),
  ]);
  return json({
    idProvider,
    provider,
    detail,
    imdbId,
    recommendations,
    imdbRating,
    seasonDetail,
    providers,
    userId: user?.id,
    routePlayer,
    titlePlayer,
    id: tid,
    posterPlayer,
    typeVideo: 'tv',
    subtitleOptions,
    overview,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <NavLink
        to={`/tv-shows/${match.params.tvId}`}
        aria-label={
          match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId
        }
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
            {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
          </Badge>
        )}
      </NavLink>
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}`}
        aria-label={`Season ${match.params.seasonId}`}
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
            Season {match.params.seasonId}
          </Badge>
        )}
      </NavLink>
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/episode/${match.params.episodeId}`}
        aria-label={`Episode ${match.params.episodeId}`}
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
            Episode {match.params.episodeId}
          </Badge>
        )}
      </NavLink>
    </>
  ),
  playerSettings: {
    isMini: false,
    shouldShowPlayer: true,
  },
};

const EpisodeWatch = () => {
  const { detail, recommendations, imdbRating, seasonDetail, providers } =
    useLoaderData<typeof loader>();
  const rootData:
    | {
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const id = detail && detail.id;
  return (
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
        type="tv"
        title={detail?.name || ''}
        // @ts-ignore
        episodes={seasonDetail?.episodes}
        overview={detail?.overview || ''}
        posterPath={detail?.poster_path ? TMDB.posterUrl(detail?.poster_path, 'w342') : undefined}
        tmdbRating={detail?.vote_average}
        imdbRating={imdbRating?.star}
        genresMedia={detail?.genres}
        genresMovie={rootData?.genresMovie}
        genresTv={rootData?.genresTv}
        recommendationsMovies={recommendations?.items}
        season={seasonDetail?.season_number}
        providers={providers}
      />
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
