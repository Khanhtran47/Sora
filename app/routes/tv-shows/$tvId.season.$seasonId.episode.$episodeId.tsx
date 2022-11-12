/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { useState, useEffect, Suspense } from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  Link,
  RouteMatch,
  useParams,
  useFetcher,
  useLocation,
  useNavigate,
} from '@remix-run/react';
import { Container, Spacer, Loading, Radio } from '@nextui-org/react';
import { ClientOnly, useRouteData } from 'remix-utils';
import { isDesktop } from 'react-device-detect';
import Hls from 'hls.js';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';

import { authenticate, insertHistory } from '~/services/supabase';
import {
  getTvShowDetail,
  getTvShowIMDBId,
  getRecommendation,
  getTranslations,
  getImdbRating,
  getTvSeasonDetail,
} from '~/services/tmdb/tmdb.server';
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
import {
  getKissKhInfo,
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
} from '~/services/kisskh/kisskh.server';
import { loklokGetTvEpInfo } from '~/services/loklok';
import i18next from '~/i18n/i18next.server';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import TMDB from '~/utils/media';
import Player from '~/utils/player';
import updateHistory from '~/utils/update-history';
import useMediaQuery from '~/hooks/useMediaQuery';
import useLocalStorage from '~/hooks/useLocalStorage';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import WatchDetail from '~/src/components/elements/shared/WatchDetail';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  provider?: string;
  idProvider?: number | string;
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
  imdbId: Awaited<ReturnType<typeof getTvShowIMDBId>>;
  recommendations: Awaited<ReturnType<typeof getRecommendation>>;
  seasonDetail: Awaited<ReturnType<typeof getTvSeasonDetail>>;
  translations?: Awaited<ReturnType<typeof getTranslations>>;
  data?: Awaited<ReturnType<typeof getMovieInfo>>;
  sources?: IMovieSource[] | undefined;
  subtitles?: IMovieSubtitle[] | undefined;
  userId?: string;
  imdbRating?: { count: number; star: number };
  hasNextEpisode?: boolean;
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
    description: `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} in full HD online with Subtitle`,
    keywords: `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Stream ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} HD, Online ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Streaming ${detail.name} season ${params.seasonId} episode ${params.episodeId}, English, Subtitle ${detail.name} season ${params.seasonId} episode ${params.episodeId}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/episode/${params.episodeId}`,
    'og:title': `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} HD online Free - Sora`,
    'og:description': `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} in full HD online with Subtitle`,
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

