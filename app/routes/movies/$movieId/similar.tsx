/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useNavigate, Link, RouteMatch, useParams } from '@remix-run/react';
import { Row, Pagination } from '@nextui-org/react';
import { getSimilar } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/media/MediaList';
import useMediaQuery from '~/hooks/useMediaQuery';
import i18next from '~/i18n/i18next.server';

type LoaderData = {
  similar: Awaited<ReturnType<typeof getSimilar>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { movieId } = params;
  const mid = Number(movieId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const locale = await i18next.getLocale(request);
  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const similar = await getSimilar('movie', mid, page, locale);
  if (!similar) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    similar,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <Link to={`/movies/${match.params.movieId}/similar`}>Similar Movies</Link>
  ),
};

const SimilarPage = () => {
  const { movieId } = useParams();
  const { similar } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const isXs = useMediaQuery(650);
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
          paddingLeft: 'calc(var(--nextui-space-sm))',
          paddingRight: 'calc(var(--nextui-space-sm))',
        },
        '@xs': {
          paddingLeft: '88px',
          paddingRight: '1rem',
        },
      }}
    >
      {similar && similar.items && similar.items.length > 0 && (
        <>
          <MediaList listType="grid" items={similar.items} listName="Similar Movies" />
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
