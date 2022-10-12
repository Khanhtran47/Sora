/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, Link, RouteMatch } from '@remix-run/react';
import { Container, Row, Col, Spacer } from '@nextui-org/react';

import { getPeopleDetail, getPeopleExternalIds } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import useMediaQuery from '~/hooks/useMediaQuery';
import TMDB from '~/utils/media';
import PeopleDetail from '~/src/components/people/PeopleDetail';
import Tab from '~/src/components/elements/Tab';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getPeopleDetail>>;
  externalIds: {
    facebookId: null | string;
    instagramId: string | null;
    twitterId: null | string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const locale = await i18next.getLocale(request);
  const { peopleId } = params;
  const pid = Number(peopleId);
  if (!pid) throw new Response('Not Found', { status: 404 });

  const detail = await getPeopleDetail(pid, locale);
  const externalIds = await getPeopleExternalIds(pid, locale);
  if (!detail || !externalIds) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    externalIds: {
      facebookId: externalIds.facebook_id || null,
      instagramId: externalIds.instagram_id || null,
      twitterId: externalIds.twitter_id || null,
    },
  });
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
    title: `${detail?.name} | Sora - Watch The Best of Movies, TV Shows & Animes`,
    description: `Watch ${detail?.name} movies and series in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
    keywords: `watch ${detail?.name} free, watch ${detail?.name} movies, watch ${detail?.name} series, stream ${detail?.name} series, ${detail?.name} movies online free`,
    'og:url': `https://sora-movie.vercel.app/people/${params.peopleId}`,
    'og:title': `${detail?.name} | Sora - Watch The Best of Movies, TV Shows & Animes`,
    'og:description': `Watch ${detail?.name} movies and series in full HD online with Subtitle - No sign up - No Buffering - One Click Streaming`,
    'og:image': TMDB.profileUrl(detail?.profile_path, 'w185'),
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link to="/people">Popular People</Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link to={`/people/${match.params.peopleId}`}>{match.params.peopleId}</Link>
    </>
  ),
};

const detailTab = [
  { pageName: 'Overview', pageLink: '/overview' },
  { pageName: 'Credits', pageLink: '/credits' },
  { pageName: 'Media', pageLink: '/media' },
];

const PeopleDetailPage = () => {
  const { detail, externalIds } = useLoaderData<LoaderData>();
  const isSm = useMediaQuery(650, 'max');
  return (
    <Container
      as="div"
      fluid
      responsive
      css={{
        margin: 0,
        paddingTop: '92px',
        paddingLeft: '88px',
        '@smMax': {
          paddingLeft: 0,
          paddingBottom: '65px',
        },
      }}
    >
      <Tab pages={detailTab} linkTo={`/people/${detail?.id}`} />
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
        <Col span={isSm ? 12 : 4}>
          <PeopleDetail detail={detail} externalIds={externalIds} />
          <Spacer y={1} />
        </Col>
        <Col span={isSm ? 12 : 8}>
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

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};

export default PeopleDetailPage;
