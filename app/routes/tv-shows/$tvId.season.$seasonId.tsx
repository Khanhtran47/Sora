/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-throw-literal */
import * as React from 'react';
import { LoaderFunction, json, MetaFunction } from '@remix-run/node';
import { useCatch, useLoaderData, Outlet, Link, RouteMatch, useParams } from '@remix-run/react';
import { Container, Spacer, Card, Col, Row, Avatar } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import useMediaQuery from '~/hooks/useMediaQuery';
import useSize, { IUseSize } from '~/hooks/useSize';
import { getTvSeasonDetail } from '~/services/tmdb/tmdb.server';
import i18next from '~/i18n/i18next.server';
import TMDB from '~/utils/media';
import { authenticate } from '~/services/supabase';

import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';
import Tab from '~/src/components/elements/Tab';
import { H2, H5, H6 } from '~/src/components/styles/Text.styles';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';
import BackgroundDefault from '~/src/assets/images/background-default.jpg';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvSeasonDetail>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const { tvId, seasonId } = params;
  const tid = Number(tvId);
  const sid = Number(seasonId);

  if (!tid || !sid) throw new Response('Not Found', { status: 404 });

  const detail = await getTvSeasonDetail(tid, sid, locale);

  if (!detail) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({ detail });
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Season',
      description: `This Tv show doesn't have season ${params.seasonId}`,
    };
  }
  const { detail } = data;
  return {
    title: `Watch ${detail.name} HD online Free - Sora`,
    description: `Watch ${detail.name} in full HD online with Subtitle`,
    keywords: `Watch ${detail.name}, Stream ${detail.name}, Watch ${detail.name} HD, Online ${detail.name}, Streaming ${detail.name}, English, Subtitle ${detail.name}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}`,
    'og:title': `Watch ${detail.name} HD online Free - Sora`,
    'og:description': `Watch ${detail.name} in full HD online with Subtitle`,
    'og:image': TMDB.posterUrl(detail?.poster_path || '', 'w185'),
  };
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link
        to={`/tv-shows/${match.params.tvId}`}
        aria-label={
          match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId
        }
      >
        {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
      </Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/`}
        aria-label={`Season ${match.params.seasonId}`}
      >
        Season {match.params.seasonId}
      </Link>
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
  const { detail } = useLoaderData<LoaderData>();
  const { tvId, seasonId } = useParams();
  const ref = React.useRef<HTMLDivElement>(null);
  const size: IUseSize = useSize(ref);
  const isXs = useMediaQuery('(max-width: 425px)');
  const isSm = useMediaQuery('(max-width: 650px)');

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
            {!isSm && (
              <Col span={4}>
                {detail?.poster_path ? (
                  <Card.Image
                    // @ts-ignore
                    as={Image}
                    src={TMDB.posterUrl(detail?.poster_path)}
                    alt={detail?.name}
                    title={detail?.name}
                    objectFit="cover"
                    width="50%"
                    css={{
                      minWidth: 'auto !important',
                      borderRadius: '24px',
                    }}
                    loaderUrl="/api/image"
                    placeholder="blur"
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
            )}
            <Col
              span={isSm ? 12 : 8}
              css={{
                display: 'flex',
                flexFlow: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {isSm &&
                (detail?.poster_path ? (
                  <>
                    <Row>
                      <Card.Image
                        // @ts-ignore
                        as={Image}
                        src={TMDB.posterUrl(detail?.poster_path)}
                        alt={detail?.name}
                        title={detail?.name}
                        objectFit="cover"
                        width={isXs ? '70%' : '40%'}
                        css={{
                          minWidth: 'auto !important',
                          marginTop: '2rem',
                          borderRadius: '24px',
                        }}
                        loaderUrl="/api/image"
                        placeholder="blur"
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
                          width: `${isXs ? '70%' : '40%'} !important`,
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
                  {detail?.name}
                </H2>
              </Row>
              <Row>
                <H5 h5 weight="bold">
                  {detail?.episodes?.length || 0} episodes &middot; {detail?.air_date}{' '}
                </H5>
              </Row>
              {detail?.overview && (
                <Row>
                  <H6 h6>{detail.overview}</H6>
                </Row>
              )}
              <Spacer y={1} />
              <Tab pages={detailTab} linkTo={`/tv-shows/${tvId}/season/${seasonId}`} />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            // @ts-ignore
            as={Image}
            src={
              detail?.poster_path ? TMDB.posterUrl(detail?.poster_path, 'w342') : BackgroundDefault
            }
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
            title={detail?.name}
            alt={detail?.name}
            containerCss={{ margin: 0 }}
            loaderUrl="/api/image"
            placeholder="blur"
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
          margin: 0,
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

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};

export default SeasonDetail;
