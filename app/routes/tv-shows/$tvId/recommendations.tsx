/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate, Link, RouteMatch, useParams } from '@remix-run/react';
import { Row } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { getRecommendation } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import MediaList from '~/src/components/media/MediaList';
import { authenticate } from '~/services/supabase';

type LoaderData = {
  recommendations: Awaited<ReturnType<typeof getRecommendation>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticate(request);

  const { tvId } = params;
  const mid = Number(tvId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const locale = await i18next.getLocale(request);
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const recommendations = await getRecommendation('tv', mid, page, locale);
  if (!recommendations) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    recommendations,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/tv-shows/${match.params.tvId}/recommendations`} aria-label="Recommendations">
      Recommendations
    </Link>
  ),
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/recommendations`,
});

const RecommendationsPage = () => {
  const { tvId } = useParams();
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
  const paginationChangeHandler = (page: number) =>
    navigate(`/tv-shows/${tvId}/recommendations?page=${page}`);

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
      {recommendations && recommendations.items && recommendations.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          items={recommendations.items}
          listName="Recommendations"
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          showPagination
          totalPages={recommendations?.totalPages}
          currentPage={recommendations?.page}
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
        />
      )}
    </Row>
  );
};

export default RecommendationsPage;
