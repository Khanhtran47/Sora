/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { MetaFunction, LoaderArgs } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, NavLink, RouteMatch } from '@remix-run/react';
import { Container, Row, Col, Spacer, Badge } from '@nextui-org/react';

import { getPeopleDetail, getPeopleExternalIds } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import { authenticate } from '~/services/supabase';
import { CACHE_CONTROL } from '~/utils/server/http';

import TMDB from '~/utils/media';

import PeopleDetail from '~/components/media/PeopleDetail';
import CatchBoundaryView from '~/components/CatchBoundaryView';
import ErrorBoundaryView from '~/components/ErrorBoundaryView';

import { peopleDetailPages } from '~/constants/tabLinks';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { peopleId } = params;
  const pid = Number(peopleId);
  if (!pid) throw new Response('Not Found', { status: 404 });

  const detail = await getPeopleDetail(pid, locale);
  const externalIds = await getPeopleExternalIds(pid, locale);
  if (!detail || !externalIds) throw new Response('Not Found', { status: 404 });

  return json(
    {
      detail,
      externalIds: {
        facebookId: externalIds.facebook_id || null,
        instagramId: externalIds.instagram_id || null,
        twitterId: externalIds.twitter_id || null,
      },
    },
    {
      headers: { 'Cache-Control': CACHE_CONTROL.detail },
    },
  );
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing People',
      description: `There is no people with the ID: ${params.peopleId}`,
    };
  }
  const { detail } = data;
  return {
    title: `${detail?.name || ''} | Sora - Watch The Best of Movies, TV Shows & Animes`,
    description: `Watch ${detail?.name || ''} movies and series in full HD online with Subtitle`,
    keywords: `watch ${detail?.name || ''} free, watch ${detail?.name || ''} movies, watch ${
      detail?.name || ''
    } series, stream ${detail?.name || ''} series, ${detail?.name || ''} movies online free`,
    'og:url': `https://sora-anime.vercel.app/people/${params.peopleId}`,
    'og:title': `${detail?.name || ''} | Sora - Watch The Best of Movies, TV Shows & Animes`,
    'og:description': `Watch ${
      detail?.name || ''
    } movies and series in full HD online with Subtitle`,
    'og:image': detail?.profile_path ? TMDB.profileUrl(detail?.profile_path, 'w185') : undefined,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <NavLink to="/people" aria-label="Popular People">
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
            Popular People
          </Badge>
        )}
      </NavLink>
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink
        to={`/people/${match.params.peopleId}`}
        aria-label={match.data?.detail?.name || match.params.peopleId}
      >
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
            {match.data?.detail?.name || match.params.peopleId}
          </Badge>
        )}
      </NavLink>
    </>
  ),
  showTabLink: true,
  tabLinkPages: peopleDetailPages,
  tabLinkTo: (params: any) => `/people/${params.peopleId}`,
};

const PeopleDetailPage = () => {
  const { detail, externalIds } = useLoaderData<typeof loader>();
  return (
    <Container
      as="div"
      fluid
      responsive={false}
      css={{
        margin: 0,
        padding: 0,
      }}
    >
      <Row
        fluid
        align="stretch"
        justify="center"
        wrap="wrap"
        css={{
          marginTop: '0.75rem',
          padding: '0 0.75rem',
          '@xs': {
            padding: '0 3vw',
          },
          '@sm': {
            padding: '0 6vw',
          },
          '@md': {
            padding: '0 12vw',
          },
        }}
      >
        <Col
          css={{
            width: '100%',
            '@xs': { width: '33.3333%' },
          }}
        >
          <PeopleDetail detail={detail} externalIds={externalIds} />
          <Spacer y={1} />
        </Col>
        <Col
          css={{
            width: '100%',
            '@xs': { width: '66.6667%' },
          }}
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default PeopleDetailPage;
