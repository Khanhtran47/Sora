/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useNavigate, Link, RouteMatch, useParams } from '@remix-run/react';
import { Row, Pagination } from '@nextui-org/react';
import { getRecommendation } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  recommendations: Awaited<ReturnType<typeof getRecommendation>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
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
    <Link to={`/tv-shows/${match.params.tvId}/recommendations`}>Recommendations</Link>
  ),
};

const RecommendationsPage = () => {
  const { tvId } = useParams();
  const { recommendations } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const isXs = useMediaQuery(650);
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
          <MediaList listType="grid" items={recommendations.items} listName="Recommendations" />
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
