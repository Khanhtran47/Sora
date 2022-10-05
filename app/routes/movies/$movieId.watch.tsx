/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Link, RouteMatch } from '@remix-run/react';
import { Container, Row, Spacer, Loading } from '@nextui-org/react';
import { ClientOnly } from 'remix-utils';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import i18next from '~/i18n/i18next.server';
import { getMovieDetail, getMovieTranslations } from '~/services/tmdb/tmdb.server';
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
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
// import useWindowSize from '~/hooks/useWindowSize';

export const meta: MetaFunction = () => ({
  refresh: {
    httpEquiv: 'Content-Security-Policy',
    content: 'upgrade-insecure-requests',
  },
});

type DataLoader = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
  data?: Awaited<ReturnType<typeof getMovieInfo>>;
  sources?: IMovieSource[] | undefined;
  subtitles?: IMovieSubtitle[] | undefined;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });
  const detail = await getMovieDetail(mid);
  let search;
  let movieDetail;
  let movieStreamLink;
  if ((detail && detail.original_language === 'en') || locale === 'en') {
    search = await getMovieSearch(detail?.title || '');
    const findMovie: IMovieResult | undefined = search?.results.find(
      (item) => item.title === detail?.title,
    );
    if (findMovie && findMovie.id) {
      movieDetail = await getMovieInfo(findMovie.id);
      movieStreamLink = await getMovieEpisodeStreamLink(
        movieDetail?.episodes[0].id || '',
        movieDetail?.id || '',
      );
    }
  } else {
    const translations = await getMovieTranslations('movie', mid);
    const findTranslation = translations?.translations.find((item) => item.iso_639_1 === 'en');
    if (findTranslation) {
      search = await getMovieSearch(findTranslation.data?.title || '');
      const findMovie: IMovieResult | undefined = search?.results.find(
        (item) => item.title === findTranslation.data?.title,
      );
      if (findMovie && findMovie.id) {
        movieDetail = await getMovieInfo(findMovie.id);
        movieStreamLink = await getMovieEpisodeStreamLink(
          movieDetail?.episodes[0].id || '',
          movieDetail?.id || '',
        );
      }
    }
  }
  if (!detail || !search) throw new Response('Not Found', { status: 404 });

  return json<DataLoader>({
    detail,
    data: movieDetail,
    sources: movieStreamLink?.sources,
    subtitles: movieStreamLink?.subtitles,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link to={`/movies/${match.params.movieId}`}>{match.params.movieId}</Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link to={`/movies/${match.params.movieId}/watch`}>Watch</Link>
    </>
  ),
};

const MovieWatch = () => {
  // const { detail, movieDetail } = useLoaderData<LoaderData>();
  const { detail, data, sources, subtitles } = useLoaderData<DataLoader>();
  console.log('🚀 ~ file: $movieId.watch.tsx ~ line 153 ~ MovieWatch ~ subtitles', subtitles);
  console.log('🚀 ~ file: $movieId.watch.tsx ~ line 153 ~ MovieWatch ~ sources', sources);
  console.log('🚀 ~ file: $movieId.watch.tsx ~ line 153 ~ MovieWatch ~ data', data);
  console.log('🚀 ~ file: $movieId.watch.tsx ~ line 153 ~ MovieWatch ~ detail', detail);
  const subtitleSelector = subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
    html: lang.toString(),
    url: url.toString(),
    ...(lang === 'English' && { default: true }),
  }));
  const qualitySelector = sources?.map(
    ({ quality, url, isM3U8 }: { quality: number | string; url: string; isM3U8: boolean }) => ({
      html: `${quality.toString()}P`,
      url: isM3U8 ? url.toString() : '',
      ...(quality === 'auto' && { default: true }),
    }),
  );
  return (
    <Container
      fluid
      css={{
        paddingTop: '100px',
        paddingLeft: '88px',
        paddingRight: 0,
        '@mdMax': {
          paddingLeft: '1rem',
          paddingBottom: '65px',
        },
      }}
    >
      <ClientOnly fallback={<Loading type="default" />}>
        {() => (
          <Row>
            <ArtPlayer
              option={{
                title: 'test-player',
                url:
                  sources?.find(
                    (item: { quality: number | string; url: string }) => item.quality === 'auto',
                  )?.url || '',
                subtitle: {
                  url:
                    subtitles?.find(
                      (item: { lang: string; url: string }) => item.lang === 'English',
                    )?.url || '',
                  type: 'vtt',
                  encoding: 'utf-8',
                  style: {
                    fontSize: '40px',
                  },
                },
                isLive: false,
                muted: false,
                autoplay: false,
                pip: true,
                autoSize: true,
                autoMini: true,
                screenshot: true,
                setting: true,
                loop: true,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                fullscreen: true,
                fullscreenWeb: true,
                subtitleOffset: true,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                airplay: true,
                theme: 'var(--nextui-colors-primary)',
              }}
              qualitySelector={qualitySelector || []}
              subtitleSelector={subtitleSelector || []}
              style={{
                width: '100%',
                height: '600px',
                margin: '60px auto 0',
              }}
              getInstance={(art) => {
                console.log(art);
              }}
            />
          </Row>
        )}
      </ClientOnly>
    </Container>
  );
};

export default MovieWatch;

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};
