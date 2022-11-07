/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { Suspense } from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  Link,
  RouteMatch,
  useParams,
  useLocation,
  useFetcher,
} from '@remix-run/react';
import { Container, Spacer, Loading } from '@nextui-org/react';
import { ClientOnly } from 'remix-utils';
import { isDesktop } from 'react-device-detect';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';

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
import { IEpisode } from '~/services/consumet/anilist/anilist.types';
import { loklokGetTvEpInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import { IMovieSource, IMovieSubtitle } from '~/services/consumet/flixhq/flixhq.types';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
import updateHistory from '~/utils/update-history';
import { authenticate, insertHistory } from '~/services/supabase';
import Hls from 'hls.js';

type LoaderData = {
  provider?: string;
  sources: IMovieSource[] | undefined;
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
  subtitles?: IMovieSubtitle[] | undefined;
  userId?: string;
  episodeInfo: IEpisode | undefined;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticate(request);

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const episode = url.searchParams.get('episode');
  const { animeId, episodeId } = params;
  if (!animeId || !episodeId) throw new Response('Not Found', { status: 404 });

  const [detail, episodes, sources] = await Promise.all([
    getAnimeInfo(animeId),
    getAnimeEpisodeInfo(animeId),
    getAnimeEpisodeStream(episodeId),
  ]);

  const episodeInfo = episodes?.find((e: IEpisode) => e.number === Number(episode));

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
    const tvDetail = await loklokGetTvEpInfo(idProvider, Number(episode) - 1);

    return json<LoaderData>({
      provider,
      detail,
      sources: tvDetail?.sources,
      subtitles: tvDetail?.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
      })),
      userId: user?.id,
      episodeInfo,
    });
  }

  if (provider === 'Gogo') {
    const episodeDetail = await getAnimeEpisodeStream(episodeId, 'gogoanime');

    return json<LoaderData>({
      provider,
      detail,
      sources: episodeDetail?.sources,
      userId: user?.id,
      episodeInfo,
    });
  }

  if (provider === 'Zoro') {
    const episodeDetail = await getAnimeEpisodeStream(episodeId, 'zoro');

    return json<LoaderData>({
      provider,
      detail,
      sources: episodeDetail?.sources,
      userId: user?.id,
      episodeInfo,
    });
  }

  if (provider === 'Bilibili') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const animeInfo = await getBilibiliInfo(Number(idProvider));
    const episodeSearch = animeInfo?.episodes?.find((e) => e?.number === Number(episode));
    const episodeDetail = await getBilibiliEpisode(Number(episodeSearch?.id));

    return json<LoaderData>({
      provider,
      detail,
      sources: [
        {
          url: episodeDetail?.sources[0]?.file || '',
          isDASH: episodeDetail?.sources[0]?.type === 'dash',
          quality: 'auto',
        },
      ],
      userId: user?.id,
      episodeInfo,
    });
  }

  if (provider === 'KissKh') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const episodeDetail = await getKissKhInfo(Number(idProvider));
    const episodeSearch = episodeDetail?.episodes?.find((e) => e?.number === Number(episode));
    const [episodeStream, episodeSubtitle] = await Promise.all([
      getKissKhEpisodeStream(Number(episodeSearch?.id)),
      episodeSearch && episodeSearch.sub > 0
        ? getKissKhEpisodeSubtitle(Number(episodeSearch?.id))
        : undefined,
    ]);

    return json<LoaderData>({
      provider,
      detail,
      sources: [{ url: episodeStream?.Video || '', isM3U8: true, quality: 'auto' }],
      subtitles: episodeSubtitle?.map((sub) => ({
        lang: sub.label,
        url: sub.src,
        ...(sub.default && { default: true }),
      })),
      userId: user?.id,
      episodeInfo,
    });
  }

  if (!detail || !sources) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ detail, sources: sources.sources, userId: user?.id, episodeInfo });
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Episode',
      description: `This anime doesn't has episode ${params.episodeId}`,
    };
  }
  const { detail, episodeInfo } = data;
  const { title } = detail;
  return {
    title: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number} HD online Free - Sora`,
    description: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number} in full HD online with Subtitle`,
    keywords: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number}, Stream ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number}, Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number} HD, Online ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number}, Streaming ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number}, English, Subtitle ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/anime/${params.animeId}/episode/${params.episodeId}`,
    'og:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number} HD online Free - Sora`,
    'og:description': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number} in full HD online with Subtitle`,
    'og:image': episodeInfo?.image || detail.cover,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link
        to={`/anime/${match.params.animeId}/overview`}
        aria-label={match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
      >
        {match.data?.detail?.title?.english || match.data?.detail?.title?.romaji}
      </Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link
        to={`/anime/${match.params.animeId}/episode/${match.params.episodeId}`}
        aria-label={match?.data?.episodeInfo?.title || match.params.episodeId}
      >
        {match?.data?.episodeInfo?.title || match.params.episodeId}
      </Link>
    </>
  ),
};

const AnimeEpisodeWatch = () => {
  const { provider, detail, sources, subtitles, episodeInfo, userId } = useLoaderData<LoaderData>();
  const { episodeId } = useParams();

  const fetcher = useFetcher();
  const location = useLocation();
  let hls: Hls | null = null;

  const subtitleSelector = subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
    html: lang.toString(),
    url: url.toString(),
    ...(provider === 'Loklok' && lang === 'en' && { default: true }),
    ...(provider === 'KissKh' && lang === 'English' && { default: true }),
  }));
  const qualitySelector =
    provider === 'Loklok' || provider === 'Gogo' || provider === 'Zoro'
      ? sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
          html: quality.toString(),
          url: url.toString(),
          isM3U8: true,
          isDASH: false,
          ...(provider === 'Loklok' && Number(quality) === 720 && { default: true }),
          ...((provider === 'Gogo' || provider === 'Zoro') &&
            quality === 'default' && { default: true }),
        }))
      : provider === 'Bilibili'
      ? undefined
      : sources?.map(({ quality, url }: { quality: number | string; url: string }) => ({
          html: quality.toString(),
          url: url.toString(),
          isM3U8: false,
          isDASH: true,
          ...(quality === 'default' && { default: true }),
        }));
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
          <Suspense fallback={<Loading type="default" />}>
            <AspectRatio.Root ratio={7 / 3}>
              {sources && (
                <ArtPlayer
                  option={{
                    title: `${
                      detail?.title?.userPreferred || detail?.title?.english || ''
                    } Episode ${episodeInfo?.number}`,
                    url:
                      provider === 'Loklok'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              Number(item.quality) === 720,
                          )?.url || ''
                        : provider === 'Gogo' || provider === 'Zoro'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'default',
                          )?.url || ''
                        : provider === 'Bilibili' || provider === 'KissKh'
                        ? sources[0]?.url
                        : sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'default',
                          )?.url || '',
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
                      style: {
                        fontSize: isDesktop ? '40px' : '20px',
                      },
                    },
                    poster: detail?.cover,
                    isLive: false,
                    autoMini: true,
                    backdrop: true,
                    playsInline: true,
                    autoPlayback: true,
                    layers: [
                      {
                        name: 'title',
                        html: `<span>${
                          detail?.title?.userPreferred || detail?.title?.english || ''
                        } - EP ${episodeInfo?.number}</span>`,
                        style: {
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          fontSize: '1.125rem',
                        },
                      },
                    ],
                    type:
                      provider === 'Loklok' ||
                      provider === 'Gogo' ||
                      provider === 'Zoro' ||
                      provider === 'KissKh'
                        ? 'm3u8'
                        : 'dash',
                    customType:
                      provider === 'Loklok' ||
                      provider === 'Gogo' ||
                      provider === 'Zoro' ||
                      provider === 'KissKh'
                        ? {
                            m3u8: async (video: HTMLMediaElement, url: string) => {
                              if (hls) {
                                hls.destroy();
                              }
                              if (Hls.isSupported()) {
                                hls = new Hls();
                                hls.loadSource(url);
                                hls.attachMedia(video);
                              } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                                video.src = url;
                              }
                            },
                          }
                        : {
                            mpd: async (video: HTMLMediaElement, url: string) => {
                              const { default: dashjs } = await import('dashjs');
                              const player = dashjs.MediaPlayer().create();
                              player.initialize(video, url, true);
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
                      art.layers.title.style.display = 'none';
                    });
                    art.on('hover', (state: boolean) => {
                      art.layers.title.style.display = state || !art.playing ? 'block' : 'none';
                    });
                    art.on('destroy', () => {
                      if (hls) {
                        hls.destroy();
                      }
                    });
                  }}
                />
              )}
            </AspectRatio.Root>
          </Suspense>
        )}
      </ClientOnly>
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
