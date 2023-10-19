import { env } from 'process';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import type { IMedia } from '~/types/media';
import { getAniskip, type IAniSkipResponse } from '~/services/aniskip/aniskip.server';
import {
  getAnimeEpisodeInfo,
  getAnimeEpisodeStream,
  getAnimeInfo,
} from '~/services/consumet/anilist/anilist.server';
import type { IAnimeInfo, IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import { getBilibiliEpisode, getBilibiliInfo } from '~/services/consumet/bilibili/bilibili.server';
import {
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
  getKissKhInfo,
} from '~/services/kisskh/kisskh.server';
import { loklokGetMovieInfo, loklokGetTvEpInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import getProviderList from '~/services/provider.server';
import { authenticate, insertHistory } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import ErrorBoundaryView from '~/components/elements/shared/ErrorBoundaryView';
import WatchDetail from '~/components/elements/shared/WatchDetail';

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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await authenticate(request, true, true, true);

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const isGetSkipOpEd = url.searchParams.get('skipOpEd') === 'true';
  const routePlayer = `${url.pathname}${url.search}`;
  const { animeId, episodeId } = params;
  const aid = Number(animeId);
  if (!animeId || !episodeId) throw new Response('Not Found', { status: 404 });

  const [detail, episodes] = await Promise.all([
    getAnimeInfo(animeId),
    getAnimeEpisodeInfo(animeId),
  ]);
  const sortEpisodes = episodes?.sort((a, b) => a.number - b.number);
  const title =
    detail?.title?.english || detail?.title?.userPreferred || detail?.title?.romaji || '';
  const orgTitle = detail?.title?.native;
  const year = detail?.releaseDate;
  const episodeIndex = episodes
    ? episodes.find((e) => e.number === Number(episodeId))?.id
    : undefined;
  const totalEpisodes = Number(episodes?.length);
  const episodeInfo = episodes?.find((e: IEpisodeInfo) => e.number === Number(episodeId));
  const titlePlayer = title;
  const posterPlayer = detail?.cover || '';
  const trailerAnime = detail?.trailer;
  const subtitleOptions = {
    type: 'episode',
    title: detail?.title?.userPreferred || detail?.title?.english || '',
    sub_format: provider === 'KissKh' ? 'srt' : 'webvtt',
  };
  const animeType = detail?.type?.toLowerCase() || 'tv';
  const overview = detail?.description;
  const malId = detail?.malId;
  const skipTypes = ['op', 'ed', 'mixed-ed', 'mixed-op', 'recap'];
  const isEnded = detail?.status === 'FINISHED';

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

  const highlights: {
    start: number;
    end: number;
    text: string;
  }[] = [];
  const getHighlights = async (aniskip: IAniSkipResponse) => {
    if (aniskip.statusCode === 200) {
      const { results } = aniskip;
      // eslint-disable-next-line no-restricted-syntax
      for (const skipType of skipTypes) {
        const item = results.find((result) => result.skipType === skipType);
        if (item) {
          highlights.push({
            start: item?.interval?.startTime,
            end: item?.interval?.endTime,
            text: item?.skipType.toUpperCase(),
          });
        }
      }
      // sort highlights by start time
      highlights.sort((a, b) => a.start - b.start);
    }
  };

  if (provider === 'Loklok') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [tvDetail, providers, aniskip] = await Promise.all([
      detail?.type === 'MOVIE'
        ? loklokGetMovieInfo(idProvider)
        : loklokGetTvEpInfo(idProvider, Number(episodeId) - 1),
      getProviderList({
        type: 'anime',
        title,
        orgTitle,
        year,
        season: undefined,
        animeId: aid,
        animeType,
        isEnded,
      }),
      malId && isGetSkipOpEd ? getAniskip(malId, Number(episodeId)) : undefined,
    ]);
    const totalProviderEpisodes = Number(tvDetail?.data?.episodeCount);
    const hasNextEpisode = checkHasNextEpisode(
      provider,
      Number(episodeInfo?.number),
      totalEpisodes,
      totalProviderEpisodes,
    );
    if (aniskip) {
      await getHighlights(aniskip);
      return json(
        {
          provider,
          idProvider,
          detail,
          episodes: sortEpisodes,
          hasNextEpisode,
          sources: tvDetail?.sources,
          subtitles: tvDetail?.subtitles.map((sub) => ({
            lang: `${sub.language} (${sub.lang})`,
            url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
          })),
          userId: user?.id,
          episodeInfo,
          providers,
          routePlayer,
          titlePlayer,
          id: aid,
          posterPlayer,
          typeVideo: 'anime',
          trailerAnime,
          subtitleOptions,
          overview,
          highlights,
        },
        {
          headers: {
            'Cache-Control': CACHE_CONTROL.detail,
          },
        },
      );
    }
    return json(
      {
        provider,
        idProvider,
        detail,
        episodes: sortEpisodes,
        hasNextEpisode,
        sources: tvDetail?.sources,
        subtitles: tvDetail?.subtitles.map((sub) => ({
          lang: `${sub.language} (${sub.lang})`,
          url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
        })),
        userId: user?.id,
        episodeInfo,
        providers,
        routePlayer,
        titlePlayer,
        id: aid,
        posterPlayer,
        typeVideo: 'anime',
        trailerAnime,
        subtitleOptions,
        overview,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.detail,
        },
      },
    );
  }

  if (provider === 'Gogo') {
    const [providers, aniskip, gogoEpisodes] = await Promise.all([
      getProviderList({
        type: 'anime',
        title,
        orgTitle,
        year,
        season: undefined,
        animeId: aid,
        animeType,
        isEnded,
      }),
      malId && isGetSkipOpEd ? getAniskip(malId, Number(episodeId)) : undefined,
      getAnimeEpisodeInfo(animeId, undefined, 'gogoanime'),
    ]);
    const hasNextEpisode = checkHasNextEpisode(
      provider,
      Number(episodeInfo?.number),
      totalEpisodes,
    );
    const gogoEpisodeId = gogoEpisodes
      ? gogoEpisodes.find((e) => e.number === Number(episodeId))?.id
      : undefined;
    if (aniskip) {
      const [, episodeDetail] = await Promise.all([
        getHighlights(aniskip),
        getAnimeEpisodeStream(gogoEpisodeId, 'gogoanime'),
      ]);
      return json(
        {
          provider,
          detail,
          episodes: sortEpisodes,
          hasNextEpisode,
          sources: episodeDetail?.sources.map((source) => ({
            ...source,
            url: `${
              env.CORS_PROXY_URL === undefined
                ? source.url
                : `${env.CORS_PROXY_URL}?url=${encodeURIComponent(source.url)}`
            }`,
          })),
          userId: user?.id,
          episodeInfo,
          providers,
          routePlayer,
          titlePlayer,
          id: aid,
          posterPlayer,
          typeVideo: 'anime',
          trailerAnime,
          subtitleOptions,
          overview,
          highlights,
        },
        {
          headers: {
            'Cache-Control': CACHE_CONTROL.detail,
          },
        },
      );
    }
    const episodeDetail = await getAnimeEpisodeStream(gogoEpisodeId, 'gogoanime');
    return json(
      {
        provider,
        detail,
        episodes: sortEpisodes,
        hasNextEpisode,
        sources: episodeDetail?.sources.map((source) => ({
          ...source,
          url: `${
            env.CORS_PROXY_URL === undefined
              ? source.url
              : `${env.CORS_PROXY_URL}?url=${encodeURIComponent(source.url)}`
          }`,
        })),
        userId: user?.id,
        episodeInfo,
        providers,
        routePlayer,
        titlePlayer,
        id: aid,
        posterPlayer,
        typeVideo: 'anime',
        trailerAnime,
        subtitleOptions,
        overview,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.detail,
        },
      },
    );
  }

  if (provider === 'Zoro') {
    const [providers, aniskip, zoroEpisodes] = await Promise.all([
      getProviderList({
        type: 'anime',
        title,
        orgTitle,
        year,
        season: undefined,
        animeId: aid,
        animeType,
        isEnded,
      }),
      malId && isGetSkipOpEd ? getAniskip(malId, Number(episodeId)) : undefined,
      getAnimeEpisodeInfo(animeId, undefined, 'zoro'),
    ]);
    const hasNextEpisode = checkHasNextEpisode(
      provider,
      Number(episodeInfo?.number),
      totalEpisodes,
    );
    const zoroEpisodeId = zoroEpisodes
      ? zoroEpisodes.find((e) => e.number === Number(episodeId))?.id
      : undefined;
    if (aniskip) {
      const [, episodeDetail] = await Promise.all([
        getHighlights(aniskip),
        getAnimeEpisodeStream(zoroEpisodeId, 'zoro', 'vidstreaming'),
      ]);
      return json(
        {
          provider,
          detail,
          episodes: sortEpisodes,
          hasNextEpisode,
          sources: episodeDetail?.sources.map((source) => ({
            ...source,
            url: `${
              env.CORS_PROXY_URL === undefined
                ? source.url
                : `${env.CORS_PROXY_URL}?url=${encodeURIComponent(source.url)}`
            }`,
          })),
          userId: user?.id,
          episodeInfo,
          providers,
          routePlayer,
          titlePlayer,
          id: aid,
          posterPlayer,
          typeVideo: 'anime',
          trailerAnime,
          subtitleOptions,
          overview,

          highlights,
        },
        {
          headers: {
            'Cache-Control': CACHE_CONTROL.detail,
          },
        },
      );
    }
    const episodeDetail = await getAnimeEpisodeStream(zoroEpisodeId, 'zoro', 'vidstreaming');
    return json(
      {
        provider,
        detail,
        episodes: sortEpisodes,
        hasNextEpisode,
        sources: episodeDetail?.sources.map((source) => ({
          ...source,
          url: `${
            env.CORS_PROXY_URL === undefined
              ? source.url
              : `${env.CORS_PROXY_URL}?url=${encodeURIComponent(source.url)}`
          }`,
        })),
        userId: user?.id,
        episodeInfo,
        providers,
        routePlayer,
        titlePlayer,
        id: aid,
        posterPlayer,
        typeVideo: 'anime',
        trailerAnime,
        subtitleOptions,
        overview,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.detail,
        },
      },
    );
  }

  if (provider === 'Bilibili') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [animeInfo, providers, aniskip] = await Promise.all([
      getBilibiliInfo(Number(idProvider)),
      getProviderList({
        type: 'anime',
        title,
        orgTitle,
        year,
        season: undefined,
        animeId: aid,
        animeType,
        isEnded,
      }),
      malId && isGetSkipOpEd ? getAniskip(malId, Number(episodeId)) : undefined,
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
    if (aniskip) {
      await getHighlights(aniskip);
      return json(
        {
          provider,
          idProvider,
          detail,
          episodes: sortEpisodes,
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
          routePlayer,
          titlePlayer,
          id: aid,
          posterPlayer,
          typeVideo: 'anime',
          trailerAnime,
          subtitleOptions,
          overview,

          highlights,
        },
        {
          headers: {
            'Cache-Control': CACHE_CONTROL.detail,
          },
        },
      );
    }

    return json(
      {
        provider,
        idProvider,
        detail,
        episodes: sortEpisodes,
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
        routePlayer,
        titlePlayer,
        id: aid,
        posterPlayer,
        typeVideo: 'anime',
        trailerAnime,
        subtitleOptions,
        overview,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.detail,
        },
      },
    );
  }

  if (provider === 'KissKh') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [episodeDetail, providers, aniskip] = await Promise.all([
      getKissKhInfo(Number(idProvider)),
      getProviderList({
        type: 'anime',
        title,
        orgTitle,
        year,
        season: undefined,
        animeId: aid,
        animeType,
        isEnded,
      }),
      malId && isGetSkipOpEd ? getAniskip(malId, Number(episodeId)) : undefined,
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

    if (aniskip) {
      await getHighlights(aniskip);
      return json(
        {
          provider,
          idProvider,
          detail,
          episodes: sortEpisodes,
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
          routePlayer,
          titlePlayer,
          id: aid,
          posterPlayer,
          typeVideo: 'anime',
          trailerAnime,
          subtitleOptions,
          overview,

          highlights,
        },
        {
          headers: {
            'Cache-Control': CACHE_CONTROL.detail,
          },
        },
      );
    }

    return json(
      {
        provider,
        idProvider,
        detail,
        episodes: sortEpisodes,
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
        routePlayer,
        titlePlayer,
        id: aid,
        posterPlayer,
        typeVideo: 'anime',
        trailerAnime,
        subtitleOptions,
        overview,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.detail,
        },
      },
    );
  }
  const [sources, providers, aniskip] = await Promise.all([
    getAnimeEpisodeStream(episodeIndex),
    getProviderList({
      type: 'anime',
      title,
      orgTitle,
      year,
      season: undefined,
      animeId: aid,
      animeType,
      isEnded,
    }),
    malId && isGetSkipOpEd ? getAniskip(malId, Number(episodeId)) : undefined,
  ]);

  if (!detail || !sources) throw new Response('Not Found', { status: 404 });
  if (aniskip) {
    await getHighlights(aniskip);
    return json(
      {
        detail,
        episodes: sortEpisodes,
        sources: sources?.sources.map((source) => ({
          ...source,
          url: `${
            env.CORS_PROXY_URL === undefined
              ? source.url
              : `${env.CORS_PROXY_URL}?url=${encodeURIComponent(source.url)}`
          }`,
        })),
        userId: user?.id,
        episodeInfo,
        providers,
        routePlayer,
        titlePlayer,
        id: aid,
        posterPlayer,
        typeVideo: 'anime',
        trailerAnime,
        subtitleOptions,
        overview,
        highlights,
      },
      {
        headers: {
          'Cache-Control': CACHE_CONTROL.detail,
        },
      },
    );
  }

  return json(
    {
      detail,
      episodes: sortEpisodes,
      sources: sources?.sources.map((source) => ({
        ...source,
        url: `${
          env.CORS_PROXY_URL === undefined
            ? source.url
            : `${env.CORS_PROXY_URL}?url=${encodeURIComponent(source.url)}`
        }`,
      })),
      userId: user?.id,
      episodeInfo,
      providers,
      routePlayer,
      titlePlayer,
      id: aid,
      posterPlayer,
      typeVideo: 'anime',
      trailerAnime,
      subtitleOptions,
      overview,
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.detail,
      },
    },
  );
};

