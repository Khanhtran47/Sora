/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Link, RouteMatch, useParams } from '@remix-run/react';
import { Container, Spacer, Loading } from '@nextui-org/react';
import { ClientOnly } from 'remix-utils';
// import { isDesktop } from 'react-device-detect';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import { getAnimeEpisodeStream, getAnimeInfo } from '~/services/consumet/anilist/anilist.server';
import { Source } from '~/services/consumet/anilist/anilist.types';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  sources: Source[];
  detail: Awaited<ReturnType<typeof getAnimeInfo>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { animeId, episodeId } = params;
  if (!animeId || !episodeId) throw new Response('Not Found', { status: 404 });
  const [detail, sources] = await Promise.all([
    getAnimeInfo(animeId),
    getAnimeEpisodeStream(episodeId),
  ]);
  if (!detail || !sources) throw new Response('Not Found', { status: 404 });
  return json<LoaderData>(
    { detail, sources: sources.sources },
    { headers: { 'Cache-Control': 'max-age=7200000' } },
  );
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
  const { detail, sources } = useLoaderData<LoaderData>();
  const { episodeId } = useParams();

  const qualitySelector = sources?.map(
    ({ quality, url, isM3U8 }: { quality: number | string; url: string; isM3U8: boolean }) => ({
      html: `${quality.toString()}`,
      url: isM3U8 ? url.toString() : '',
      ...(quality === 'default' && { default: true }),
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
                    sources?.find(
                      (item: { quality: number | string; url: string }) =>
                        item.quality === 'default',
                    )?.url || '',
                  // subtitle: {
                  //   url:
                  //     subtitles?.find(
                  //       (item: { lang: string; url: string }) => item.lang === 'English',
                  //     )?.url || '',
                  //   encoding: 'utf-8',
                  //   style: {
                  //     fontSize: isDesktop ? '40px' : '20px',
                  //   },
                  // },
                  poster: detail?.cover,
                  isLive: false,
                  autoMini: true,
                  backdrop: true,
                  playsInline: true,
                  autoPlayback: true,
                }}
                qualitySelector={qualitySelector || []}
                // subtitleSelector={subtitleSelector || []}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                getInstance={(art) => {
                  console.log(art);
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
