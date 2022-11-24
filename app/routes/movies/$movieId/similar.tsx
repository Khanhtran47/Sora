/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, Link, RouteMatch, useParams } from '@remix-run/react';
import { Row, Pagination } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { authenticate } from '~/services/supabase';
import { getSimilar } from '~/services/tmdb/tmdb.server';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';
import MediaList from '~/src/components/media/MediaList';

type LoaderData = {
  similar: Awaited<ReturnType<typeof getSimilar>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const similar = await getSimilar('movie', mid, page, locale);
  if (!similar) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    similar,
  });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/similar`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/movies/${match.params.movieId}/similar`} aria-label="Similar Movies">
      Similar Movies
    </Link>
  ),
};

const SimilarPage = () => {
  const { movieId } = useParams();
  const { similar } = useLoaderData<LoaderData>();
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const navigate = useNavigate();
  const isXs = useMediaQuery('(max-width: 650px)');
  const paginationChangeHandler = (page: number) =>
    navigate(`/movies/${movieId}/similar?page=${page}`);

  return (
    <Row
      fluid
      justify="center"
      align="center"
      css={{
        flexDirection: 'column',
        '@xsMax': {
          paddingLeft: '$sm',
          paddingRight: '$sm',
        },
        '@xs': {
          paddingLeft: '88px',
          paddingRight: '1rem',
        },
      }}
    >
      {similar && similar.items && similar.items.length > 0 && (
        <>
          <MediaList
            listType="grid"
            showListTypeChangeButton
            itemsType="movie"
            items={similar.items}
            listName="Similar Movies"
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
          <Pagination
            total={similar.totalPages}
            initialPage={similar.page}
            shadow
            onChange={paginationChangeHandler}
            css={{ marginTop: '30px' }}
            {...(isXs && { size: 'xs' })}
          />
        </>
      )}
    </Row>
  );
};

export default SimilarPage;