export const meta = mergeMeta<typeof loader>(({ data, params }) => {
  if (!data) {
    return [
      { title: 'Missing Episode' },
      { name: 'description', content: `This anime doesn't has episode ${params.episodeId}` },
    ];
  }
  const { detail, episodeInfo } = data;
  const { title, description } = detail || {};
  const animeTitle = title?.userPreferred || title?.english || title?.romaji || title?.native || '';
  return [
    { title: `Sora - Watch ${animeTitle} episode ${episodeInfo?.number || ''}` },
    {
      name: 'description',
      content: description
        ? description?.replace(/<\/?[^>]+(>|$)/g, '')
        : `Watch ${animeTitle} in Sora`,
    },
    {
      property: 'og:url',
      content: `https://sorachill.vercel.app/anime/${params.animeId}/episode/${params.episodeId}/watch`,
    },
    {
      property: 'og:title',

      content: `Sora - Watch ${animeTitle} episode ${episodeInfo?.number || ''}`,
    },
    {
      property: 'og:description',
      content: description
        ? description?.replace(/<\/?[^>]+(>|$)/g, '')
        : `Watch ${animeTitle} in Sora`,
    },
    { property: 'og:image', content: `https://img.anili.st/media/${params.animeId}` },
    {
      name: 'keywords',
      content: `Watch ${animeTitle}, Stream ${animeTitle}, Watch ${animeTitle} HD, Online ${animeTitle}, Streaming ${animeTitle}, English, Subtitle ${animeTitle}, English Subtitle`,
    },
    { name: 'twitter:image', content: `https://img.anili.st/media/${params.animeId}` },
    {
      name: 'twitter:title',

      content: `Sora - Watch ${animeTitle} episode ${episodeInfo?.number || ''}`,
    },
    {
      name: 'twitter:description',
      content: description
        ? description?.replace(/<\/?[^>]+(>|$)/g, '')
        : `Watch ${animeTitle} in Sora`,
    },
  ];
});

