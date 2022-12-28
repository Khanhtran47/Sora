/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { Suspense, useState, useEffect, useMemo } from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  NavLink,
  RouteMatch,
  useParams,
  useLocation,
  useFetcher,
  useNavigate,
} from '@remix-run/react';
import { Container, Spacer, Loading, Badge } from '@nextui-org/react';
import { ClientOnly } from 'remix-utils';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';
import Hls from 'hls.js';

import { authenticate, insertHistory } from '~/services/supabase';
import getProviderList from '~/services/provider.server';
import {
  getAnimeEpisodeStream,
  getAnimeInfo,
  getAnimeEpisodeInfo,
} from '~/services/consumet/anilist/anilist.server';
import { getBilibiliEpisode, getBilibiliInfo } from '~/services/consumet/bilibili/bilibili.server';
import {
  getKissKhInfo,
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
} from '~/services/kisskh/kisskh.server';
import { IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import { loklokGetTvEpInfo, loklokGetMovieInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import { IMovieSource, IMovieSubtitle } from '~/services/consumet/flixhq/flixhq.types';
import { IMedia } from '~/types/media';

import updateHistory from '~/utils/update-history';
import useLocalStorage from '~/hooks/useLocalStorage';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import PlayerError from '~/src/components/elements/player/PlayerError';
import WatchDetail from '~/src/components/elements/shared/WatchDetail';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  provider?: string;
  idProvider?: number | string;
  sources: IMovieSource[] | undefined;
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
  episodes: Awaited<ReturnType<typeof getAnimeEpisodeInfo>>;
  subtitles?: IMovieSubtitle[] | undefined;
  userId?: string;
  episodeInfo: IEpisodeInfo | undefined;
  hasNextEpisode?: boolean;
  providers?: {
    id?: string | number | null;
    provider: string;
    episodesCount?: number;
  }[];
};

const checkHasNextEpisode = (
  provider: string,
  currentEpisode: number,
  totalEpisodes: number,
  totalProviderEpisodes?: number,
) => {
  if (provider === 'Gogo' || provider === 'Zoro') {
    return totalEpisodes > currentEpisode;
  }
  if (totalProviderEpisodes) {
    return totalProviderEpisodes > currentEpisode;
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticate(request, true, true, true);

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const { animeId, episodeId } = params;
  const aid = Number(animeId);
  if (!animeId || !episodeId) throw new Response('Not Found', { status: 404 });

  const [detail, episodes] = await Promise.all([
    getAnimeInfo(animeId),
    getAnimeEpisodeInfo(animeId),
  ]);
  const title =
    detail?.title?.english || detail?.title?.userPreferred || detail?.title?.romaji || '';
  const orgTitle = detail?.title?.native;
  const year = detail?.releaseDate;
  const episodeIndex = episodes && episodes[Number(episodeId) - 1]?.id;
  const totalEpisodes = Number(episodes?.length);
  const episodeInfo = episodes?.find((e: IEpisodeInfo) => e.number === Number(episodeId));

  if (user) {
    insertHistory({
      user_id: user.id,
      media_type: 'anime',
      duration: (detail?.duration || 0) * 60,
      watched: 0,
      route: url.pathname + url.search,
      media_id: (detail?.id || animeId).toString(),
      poster: detail?.cover,
      title:
        detail?.title?.userPreferred ||
        detail?.title?.english ||
        detail?.title?.native ||
        detail?.title?.romaji ||
        undefined,
      overview: detail?.description,
      season: detail?.season,
      episode: episodeId,
    });
  }

  if (provider === 'Loklok') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [tvDetail, providers] = await Promise.all([
      detail?.type === 'MOVIE'
        ? loklokGetMovieInfo(idProvider)
        : loklokGetTvEpInfo(idProvider, Number(episodeId) - 1),
      getProviderList('anime', title, orgTitle, year, undefined, aid),
    ]);
    const totalProviderEpisodes = Number(tvDetail?.data?.episodeCount);
    const hasNextEpisode = checkHasNextEpisode(
      provider,
      Number(episodeInfo?.number),
      totalEpisodes,
      totalProviderEpisodes,
    );

    return json<LoaderData>({
      provider,
      idProvider,
      detail,
      episodes,
      hasNextEpisode,
      sources: tvDetail?.sources,
      subtitles: tvDetail?.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
      })),
      userId: user?.id,
      episodeInfo,
      providers,
    });
  }

  if (provider === 'Gogo') {
    const [episodeDetail, providers] = await Promise.all([
      getAnimeEpisodeStream(episodeIndex, 'gogoanime'),
      getProviderList('anime', title, orgTitle, year, undefined, aid),
    ]);
    const hasNextEpisode = checkHasNextEpisode(
      provider,
      Number(episodeInfo?.number),
      totalEpisodes,
    );

    return json<LoaderData>({
      provider,
      detail,
      episodes,
      hasNextEpisode,
      sources: episodeDetail?.sources,
      userId: user?.id,
      episodeInfo,
      providers,
    });
  }

  if (provider === 'Zoro') {
    const [episodeDetail, providers] = await Promise.all([
      getAnimeEpisodeStream(episodeIndex, 'zoro'),
      getProviderList('anime', title, orgTitle, year, undefined, aid),
    ]);
    const hasNextEpisode = checkHasNextEpisode(
      provider,
      Number(episodeInfo?.number),
      totalEpisodes,
    );

    return json<LoaderData>({
      provider,
      detail,
      episodes,
      hasNextEpisode,
      sources: episodeDetail?.sources,
      userId: user?.id,
      episodeInfo,
      providers,
    });
  }

  if (provider === 'Bilibili') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [animeInfo, providers] = await Promise.all([
      getBilibiliInfo(Number(idProvider)),
      getProviderList('anime', title, orgTitle, year, undefined, aid),
    ]);
    const episodeSearch = animeInfo?.episodes?.find((e) => e?.number === Number(episodeId));
    const episodeDetail = await getBilibiliEpisode(Number(episodeSearch?.id));
    const totalProviderEpisodes = Number(animeInfo?.totalEpisodes);
    const hasNextEpisode = checkHasNextEpisode(
      provider,
      Number(episodeId),
      totalEpisodes,
      totalProviderEpisodes,
    );

    return json<LoaderData>({
      provider,
      idProvider,
      detail,
      episodes,
      hasNextEpisode,
      sources: [
        {
          url: episodeDetail?.sources[0]?.file || '',
          isDASH: episodeDetail?.sources[0]?.type === 'dash',
          quality: 'auto',
        },
      ],
      subtitles: episodeDetail?.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: sub.file,
      })),
      userId: user?.id,
      episodeInfo,
      providers,
    });
  }

  if (provider === 'KissKh') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [episodeDetail, providers] = await Promise.all([
      getKissKhInfo(Number(idProvider)),
      getProviderList('anime', title, orgTitle, year, undefined, aid),
    ]);

    const totalProviderEpisodes = Number(episodeDetail?.episodes?.length);
    const hasNextEpisode = checkHasNextEpisode(
      provider,
      Number(episodeId),
      totalEpisodes,
      totalProviderEpisodes,
    );
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
      episodes,
      hasNextEpisode,
      sources: [{ url: episodeStream?.Video || '', isM3U8: true, quality: 'auto' }],
      subtitles: episodeSubtitle?.map((sub) => ({
        lang: sub.label,
        url: sub.src,
        ...(sub.default && { default: true }),
      })),
      userId: user?.id,
      episodeInfo,
      providers,
    });
  }
  const [sources, providers] = await Promise.all([
    getAnimeEpisodeStream(episodeIndex),
    getProviderList('anime', title, orgTitle, year, undefined, aid),
  ]);

  if (!detail || !sources) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    episodes,
    sources: sources.sources,
    userId: user?.id,
    episodeInfo,
    providers,
  });
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Episode',
      description: `This anime doesn't has episode ${params.episodeId}`,
    };
  }
  const { detail, episodeInfo } = data;
  const { title } = detail || {};
  return {
    title: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''} HD online Free - Sora`,
    description: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''} in full HD online with Subtitle`,
    keywords: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''}, Stream ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''}, Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''} HD, Online ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''}, Streaming ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''}, English, Subtitle ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/episode/${params.episodeId}`,
    'og:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''} HD online Free - Sora`,
    'og:description': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo?.number || ''} in full HD online with Subtitle`,
    'og:image': episodeInfo?.image || detail?.cover || '',
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <NavLink
        to={`/anime/${match.params.animeId}/overview`}
        aria-label={match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
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
            {match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
          </Badge>
        )}
      </NavLink>
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink
        to={`/anime/${match.params.animeId}/episode/${match.params.episodeId}`}
        aria-label={match?.data?.episodeInfo?.title || match.params.episodeId}
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
            {match?.data?.episodeInfo?.title || match.params.episodeId}
          </Badge>
        )}
      </NavLink>
    </>
  ),
};

const AnimeEpisodeWatch = () => {
  const {
    provider,
    idProvider,
    detail,
    episodes,
    hasNextEpisode,
    sources,
    subtitles,
    userId,
    providers,
  } = useLoaderData<LoaderData>();
  const { episodeId } = useParams();
  const fetcher = useFetcher();
  const location = useLocation();
  const navigate = useNavigate();
  let hls: Hls | null = null;
  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
  const [playNextEpisode] = useLocalStorage('playNextEpisode', true);
  const currentEpisode = useMemo(() => Number(episodeId), [episodeId]);
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
      provider === 'Loklok' || provider === 'Gogo' || provider === 'Zoro'
        ? sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
            html: quality.toString(),
            url: url.toString().startsWith('http:')
              ? `https://cors.proxy.consumet.org/${url.toString()}`
              : url.toString(),
            isM3U8: true,
            isDASH: false,
            ...(provider === 'Loklok' && Number(quality) === 720 && { default: true }),
            ...((provider === 'Gogo' || provider === 'Zoro') &&
              quality === 'default' && { default: true }),
          }))
        : provider === 'Bilibili'
        ? sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
            html: quality.toString(),
            url: url.toString(),
            isM3U8: false,
            isDASH: true,
            ...(provider === 'Bilibili' && quality === 'auto' && { default: true }),
          }))
        : sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
            html: quality.toString(),
            url: url.toString(),
            isM3U8: false,
            isDASH: true,
            ...(quality === 'default' && { default: true }),
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
        ...(provider === 'Loklok' && lang.includes('en') && { default: true }),
        ...(provider === 'Bilibili' && lang.includes('en') && { default: true }),
        ...(provider === 'KissKh' && lang === 'English' && { default: true }),
      })),
    [provider, subtitles],
  );

  useEffect(() => {
    if (isVideoEnded && playNextEpisode && hasNextEpisode && provider) {
      navigate(
        `/anime/${detail?.id}/episode/${currentEpisode + 1}?provider=${provider}&id=${idProvider}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoEnded]);
  return (
    <Container responsive fluid css={{ margin: 0, padding: 0 }}>
      <ClientOnly fallback={<Loading type="default" />}>
        {() => (
          <Suspense fallback={<Loading type="default" />}>
            {sources ? (
              <ArtPlayer
                key={`${detail?.id}-${currentEpisode}-${provider}-${idProvider}`}
                type="anime"
                id={detail?.id}
                trailerAnime={detail?.trailer}
                autoPlay
                currentEpisode={currentEpisode}
                hasNextEpisode={hasNextEpisode}
                nextEpisodeUrl={
                  hasNextEpisode
                    ? `/anime/${detail?.id}/episode/${
                        currentEpisode + 1
                      }?provider=${provider}&id=${idProvider}`
                    : undefined
                }
                option={{
                  title: `${
                    detail?.title?.userPreferred || detail?.title?.english || ''
                  } Episode ${episodeId}`,
                  url:
                    provider === 'Loklok'
                      ? sources?.find(
                          (item: { quality: number | string; url: string }) =>
                            Number(item.quality) === 720,
                        )?.url || sources[0]?.url
                      : provider === 'Gogo' || provider === 'Zoro'
                      ? sources?.find(
                          (item: { quality: number | string; url: string }) =>
                            item.quality === 'default',
                        )?.url || sources[0]?.url
                      : provider === 'Bilibili' || provider === 'KissKh'
                      ? sources[0]?.url
                      : sources?.find(
                          (item: { quality: number | string; url: string }) =>
                            item.quality === 'default',
                        )?.url || sources[0]?.url,
                  type: provider === 'Bilibili' ? 'mpd' : 'm3u8',
                  subtitle: {
                    url:
                      provider === 'Loklok'
                        ? subtitles?.find((item: { lang: string; url: string }) =>
                            item.lang.includes('English'),
                          )?.url
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
                      provider === 'Flixhq' || provider === 'Loklok' || provider === 'Bilibili'
                        ? 'vtt'
                        : provider === 'KissKh'
                        ? 'srt'
                        : '',
                  },
                  poster: detail?.cover,
                  isLive: false,
                  backdrop: true,
                  playsInline: true,
                  autoPlayback: true,
                  layers: [
                    {
                      name: 'title',
                      html: `<span>${
                        detail?.title?.userPreferred || detail?.title?.english || ''
                      } - EP ${currentEpisode}</span>`,
                      style: {
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        fontSize: '1.125rem',
                      },
                    },
                  ],
                  customType:
                    provider === 'Bilibili'
                      ? {
                          mpd: async (video: HTMLMediaElement, url: string) => {
                            const { default: dashjs } = await import('dashjs');
                            const player = dashjs.MediaPlayer().create();
                            player.initialize(video, url, false);
                          },
                        }
                      : {
                          m3u8: async (video: HTMLMediaElement, url: string) => {
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
                  type: 'episode',
                  title: detail?.title?.userPreferred || detail?.title?.english || '',
                  sub_format: provider === 'KissKh' ? 'srt' : 'webvtt',
                }}
                getInstance={(art) => {
                  art.on('ready', () => {
                    setIsVideoEnded(false);
                    const t = new URLSearchParams(location.search).get('t');
                    if (t) {
                      art.currentTime = Number(t);
                    }
                    art.subtitle.style({
                      fontSize: `${art.height * 0.05}px`,
                    });
                  });
                  art.on('resize', () => {
                    art.subtitle.style({
                      fontSize: `${art.height * 0.05}px`,
                    });
                  });

                  if (userId) {
                    updateHistory(
                      art,
                      fetcher,
                      userId,
                      location.pathname + location.search,
                      'anime',
                      detail?.title?.userPreferred || detail?.title?.english || '',
                      detail?.description || '',
                      detail?.season,
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
          type="anime"
          id={detail?.id}
          episodes={episodes}
          title={detail?.title?.english || ''}
          overview={detail?.description || ''}
          posterPath={detail?.image}
          anilistRating={detail?.rating}
          genresAnime={detail?.genres}
          recommendationsAnime={detail?.recommendations as IMedia[]}
          color={detail?.color}
          providers={providers}
        />
      </Container>
    </Container>
  );
};

export default AnimeEpisodeWatch;

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};
