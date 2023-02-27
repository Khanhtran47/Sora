/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, NavLink, RouteMatch, useParams } from '@remix-run/react';
import { Row, Badge } from '@nextui-org/react';

import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { authenticate } from '~/services/supabase';
import { getRecommendation } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import MediaList from '~/components/media/MediaList';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const recommendations = await getRecommendation('movie', mid, page, locale);
  if (!recommendations) throw new Response('Not Found', { status: 404 });

  return json(
    { recommendations },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/movies/${params.movieId}/recomendations`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink to={`/movies/${match.params.movieId}/recommendations`} aria-label="Recommendations">
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
          Recommendations
        </Badge>
      )}
    </NavLink>
  ),
};

const MovieRecommendationsPage = () => {
  const { movieId } = useParams();
  const { recommendations } = useLoaderData<typeof loader>();
  const rootData = useTypedRouteLoaderData('root');
  const navigate = useNavigate();
  const paginationChangeHandler = (page: number) =>
    navigate(`/movies/${movieId}/recommendations?page=${page}`);

  return (
    <Row
      fluid
      justify="center"
      align="center"
      css={{
        display: 'flex',
        flexDirection: 'column',
        '@xsMax': {
          paddingLeft: '$sm',
          paddingRight: '$sm',
        },
      }}
    >
      {recommendations && recommendations.items && recommendations.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={recommendations.items}
          listName="Recommendations"
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          showPagination
          totalPages={recommendations.totalPages}
          currentPage={recommendations.page}
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
        />
      )}
    </Row>
  );
};

export default MovieRecommendationsPage;
