/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  Outlet,
  Link,
  RouteMatch,
  useFetcher,
  useLocation,
} from '@remix-run/react';
import { Container } from '@nextui-org/react';

import { getMovieDetail, getTranslations, getImdbRating } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import TMDB from '~/utils/media';
import { authenticate } from '~/services/supabase';

import MediaDetail from '~/src/components/media/MediaDetail';
import WatchTrailerModal, { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
  translations?: Awaited<ReturnType<typeof getTranslations>>;
  imdbRating?: { count: number; star: number };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const detail = await getMovieDetail(mid, locale);
  if (!detail) throw new Response('Not Found', { status: 404 });
  if ((detail && detail.original_language !== 'en') || locale !== 'en') {
    const [translations, imdbRating] = await Promise.all([
      getTranslations('movie', mid),
      detail?.imdb_id ? getImdbRating(detail?.imdb_id) : undefined,
    ]);
    return json<LoaderData>({ detail, translations, imdbRating });
  }
  const imdbRating = detail?.imdb_id ? await getImdbRating(detail?.imdb_id) : undefined;
  return json<LoaderData>({ detail, imdbRating });
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Movie',
      description: `There is no movie with the ID: ${params.movieId}`,
    };
  }
  const { detail } = data;
  return {
    title: `Watch ${detail.title} HD online Free - Sora`,
    description: `Watch ${detail.title} in full HD online with Subtitle`,
    keywords: `Watch ${detail.title}, Stream ${detail.title}, Watch ${detail.title} HD, Online ${detail.title}, Streaming ${detail.title}, English, Subtitle ${detail.title}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}`,
    'og:title': `Watch ${detail.title} HD online Free - Sora`,
    'og:description': `Watch ${detail.title} in full HD online with Subtitle`,
    'og:image': TMDB.backdropUrl(detail?.backdrop_path || '', 'w780'),
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link
      to={`/movies/${match.params.movieId}`}
      aria-label={match.data?.detail?.title || match.params.movieId}
    >
      {match.data?.detail?.title || match.params.movieId}
    </Link>
  ),
};

const MovieDetail = () => {
  const { detail, translations, imdbRating } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const { state } = useLocation();
  const currentTime = state && (state as { currentTime: number }).currentTime;
  const [visible, setVisible] = React.useState(false);
  const [trailer, setTrailer] = React.useState<Trailer>({});
  const Handler = (id: number) => {
    setVisible(true);
    fetcher.load(`/movies/${id}/videos`);
  };
  const closeHandler = () => {
    setVisible(false);
    setTrailer({});
  };
  React.useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);

  return (
    <>
      <MediaDetail
        type="movie"
        item={detail}
        handler={Handler}
        translations={translations}
        imdbRating={imdbRating}
      />
      <Container
        as="div"
        fluid
        responsive
        css={{
          margin: 0,
          padding: 0,
        }}
      >
        <Outlet />
      </Container>
      <WatchTrailerModal
        trailer={trailer}
        visible={visible}
        closeHandler={closeHandler}
        currentTime={Number(currentTime)}
      />
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};

export default MovieDetail;
