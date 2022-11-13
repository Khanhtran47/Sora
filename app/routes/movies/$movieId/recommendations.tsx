/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, Link, RouteMatch, useParams } from '@remix-run/react';
import { Row, Pagination } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { authenticate } from '~/services/supabase';
import { getRecommendation } from '~/services/tmdb/tmdb.server';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';
import MediaList from '~/src/components/media/MediaList';

type LoaderData = {
  recommendations: Awaited<ReturnType<typeof getRecommendation>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const recommendations = await getRecommendation('movie', mid, page, locale);
  if (!recommendations) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    recommendations,
  });
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/recomendations`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/movies/${match.params.movieId}/recommendations`} aria-label="Recommendations">
      Recommendations
    </Link>
  ),
};

const RecommendationsPage = () => {
  const { movieId } = useParams();
  const { recommendations } = useLoaderData<LoaderData>();
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
    navigate(`/movies/${movieId}/recommendations?page=${page}`);

  return (
    <Row
      fluid
      justify="center"
      align="center"
      css={{
        flexDirection: 'column',
        '@xsMax': {
          paddingLeft: 'calc(var(--nextui-space-sm))',
          paddingRight: 'calc(var(--nextui-space-sm))',
        },
        '@xs': {
          paddingLeft: '88px',
          paddingRight: '1rem',
        },
      }}
    >
      {recommendations && recommendations.items && recommendations.items.length > 0 && (
        <>
          <MediaList
            listType="grid"
            items={recommendations.items}
            listName="Recommendations"
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
          <Pagination
            total={recommendations.totalPages}
            initialPage={recommendations.page}
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

export default RecommendationsPage;
