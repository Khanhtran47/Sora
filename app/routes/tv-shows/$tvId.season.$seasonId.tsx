/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, NavLink, RouteMatch, useParams } from '@remix-run/react';
import { Container, Spacer, Card, Col, Row, Avatar, Badge } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import Vibrant from 'node-vibrant';

import { useMediaQuery, useMeasure } from '@react-hookz/web';
import i18next from '~/i18n/i18next.server';
import { getTvShowDetail, getTvSeasonDetail } from '~/services/tmdb/tmdb.server';
import { authenticate } from '~/services/supabase';
import getProviderList from '~/services/provider.server';

import { CACHE_CONTROL } from '~/utils/server/http';
import TMDB from '~/utils/media';

import CatchBoundaryView from '~/components/CatchBoundaryView';
import ErrorBoundaryView from '~/components/ErrorBoundaryView';
import TabLink from '~/components/elements/tab/TabLink';
import { H2, H5, H6 } from '~/components/styles/Text.styles';

import PhotoIcon from '~/assets/icons/PhotoIcon';
import BackgroundDefault from '~/assets/images/background-default.jpg';

export const loader = async ({ request, params }: LoaderArgs) => {
  const [, locale] = await Promise.all([
    authenticate(request, undefined, true),
    i18next.getLocale(request),
  ]);

  const { tvId, seasonId } = params;
  if (!tvId || !seasonId) throw new Error('Missing params');
  const tid = Number(tvId);
  const sid = Number(seasonId);

  // get translators

  const [seasonDetail, detail] = await Promise.all([
    getTvSeasonDetail(tid, sid, locale),
    getTvShowDetail(tid),
  ]);
  if (!seasonDetail) throw new Response('Not Found', { status: 404 });
  const title = detail?.name || '';
  const orgTitle = detail?.original_name || '';
  const year = new Date(seasonDetail?.air_date || '').getFullYear();
  const season = seasonDetail?.season_number;
  const extractColorImage = `https://corsproxy.io/?${encodeURIComponent(
    TMDB.backdropUrl(seasonDetail?.poster_path || '', 'w300'),
  )}`;
  const isEnded = detail?.status === 'Ended' || detail?.status === 'Canceled';

  const [providers, fimg] = await Promise.all([
    getProviderList({
      type: 'tv',
      title,
      orgTitle,
      year,
      season,
      animeId: undefined,
      animeType: undefined,
      isEnded,
    }),
    fetch(extractColorImage),
  ]);

  const fimgb = Buffer.from(await fimg.arrayBuffer());
  const palette = seasonDetail?.poster_path ? await Vibrant.from(fimgb).getPalette() : undefined;

  if (providers && providers.length > 0)
    return json(
      {
        detail,
        seasonDetail,
        providers,
        color: palette
          ? Object.values(palette).sort((a, b) =>
              a?.population === undefined || b?.population === undefined
                ? 0
                : b.population - a.population,
            )[0]?.hex
          : undefined,
      },
      { headers: { 'Cache-Control': CACHE_CONTROL.season } },
    );

  return json(
    {
      detail,
      seasonDetail,
      color: palette
        ? Object.values(palette).sort((a, b) =>
            a?.population === undefined || b?.population === undefined
              ? 0
              : b.population - a.population,
          )[0]?.hex
        : undefined,
      providers: [],
    },
    { headers: { 'Cache-Control': CACHE_CONTROL.season } },
  );
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Season',
      description: `This Tv show doesn't have season ${params.seasonId}`,
    };
  }
  const { detail, seasonDetail, color } = data;
  return {
    title: `Watch ${detail?.name || ''} ${seasonDetail?.name || ''} HD online Free - Sora`,
    description: `Watch ${detail?.name || ''} ${
      seasonDetail?.name || ''
    } in full HD online with Subtitle`,
    keywords: `Watch ${detail?.name || ''}, Stream ${detail?.name || ''}, Watch ${
      detail?.name || ''
    } HD, Online ${detail?.name || ''}, Streaming ${detail?.name || ''}, English, Subtitle ${
      detail?.name || ''
    }, English Subtitle`,
    ...(color ? { 'theme-color': color } : null),
    'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}`,
    'og:title': `Watch ${detail?.name || ''} ${seasonDetail?.name || ''} HD online Free - Sora`,
    'og:description': `Watch ${detail?.name || ''} ${
      seasonDetail?.name || ''
    } in full HD online with Subtitle`,
    'og:image': `https://sora-anime.vercel.app/api/ogimage?m=${params.tvId}&mt=tv`,
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <NavLink
        to={`/tv-shows/${match.params.tvId}`}
        aria-label={
          match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId
        }
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
            {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
          </Badge>
        )}
      </NavLink>
      <Spacer x={0.25} />
      <span> ❱ </span>
      <Spacer x={0.25} />
      <NavLink
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/`}
        aria-label={`Season ${match.params.seasonId}`}
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
            Season {match.params.seasonId}
          </Badge>
        )}
      </NavLink>
    </>
  ),
};

const detailTab = [
  { pageName: 'Episodes', pageLink: '/' },
  { pageName: 'Cast', pageLink: '/cast' },
  { pageName: 'Crew', pageLink: '/crew' },
  { pageName: 'Videos', pageLink: '/videos' },
  { pageName: 'Photos', pageLink: '/photos' },
];

const SeasonDetail = () => {
  const { seasonDetail } = useLoaderData<typeof loader>();
  const { tvId, seasonId } = useParams();
  const [size, ref] = useMeasure<HTMLDivElement>();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });

  return (
    <>
      <Card
        variant="flat"
        css={{
          display: 'flex',
          flexDirection: 'column',
          height: `calc(${JSON.stringify(size?.height)}px + 1rem)`,
          width: '100%',
          borderWidth: 0,
        }}
      >
        <Card.Header
          ref={ref}
          css={{
            position: 'absolute',
            zIndex: 1,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Row
            fluid
            align="stretch"
            justify="center"
            css={{
              padding: '20px',
              maxWidth: '1920px',
            }}
          >
            <Col span={4} css={{ display: 'none', '@xs': { display: 'flex' } }}>
              {seasonDetail?.poster_path ? (
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={TMDB.posterUrl(seasonDetail?.poster_path)}
                  alt={seasonDetail?.name}
                  title={seasonDetail?.name}
                  objectFit="cover"
                  width="50%"
                  showSkeleton
                  css={{
                    minWidth: 'auto !important',
                    borderRadius: '24px',
                  }}
                  loaderUrl="/api/image"
                  placeholder="empty"
                  responsive={[
                    {
                      size: {
                        width: 137,
                        height: 205,
                      },
                      maxWidth: 960,
                    },
                    {
                      size: {
                        width: 158,
                        height: 237,
                      },
                      maxWidth: 1280,
                    },
                    {
                      size: {
                        width: 173,
                        height: 260,
                      },
                      maxWidth: 1400,
                    },
                    {
                      size: {
                        width: 239,
                        height: 359,
                      },
                    },
                  ]}
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                />
              ) : (
                <Row align="center" justify="center">
                  <Avatar
                    icon={<PhotoIcon width={48} height={48} />}
                    css={{
                      width: '50% !important',
                      size: '$20',
                      minWidth: 'auto !important',
                      minHeight: '205px !important',
                      marginTop: '10vh',
                      borderRadius: '24px !important',
                    }}
                  />
                </Row>
              )}
            </Col>
            <Col
              css={{
                width: '100%',
                display: 'flex',
                flexFlow: 'column',
                justifyContent: 'flex-start',
                '@xs': { width: '66.6667%' },
              }}
            >
              {isSm &&
                (seasonDetail?.poster_path ? (
                  <>
                    <Row>
                      <Card.Image
                        // @ts-ignore
                        as={Image}
                        src={TMDB.posterUrl(seasonDetail?.poster_path)}
                        alt={seasonDetail?.name}
                        title={seasonDetail?.name}
                        objectFit="cover"
                        css={{
                          minWidth: 'auto !important',
                          marginTop: '2rem',
                          borderRadius: '24px',
                        }}
                        showSkeleton
                        loaderUrl="/api/image"
                        placeholder="empty"
                        options={{
                          contentType: MimeType.WEBP,
                        }}
                        responsive={[
                          {
                            size: {
                              width: 246,
                              height: 369,
                            },
                            maxWidth: 375,
                          },
                          {
                            size: {
                              width: 235,
                              height: 352,
                            },
                          },
                        ]}
                      />
                    </Row>
                    <Spacer y={1} />
                  </>
                ) : (
                  <>
                    <Row align="center" justify="center">
                      <Avatar
                        icon={<PhotoIcon width={48} height={48} />}
                        css={{
                          width: 'auto !important',
                          size: '$20',
                          minWidth: 'auto !important',
                          minHeight: '205px !important',
                          marginTop: '2rem',
                          borderRadius: '24px !important',
                        }}
                      />
                    </Row>
                    <Spacer y={1} />
                  </>
                ))}
              <Row>
                <H2 h2 weight="bold">
                  {seasonDetail?.name}
                </H2>
              </Row>
              <Row>
                <H5 h5 weight="bold">
                  {seasonDetail?.episodes?.length || 0} episodes &middot; {seasonDetail?.air_date}{' '}
                </H5>
              </Row>
              {seasonDetail?.overview && (
                <Row>
                  <H6 h6>{seasonDetail.overview}</H6>
                </Row>
              )}
              <Spacer y={1} />
              <TabLink pages={detailTab} linkTo={`/tv-shows/${tvId}/season/${seasonId}`} />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            // @ts-ignore
            as={Image}
            src={
              seasonDetail?.poster_path
                ? TMDB.posterUrl(seasonDetail?.poster_path, 'w342')
                : BackgroundDefault
            }
            showSkeleton
            css={{
              minHeight: '100vh !important',
              minWidth: '100% !important',
              width: '100%',
              height: '100vh',
              top: 0,
              left: 0,
              objectFit: 'cover',
              opacity: 0.3,
            }}
            title={seasonDetail?.name}
            alt={seasonDetail?.name}
            containerCss={{ margin: 0 }}
            loaderUrl="/api/image"
            placeholder="empty"
            responsive={[
              {
                size: {
                  width: 260,
                  height: 390,
                },
              },
            ]}
            options={{
              blurRadius: 15,
              contentType: MimeType.WEBP,
            }}
          />
        </Card.Body>
      </Card>
      <Container
        as="div"
        xl
        css={{
          margin: '0.75rem 0 0 0',
          padding: 0,
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => <ErrorBoundaryView error={error} />;

export default SeasonDetail;
