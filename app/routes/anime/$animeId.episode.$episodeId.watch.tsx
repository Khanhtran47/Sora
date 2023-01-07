/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData, NavLink, RouteMatch } from '@remix-run/react';
import { Container, Spacer, Badge } from '@nextui-org/react';

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
import { IEpisodeInfo, ITrailer } from '~/services/consumet/anilist/anilist.types';
import { loklokGetTvEpInfo, loklokGetMovieInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import { IMovieSource, IMovieSubtitle } from '~/services/consumet/flixhq/flixhq.types';
import { IMedia } from '~/types/media';

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
  routePlayer: string;
  titlePlayer: string;
  id: number | string;
  posterPlayer: string;
  typeVideo: 'movie' | 'tv' | 'anime';
  trailerAnime?: ITrailer;
  subtitleOptions: {
    imdb_id?: number | undefined;
    tmdb_id?: number | undefined;
    parent_feature_id?: number;
    parent_imdb_id?: number;
    parent_tmdb_id?: number;
    episode_number?: number;
    season_number?: number;
    type?: string;
    title?: string;
    sub_format: string;
  };
  overview?: string;
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
  const routePlayer = `${url.pathname}${url.search}`;
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
  const titlePlayer = title;
  const posterPlayer = detail?.cover || '';
  const trailerAnime = detail?.trailer;
  const subtitleOptions = {
    type: 'episode',
    title: detail?.title?.userPreferred || detail?.title?.english || '',
    sub_format: provider === 'KissKh' ? 'srt' : 'webvtt',
  };
  const overview = detail?.description;

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
      routePlayer,
      titlePlayer,
      id: aid,
      posterPlayer,
      typeVideo: 'anime',
      trailerAnime,
      subtitleOptions,
      overview,
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
      routePlayer,
      titlePlayer,
      id: aid,
      posterPlayer,
      typeVideo: 'anime',
      trailerAnime,
      subtitleOptions,
      overview,
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
      routePlayer,
      titlePlayer,
      id: aid,
      posterPlayer,
      typeVideo: 'anime',
      trailerAnime,
      subtitleOptions,
      overview,
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
      routePlayer,
      titlePlayer,
      id: aid,
      posterPlayer,
      typeVideo: 'anime',
      trailerAnime,
      subtitleOptions,
      overview,
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
      routePlayer,
      titlePlayer,
      id: aid,
      posterPlayer,
      typeVideo: 'anime',
      trailerAnime,
      subtitleOptions,
      overview,
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
    routePlayer,
    titlePlayer,
    id: aid,
    posterPlayer,
    typeVideo: 'anime',
    trailerAnime,
    subtitleOptions,
    overview,
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
  playerSettings: {
    isMini: false,
    shouldShowPlayer: true,
  },
};

const AnimeEpisodeWatch = () => {
  const { detail, episodes, providers } = useLoaderData<LoaderData>();
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