export const loader: LoaderFunction = async ({ request, params }) => {
  const [user, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const { tvId, seasonId, episodeId } = params;
  const tid = Number(tvId);
  const sid = Number(seasonId);
  const eid = Number(episodeId);

  if (!tid) throw new Response('Not Found', { status: 404 });
  if (!sid) throw new Response('Not Found', { status: 404 });

  const [detail, imdbId, recommendations, seasonDetail] = await Promise.all([
    getTvShowDetail(tid),
    getTvShowIMDBId(tid),
    getRecommendation('tv', tid),
    getTvSeasonDetail(tid, sid),
  ]);
  const totalEpisodes = Number(seasonDetail?.episodes.length);

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
    if ((detail && detail?.original_language !== 'en') || locale !== 'en') {
      const [tvDetail, imdbRating, translations] = await Promise.all([
        loklokGetTvEpInfo(idProvider, Number(episodeId) - 1),
        imdbId ? getImdbRating(imdbId) : undefined,
        getTranslations('tv', tid),
      ]);
      const totalProviderEpisodes = Number(tvDetail?.data?.episodeCount);
      const hasNextEpisode = checkHasNextEpisode(eid, totalEpisodes, totalProviderEpisodes);
      return json<LoaderData>({
        provider,
        detail,
        imdbId,
        recommendations,
        imdbRating,
        seasonDetail,
        translations,
        hasNextEpisode,
        sources: tvDetail?.sources,
        subtitles: tvDetail?.subtitles.map((sub) => ({
          lang: `${sub.language} (${sub.lang})`,
          url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
        })),
        userId: user?.id,
      });
    }

    const [tvDetail, imdbRating] = await Promise.all([
      loklokGetTvEpInfo(idProvider, Number(episodeId) - 1),
      imdbId ? getImdbRating(imdbId) : undefined,
    ]);
    const totalProviderEpisodes = Number(tvDetail?.data?.episodeCount);
    const hasNextEpisode = checkHasNextEpisode(eid, totalEpisodes, totalProviderEpisodes);
    return json<LoaderData>({
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
    });
  }

  if (provider === 'Flixhq') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    if ((detail && detail?.original_language !== 'en') || locale !== 'en') {
      const [tvDetail, imdbRating, translations] = await Promise.all([
        getMovieInfo(idProvider),
        imdbId ? getImdbRating(imdbId) : undefined,
        getTranslations('tv', tid),
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
        return json<LoaderData>({
          provider,
          idProvider,
          detail,
          imdbId,
          recommendations,
          imdbRating,
          seasonDetail,
          hasNextEpisode,
          translations,
          data: tvDetail,
          sources: tvEpisodeStreamLink?.sources,
          subtitles: tvEpisodeStreamLink?.subtitles,
          userId: user?.id,
        });
      }
    }
    const [tvDetail, imdbRating] = await Promise.all([
      getMovieInfo(idProvider),
      imdbId ? getImdbRating(imdbId) : undefined,
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
      return json<LoaderData>({
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
      });
    }
  }

  if (provider === 'KissKh') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    if ((detail && detail?.original_language !== 'en') || locale !== 'en') {
      const [episodeDetail, imdbRating, translations] = await Promise.all([
        getKissKhInfo(Number(idProvider)),
        imdbId ? getImdbRating(imdbId) : undefined,
        getTranslations('tv', tid),
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

      return json<LoaderData>({
        provider,
        idProvider,
        detail,
        imdbId,
        recommendations,
        imdbRating,
        seasonDetail,
        hasNextEpisode,
        translations,
        sources: [{ url: episodeStream?.Video || '', isM3U8: true, quality: 'auto' }],
        subtitles: episodeSubtitle?.map((sub) => ({
          lang: sub.label,
          url: sub.src,
          ...(sub.default && { default: true }),
        })),
        userId: user?.id,
      });
    }

    const [episodeDetail, imdbRating] = await Promise.all([
      getKissKhInfo(Number(idProvider)),
      imdbId ? getImdbRating(imdbId) : undefined,
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

    return json<LoaderData>({
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
    });
  }

  if (provider === 'Embed') {
    if ((detail && detail?.original_language !== 'en') || locale !== 'en') {
      const [imdbRating, translations] = await Promise.all([
        imdbId ? getImdbRating(imdbId) : undefined,
        getTranslations('tv', tid),
      ]);
      return json<LoaderData>({
        detail,
        imdbId,
        recommendations,
        imdbRating,
        seasonDetail,
        translations,
        userId: user?.id,
      });
    }
    const imdbRating = imdbId ? await getImdbRating(imdbId) : undefined;
    return json<LoaderData>({
      detail,
      imdbId,
      recommendations,
      imdbRating,
      seasonDetail,
      userId: user?.id,
    });
  }
  let search;
  let tvDetail;
  let tvEpisodeDetail;
  let tvEpisodeStreamLink;
  let imdbRating;
  if ((detail && detail.original_language === 'en') || locale === 'en') {
    [search, imdbRating] = await Promise.all([
      getMovieSearch(detail?.name || ''),
      imdbId ? getImdbRating(imdbId) : undefined,
    ]);
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
      [search, imdbRating] = await Promise.all([
        getMovieSearch(detail?.name || ''),
        imdbId ? getImdbRating(imdbId) : undefined,
      ]);
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
    recommendations,
    imdbRating,
    seasonDetail,
    data: tvDetail,
    sources: tvEpisodeStreamLink?.sources,
    subtitles: tvEpisodeStreamLink?.subtitles,
    userId: user?.id,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link
        to={`/tv-shows/${match.params.tvId}`}
        aria-label={
          match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId
        }
      >
        {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
      </Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/`}
        aria-label={`Season ${match.params.seasonId}`}
      >
        Season {match.params.seasonId}
      </Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/episode/${match.params.episodeId}`}
        aria-label={`Episode ${match.params.episodeId}`}
      >
        Episode {match.params.episodeId}
      </Link>
    </>
  ),
};

const EpisodeWatch = () => {
  const {
    provider,
    idProvider,
    detail,
    imdbId,
    recommendations,
    imdbRating,
    seasonDetail,
    hasNextEpisode,
    translations,
    sources,
    subtitles,
    userId,
  } = useLoaderData<LoaderData>();
  const rootData:
    | {
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const { seasonId, episodeId } = useParams();
  const isSm = useMediaQuery(650, 'max');
  const id = detail && detail.id;
  const [player, setPlayer] = useState<string>('1');
  const [source, setSource] = useState<string>(Player.moviePlayerUrl(Number(id), 1));
  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
  const fetcher = useFetcher();
  const location = useLocation();
  const navigate = useNavigate();
  let hls: Hls | null = null;
  const [playNextEpisode] = useLocalStorage('playNextEpisode', true);
  const subtitleSelector = subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
    html: lang.toString(),
    url: url.toString(),
    ...(provider === 'Flixhq' && lang === 'English' && { default: true }),
    ...(provider === 'KissKh' && lang === 'English' && { default: true }),
    ...(provider === 'Loklok' && lang === 'en' && { default: true }),
  }));
  const qualitySelector = sources?.map(
    ({ quality, url }: { quality: number | string; url: string }) => ({
      html: quality.toString(),
      url: url.toString(),
      isM3U8: true,
      isDASH: false,
      ...(provider === 'Flixhq' && quality === 'auto' && { default: true }),
      ...(provider === 'Loklok' && Number(quality) === 720 && { default: true }),
    }),
  );

  useEffect(
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

  useEffect(() => {
    if (isVideoEnded && playNextEpisode && provider && idProvider && hasNextEpisode)
      navigate(
        `/tv-shows/${detail?.id}/season/${seasonId}/episode/${
          Number(episodeId) + 1
        }?provider=${provider}&id=${idProvider}`,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoEnded]);
  return (
    <Container fluid responsive css={{ margin: 0, padding: 0 }}>
      <ClientOnly fallback={<Loading type="default" />}>
        {() => (
          <Suspense fallback={<Loading type="default" />}>
            <AspectRatio.Root ratio={7 / 3}>
              {sources ? (
                <ArtPlayer
                  autoPlay
                  currentEpisode={Number(episodeId)}
                  hasNextEpisode={hasNextEpisode}
                  nextEpisodeUrl={
                    hasNextEpisode
                      ? `/tv-shows/${detail?.id}/season/${seasonId}/episode/${
                          Number(episodeId) + 1
                        }?provider=${provider}&id=${idProvider}`
                      : undefined
                  }
                  option={{
                    title: detail?.name,
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
                    customType: {
                      m3u8: (video: HTMLMediaElement, url: string) => {
                        if (hls) {
                          hls.destroy();
                        }
                        if (Hls.isSupported()) {
                          hls = new Hls();
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
                    parent_tmdb_id: detail?.id,
                    season_number: Number(seasonId),
                    episode_number: Number(episodeId),
                    type: 'episode',
                  }}
                  getInstance={(art) => {
                    art.on('ready', () => {
                      setIsVideoEnded(false);
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
                      setIsVideoEnded(false);
                      art.layers.title.style.display = 'none';
                    });
                    art.on('hover', (state: boolean) => {
                      art.layers.title.style.display = state || !art.playing ? 'block' : 'none';
                    });
                    art.on('video:ended', () => {
                      setIsVideoEnded(true);
                    });
                    art.on('destroy', () => {
                      setIsVideoEnded(false);
                      if (hls) {
                        hls.destroy();
                      }
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
          </Suspense>
        )}
      </ClientOnly>
      <Spacer y={1} />
      <WatchDetail
        id={Number(id)}
        type="tv"
        title={detail?.name || ''}
        orgTitle={detail?.original_name || ''}
        year={new Date(seasonDetail?.air_date || '').getFullYear()}
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
        translations={translations}
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
