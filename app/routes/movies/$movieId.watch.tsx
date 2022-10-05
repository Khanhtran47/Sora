/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData, Link, RouteMatch } from '@remix-run/react';
import { Container, Row, Spacer, Loading } from '@nextui-org/react';
import { ClientOnly } from 'remix-utils';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
// import i18next from '~/i18n/i18next.server';
// import { getMovieDetail, getMovieTranslations } from '~/services/tmdb/tmdb.server';
// import { getSearchMedia, getLoklokMovieDetail } from '~/services/loklok/loklok.server';
// import { Result } from '~/services/loklok/loklok.types';
// import Player from '~/utils/player';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
// import useWindowSize from '~/hooks/useWindowSize';

// type LoaderData = {
//   detail: Awaited<ReturnType<typeof getMovieDetail>>;
//   search: Awaited<ReturnType<typeof getSearchMedia>>;
//   movieDetail: Awaited<ReturnType<typeof getLoklokMovieDetail>>;
// };

export const meta: MetaFunction = () => ({
  refresh: {
    httpEquiv: 'Content-Security-Policy',
    content: 'upgrade-insecure-requests',
  },
});

type DataLoader = {
  data?: any;
  sources?: any;
  subtitles?: any;
};

export const loader: LoaderFunction = async () => {
  const resFetch = await fetch('https://loklok-git-test-khanhtran47.vercel.app/api/movie');
  const info = await resFetch.json();

  return json<DataLoader>(info);
};

// export const loader: LoaderFunction = async ({ request, params }) => {
//   const locale = await i18next.getLocale(request);
//   const { movieId } = params;
//   const mid = Number(movieId);
//   if (!mid) throw new Response('Not Found', { status: 404 });
//   const detail = await getMovieDetail(mid);
//   let search;
//   let movieDetail;
//   if ((detail && detail.original_language === 'en') || locale === 'en') {
//     search = await getSearchMedia(detail?.title || '');
//     const findMovie: Result | undefined = search?.find((item) => item.name === detail?.title);
//     if (findMovie && findMovie.id) {
//       movieDetail = await getLoklokMovieDetail(Number(findMovie.id));
//     }
//   } else {
//     const translations = await getMovieTranslations('movie', mid);
//     const findTranslation = translations?.translations.find((item) => item.iso_639_1 === 'en');
//     if (findTranslation) {
//       search = await getSearchMedia(findTranslation.data?.title || '');
//       const findMovie: Result | undefined = search?.find(
//         (item) => item.name === findTranslation.data?.title,
//       );
//       if (findMovie && findMovie.id) {
//         movieDetail = await getLoklokMovieDetail(Number(findMovie.id));
//       }
//     }
//   }

//   if (!detail || !search) throw new Response('Not Found', { status: 404 });

//   return json<LoaderData>({
//     detail,
//     search,
//     movieDetail,
//   });
// };

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
  const { sources, subtitles } = useLoaderData<DataLoader>();

  // console.log('🚀 ~ file: $movieId.watch.tsx ~ line 62 ~ MovieWatch ~ movieDetail', movieDetail);
  // const id = detail && detail.id;
  // const [player, setPlayer] = React.useState<string>('1');
  // const [source, setSource] = React.useState<string>(Player.moviePlayerUrl(Number(id), 1));
  // const { width } = useWindowSize();
  // React.useEffect(
  //   () =>
  //     player === '2'
  //       ? setSource(Player.moviePlayerUrl(Number(detail?.imdb_id), Number(player)))
  //       : setSource(Player.moviePlayerUrl(Number(id), Number(player))),
  //   [player, detail?.imdb_id, id],
  // );
  // const hlsConfig = {};
  const subtitleSelector =
    subtitles &&
    subtitles.map(({ lang, language, url }: { lang: string; language: string; url: string }) => ({
      html: language.toString(),
      url: url.toString(),
      ...(lang === 'en' && { default: true }),
    }));
  const qualitySelector =
    sources &&
    sources.map(({ quality, url }: { quality: number; url: string }) => ({
      html: `${quality.toString()}P`,
      url: url.toString(),
      ...(quality === 720 && { default: true }),
    }));
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
                  sources.find((item: { quality: number; url: string }) => item.quality === 720)
                    ?.url || '',
                subtitle: {
                  url:
                    subtitles.find(
                      (item: { lang: string; language: string; url: string }) => item.lang === 'en',
                    )?.url || '',
                  type: 'srt',
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
              qualitySelector={qualitySelector}
              subtitleSelector={subtitleSelector}
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
