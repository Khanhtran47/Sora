/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, NavLink, RouteMatch, useParams } from '@remix-run/react';
import { Row, Badge } from '@nextui-org/react';
import { useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import { authenticate } from '~/services/supabase';
import { getSimilar } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import MediaList from '~/components/media/MediaList';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId } = params;
  const mid = Number(tvId);
  if (!mid) throw new Response('Not Found', { status: 404 });

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page')) || undefined;
  if (page && (page < 1 || page > 1000)) page = 1;

  const similar = await getSimilar('tv', mid, page, locale);
  if (!similar) throw new Response('Not Found', { status: 404 });

  return json(
    {
      similar,
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ params }) => ({
  'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/similar`,
});

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <NavLink to={`/tv-shows/${match.params.movieId}/similar`} aria-label="Similar Tv">
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
          Similar Tv Shows
        </Badge>
      )}
    </NavLink>
  ),
};

const TvSimilarPage = () => {
  const { tvId } = useParams();
  const { similar } = useLoaderData<typeof loader>();
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
    navigate(`/tv-shows/${tvId}/similar?page=${page}`);

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
      {similar && similar.items && similar.items.length > 0 && (
        <MediaList
          listType="grid"
          showListTypeChangeButton
          itemsType="tv"
          items={similar.items}
          listName="Similar Tv Shows"
          genresMovie={rootData?.genresMovie}
          genresTv={rootData?.genresTv}
          showPagination
          totalPages={similar?.totalPages}
          currentPage={similar?.page}
          onPageChangeHandler={(page: number) => paginationChangeHandler(page)}
        />
      )}
    </Row>
  );
};

export default TvSimilarPage;
