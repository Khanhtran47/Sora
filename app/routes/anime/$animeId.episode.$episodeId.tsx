/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
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
import { ClientOnly, useRouteData } from 'remix-utils';
import { isDesktop } from 'react-device-detect';

import {
  getAnimeEpisodeStream,
  getAnimeInfo,
  getAnimeEpisodeInfo,
} from '~/services/consumet/anilist/anilist.server';
import { IEpisode } from '~/services/consumet/anilist/anilist.types';
import { loklokGetTvEpInfo } from '~/services/loklok';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import { IMovieSource, IMovieSubtitle } from '~/services/consumet/flixhq/flixhq.types';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
import { User } from '@supabase/supabase-js';
import updateHistory from '~/utils/update-history';
import { getUserFromCookie, insertHistory } from '~/services/supabase';

type LoaderData = {
  provider?: string;
  sources: IMovieSource[] | undefined;
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
  subtitles?: IMovieSubtitle[] | undefined;
  user?: User;
  episodeInfo: IEpisode | undefined;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const episode = url.searchParams.get('episode');
  const { animeId, episodeId } = params;
  if (!animeId || !episodeId) throw new Response('Not Found', { status: 404 });

  const [detail, episodes, sources, user] = await Promise.all([
    getAnimeInfo(animeId),
    getAnimeEpisodeInfo(animeId),
    getAnimeEpisodeStream(episodeId),
    getUserFromCookie(request.headers.get('Cookie') || ''),
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
      user,
      episodeInfo,
    });
  }

  if (provider === 'Gogo') {
    const episodeDetail = await getAnimeEpisodeStream(episodeId, 'gogoanime');

    return json<LoaderData>({
      provider,
      detail,
      sources: episodeDetail?.sources,
      user,
      episodeInfo,
    });
  }

  if (provider === 'Zoro') {
    const episodeDetail = await getAnimeEpisodeStream(episodeId, 'zoro');

    return json<LoaderData>({
      provider,
      detail,
      sources: episodeDetail?.sources,
      user,
      episodeInfo,
    });
  }

  if (!detail || !sources) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ detail, sources: sources.sources, user, episodeInfo });
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
    } episode ${
      episodeInfo.number
    } in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
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
    'og:url': `https://sora-movie.vercel.app/anime/${params.animeId}/episode/${params.episodeId}`,
    'og:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${episodeInfo.number} HD online Free - Sora`,
    'og:description': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native || ''
    } episode ${
      episodeInfo.number
    } in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
    'og:image': episodeInfo?.image || detail.cover,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link to={`/anime/${match.params.animeId}/overview`}>{match.params.animeId}</Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link to={`/anime/${match.params.animeId}/episode/${match.params.episodeId}`}>
        {match.params.episodeId}
      </Link>
    </>
  ),
};

const AnimeEpisodeWatch = () => {
  const { provider, detail, sources, subtitles, episodeInfo } = useLoaderData<LoaderData>();
  const { episodeId } = useParams();

  const fetcher = useFetcher();
  const location = useLocation();
  const user = useRouteData<{ user: User }>('root')?.user;

  const subtitleSelector = subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
    html: lang.toString(),
    url: url.toString(),
    ...(provider === 'Loklok' && lang === 'en' && { default: true }),
  }));
  const qualitySelector = sources?.map(
    ({ quality, url }: { quality: number | string; url: string }) => ({
      html: quality.toString(),
      url: url.toString(),
      ...(provider === 'Loklok' && Number(quality) === 720 && { default: true }),
      ...((provider === 'Gogo' || provider === 'Zoro') &&
        quality === 'default' && { default: true }),
      ...(!provider && quality === 'default' && { default: true }),
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
          <AspectRatio.Root ratio={7 / 3}>
            {sources && (
              <ArtPlayer
                option={{
                  title: `${detail?.title?.userPreferred as string} Episode ${episodeInfo?.number}`,
                  url:
                    provider === 'Loklok'
                      ? sources?.find(
                          (item: { quality: number | string; url: string }) =>
                            Number(item.quality) === 720,
                        )?.url
                      : provider === 'Gogo' || provider === 'Zoro'
                      ? sources?.find(
                          (item: { quality: number | string; url: string }) =>
                            item.quality === 'default',
                        )?.url
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

                  if (user) {
                    updateHistory(
                      art,
                      fetcher,
                      user.id,
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
                }}
              />
            )}
          </AspectRatio.Root>
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