export const handle: Handle = {
  breadcrumb: ({ match }) => (
    <>
      <BreadcrumbItem
        to={`/anime/${match.params.animeId}/`}
        key={`anime-${match.params.animeId}-overview`}
      >
        {(match.data as { detail: IAnimeInfo })?.detail?.title?.english ||
          (match.data as { detail: IAnimeInfo })?.detail?.title?.romaji}
      </BreadcrumbItem>
      <BreadcrumbItem
        to={`/anime/${match.params.animeId}/episode/${match.params.episodeId}`}
        key={`anime-${match.params.animeId}-episode-${match.params.episodeId}`}
      >
        {(match?.data as { episodeInfo: IEpisodeInfo })?.episodeInfo?.title ||
          match.params.episodeId}
      </BreadcrumbItem>
    </>
  ),
  miniTitle: ({ match, t }) => ({
    title:
      (match.data as { detail: IAnimeInfo })?.detail?.title?.userPreferred ||
      (match.data as { detail: IAnimeInfo })?.detail?.title?.english ||
      (match.data as { detail: IAnimeInfo })?.detail?.title?.romaji ||
      (match.data as { detail: IAnimeInfo })?.detail?.title?.native ||
      '',
    subtitle: `${t('episode')} ${match.params.episodeId}`,
    showImage: (match.data as { detail: IAnimeInfo })?.detail?.image !== undefined,
    imageUrl: (match.data as { detail: IAnimeInfo })?.detail?.image,
  }),
  playerSettings: {
    isMini: false,
    shouldShowPlayer: true,
  },
};

const AnimeEpisodeWatch = () => {
  const { detail, episodes, providers } = useLoaderData<typeof loader>();
  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center px-3 sm:px-0">
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
    </div>
  );
};

export function ErrorBoundary() {
  return (
    <ErrorBoundaryView
      statusHandlers={{
        404: ({ params }) => <p>This anime doesn't has episode {params.episodeId}</p>,
      }}
    />
  );
}

export default AnimeEpisodeWatch;
