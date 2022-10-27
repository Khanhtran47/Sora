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

import { getAnimeEpisodeStream, getAnimeInfo } from '~/services/consumet/anilist/anilist.server';
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

type LoaderData = {
  provider?: string;
  sources: IMovieSource[] | undefined;
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
  subtitles?: IMovieSubtitle[] | undefined;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const episode = url.searchParams.get('episode');
  const { animeId, episodeId } = params;
  if (!animeId || !episodeId) throw new Response('Not Found', { status: 404 });
  if (provider === 'Loklok') {
    const detail = await getAnimeInfo(animeId);
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
    });
  }
  if (provider === 'Gogo') {
    const [detail, episodeDetail] = await Promise.all([
      getAnimeInfo(animeId),
      getAnimeEpisodeStream(episodeId, 'gogoanime'),
    ]);
    return json<LoaderData>({
      provider,
      detail,
      sources: episodeDetail?.sources,
    });
  }
  if (provider === 'Zoro') {
    const [detail, episodeDetail] = await Promise.all([
      getAnimeInfo(animeId),
      getAnimeEpisodeStream(episodeId, 'zoro'),
    ]);
    return json<LoaderData>({
      provider,
      detail,
      sources: episodeDetail?.sources,
    });
  }
  const [detail, sources] = await Promise.all([
    getAnimeInfo(animeId),
    getAnimeEpisodeStream(episodeId),
  ]);
  if (!detail || !sources) throw new Response('Not Found', { status: 404 });
  return json<LoaderData>({ detail, sources: sources.sources });
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Episode',
      description: `This anime doesn't has episode ${params.episodeId}`,
    };
  }
  const { detail } = data;
  const { title } = detail;
  const episodeInfo = detail?.episodes?.find((e: IEpisode) => e.id === params.episodeId);
  return {
    title: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${episodeInfo.number} HD online Free - Sora`,
    description: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${
      episodeInfo.number
    } in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
    keywords: `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${episodeInfo.number}, Stream ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${episodeInfo.number}, Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${episodeInfo.number} HD, Online ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${episodeInfo.number}, Streaming ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${episodeInfo.number}, English, Subtitle ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${episodeInfo.number}, English Subtitle`,
    'og:url': `https://sora-movie.vercel.app/anime/${params.animeId}/episode/${params.episodeId}`,
    'og:title': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
    } episode ${episodeInfo.number} HD online Free - Sora`,
    'og:description': `Watch ${
      title?.userPreferred || title?.english || title?.romaji || title?.native
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
  const { provider, detail, sources, subtitles } = useLoaderData<LoaderData>();
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
                  title: `${detail?.title?.userPreferred as string} Episode ${
                    detail?.episodes.find((episode) => episode.id === episodeId)?.number
                  }`,
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
                }}
                qualitySelector={qualitySelector || []}
                subtitleSelector={subtitleSelector || []}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                getInstance={(art) => {
                  if (user) {
                    updateHistory(
                      art,
                      fetcher,
                      user.id,
                      location.pathname + location.search,
                      detail?.title?.userPreferred ?? detail?.title?.english ?? '',
                      detail?.description ?? '',
                      detail?.season,
                      episodeId,
                    );
                  }
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
