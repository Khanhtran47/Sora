import type { IMovieInfo, ISource } from '@consumet/extensions';
import { json, type LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';
import Vibrant from 'node-vibrant';

import type { Handle } from '~/types/handle';
import {
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
  getKissKhInfo,
} from '~/services/kisskh/kisskh.server';
import { loklokGetTvEpInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import getProviderList from '~/services/provider.server';
import { authenticate, insertHistory } from '~/services/supabase';
import {
  getImdbRating,
  getInfoWithProvider,
  getRecommendation,
  getTvSeasonDetail,
  getTvShowDetail,
  getTvShowIMDBId,
  getWatchEpisode,
} from '~/services/tmdb/tmdb.server';
import { TMDB as TmdbUtils } from '~/services/tmdb/utils.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import ErrorBoundaryView from '~/components/elements/shared/ErrorBoundaryView';
import WatchDetail from '~/components/elements/shared/WatchDetail';

export const meta = mergeMeta<typeof loader>(({ data, params }) => {
  if (!data) {
    return [
      { title: 'Missing Episode' },
      {
        name: 'description',
        content: `This season of tv show doesn't have episode ${
          params.episodeId || ''
        } or this episode is unavailable`,
      },
    ];
  }

  const { detail, seasonDetail } = data || {};
  return [
    {
      title: `Sora - Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
        params.episodeId || ''
      }`,
    },
    { name: 'description', content: seasonDetail?.overview || detail?.overview || '' },
    {
      name: 'keywords',
      content: `Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
        params.episodeId || ''
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
    },
    {
      property: 'og:url',
      content: `https://sorachill.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/episode/${params.episodeId}/watch`,
    },
    {
      property: 'og:title',
      content: `Sora - Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
        params.episodeId || ''
      }`,
    },
    { property: 'og:description', content: seasonDetail?.overview || detail?.overview || '' },
    {
      name: 'twitter:title',
      content: `Sora - Watch ${detail?.name || ''} season ${params.seasonId || ''} episode ${
        params.episodeId || ''
      }`,
    },
    { name: 'twitter:description', content: seasonDetail?.overview || detail?.overview || '' },
  ];
});

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
  const extractColorImage = `https://corsproxy.io/?${encodeURIComponent(
    TMDB.backdropUrl(detail?.backdrop_path || detail?.poster_path || '', 'w300'),
  )}`;
  const isEnded = detail?.status === 'Ended' || detail?.status === 'Canceled';

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

    const [tvDetail, imdbRating, providers, fimg] = await Promise.all([
      loklokGetTvEpInfo(idProvider, Number(episodeId) - 1),
      imdbId && process.env.IMDB_API_URL !== undefined ? getImdbRating(imdbId) : undefined,
      getProviderList({
        type: 'tv',
        title,
        orgTitle,
        year,
        season,
        animeId: undefined,
        animeType: undefined,
        isEnded,
        tmdbId: detail?.id,
      }),
      fetch(extractColorImage),
    ]);
    const totalProviderEpisodes = Number(tvDetail?.data?.episodeCount);
    const hasNextEpisode = checkHasNextEpisode(eid, totalEpisodes, totalProviderEpisodes);
    const fimgb = Buffer.from(await fimg.arrayBuffer());
    const palette =
      detail?.backdrop_path || detail?.poster_path
        ? await Vibrant.from(fimgb).getPalette()
        : undefined;
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
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
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
    const [tvDetail, imdbRating, providers, fimg] = await Promise.all([
      getInfoWithProvider(tid.toString(), 'tv'),
      imdbId && process.env.IMDB_API_URL !== undefined ? getImdbRating(imdbId) : undefined,
      getProviderList({
        type: 'tv',
        title,
        orgTitle,
        year,
        season,
        animeId: undefined,
        animeType: undefined,
        isEnded,
        tmdbId: detail?.id,
      }),
      fetch(extractColorImage),
    ]);
    const findTvSeason = (tvDetail as IMovieInfo)?.seasons?.find(
      (s) => s.season === Number(season),
    );
    const totalProviderEpisodes = findTvSeason?.episodes.filter((e) => e.id).length;
    const hasNextEpisode = checkHasNextEpisode(eid, totalEpisodes, totalProviderEpisodes || 0);
    const tvEpisodeDetail = findTvSeason?.episodes?.find(
      (episode) => episode.season === Number(seasonId) && episode.episode === Number(episodeId),
    );
    const fimgb = Buffer.from(await fimg.arrayBuffer());
    if (tvEpisodeDetail) {
      const [tvEpisodeStreamLink, palette] = await Promise.all([
        getWatchEpisode(tid.toString(), tvEpisodeDetail.id),
        detail?.backdrop_path || detail?.poster_path
          ? await Vibrant.from(fimgb).getPalette()
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
          data: tvDetail,
          sources: (tvEpisodeStreamLink as ISource)?.sources,
          subtitles: (tvEpisodeStreamLink as ISource)?.subtitles,
          userId: user?.id,
          providers,
          routePlayer,
          titlePlayer,
          id: tid,
          posterPlayer,
          typeVideo: 'tv',
          subtitleOptions,
          overview,
          color: palette
            ? Object.values(palette).sort((a, b) =>
                a?.population === undefined || b?.population === undefined
                  ? 0
                  : b.population - a.population,
              )[0]?.hex
            : undefined,
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

    const [episodeDetail, imdbRating, providers, fimg] = await Promise.all([
      getKissKhInfo(Number(idProvider)),
      imdbId && process.env.IMDB_API_URL !== undefined ? getImdbRating(imdbId) : undefined,
      getProviderList({
        type: 'tv',
        title,
        orgTitle,
        year,
        season,
        animeId: undefined,
        animeType: undefined,
        isEnded,
        tmdbId: detail?.id,
      }),
      fetch(extractColorImage),
    ]);
    const totalProviderEpisodes = Number(episodeDetail?.episodes?.length);
    const hasNextEpisode = checkHasNextEpisode(eid, totalEpisodes, totalProviderEpisodes);
    const episodeSearch = episodeDetail?.episodes?.find((e) => e?.number === Number(episodeId));
    const fimgb = Buffer.from(await fimg.arrayBuffer());
    const [episodeStream, episodeSubtitle, palette] = await Promise.all([
      getKissKhEpisodeStream(Number(episodeSearch?.id)),
      episodeSearch && episodeSearch.sub > 0
        ? getKissKhEpisodeSubtitle(Number(episodeSearch?.id))
        : undefined,
      detail?.backdrop_path || detail?.poster_path
        ? await Vibrant.from(fimgb).getPalette()
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
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.watch,
        },
      },
    );
  }

  const [imdbRating, providers, fimg] = await Promise.all([
    imdbId && process.env.IMDB_API_URL !== undefined ? getImdbRating(imdbId) : undefined,
    getProviderList({
      type: 'tv',
      title,
      orgTitle,
      year,
      season,
      animeId: undefined,
      animeType: undefined,
      isEnded,
      tmdbId: detail?.id,
    }),
    fetch(extractColorImage),
  ]);

  const fimgb = Buffer.from(await fimg.arrayBuffer());
  const palette =
    detail?.backdrop_path || detail?.poster_path
      ? await Vibrant.from(fimgb).getPalette()
      : undefined;
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
    color: palette
      ? Object.values(palette).sort((a, b) =>
          a?.population === undefined || b?.population === undefined
            ? 0
            : b.population - a.population,
        )[0]?.hex
      : undefined,
  });
};

export const handle: Handle = {
  breadcrumb: ({ match }) => (
    <>
      <BreadcrumbItem
        to={`/tv-shows/${match.params.tvId}/`}
        key={`tv-shows-${match.params.tvId}-overview`}
      >
        {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
      </BreadcrumbItem>
      <BreadcrumbItem
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/`}
        key={`tv-shows-${match.params.tvId}-season-${match.params.seasonId}-episodes`}
      >
        Season {match.params.seasonId}
      </BreadcrumbItem>
      <BreadcrumbItem
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/episode/${match.params.episodeId}`}
        key={`tv-shows-${match.params.tvId}-season-${match.params.seasonId}-episode-${match.params.episodeId}`}
      >
        Episode {match.params.episodeId}
      </BreadcrumbItem>
    </>
  ),
  playerSettings: {
    isMini: false,
    shouldShowPlayer: true,
  },
  miniTitle: ({ match }) => ({
    title: match.data?.detail?.name || match.data?.detail?.original_name,
    subtitle: `${match.data?.seasonDetail?.name} Episode ${match.params.episodeId}`,
    showImage: match.data?.seasonDetail?.poster_path !== undefined,
    imageUrl: TMDB.posterUrl(match.data?.seasonDetail?.poster_path || '', 'w92'),
  }),
};

const TvEpisodeWatch = () => {
  const { detail, recommendations, imdbRating, seasonDetail, providers, color } =
    useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const id = detail && detail.id;
  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center px-3 sm:px-0">
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
        color={color}
      />
    </div>
  );
};

export function ErrorBoundary() {
  return (
    <ErrorBoundaryView
      statusHandlers={{
        404: ({ params }) => <p>This series doesn't have episode {params.episodeId}</p>,
      }}
    />
  );
}

export default TvEpisodeWatch;
