/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useNavigate, Link } from '@remix-run/react';
import { Row, Col, Spacer, Divider, Image as NextImage, Card, Avatar } from '@nextui-org/react';
import type { User } from '@supabase/supabase-js';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';
import { authenticate } from '~/services/supabase';
import { getSimilar, getCredits, getRecommendation } from '~/services/tmdb/tmdb.server';
import { ITvShowDetail } from '~/services/tmdb/tmdb.types';
import MediaList from '~/src/components/media/MediaList';
import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { IMedia } from '~/types/media';

import { H3, H4, H5, H6 } from '~/src/components/styles/Text.styles';
import Flex from '~/src/components/styles/Flex.styles';

type LoaderData = {
  similar: Awaited<ReturnType<typeof getSimilar>>;
  recommendations: Awaited<ReturnType<typeof getRecommendation>>;
  topBilledCast: IMedia[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticate(request);

  const { tvId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not Found', { status: 404 });

  const [similar, credits, recommendations] = await Promise.all([
    getSimilar('tv', tid),
    getCredits('tv', tid),
    getRecommendation('tv', tid),
  ]);

  if (!similar || !credits || !recommendations) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    similar,
    recommendations,
    topBilledCast: credits &&
      credits.cast && [...postFetchDataHandler(credits.cast.slice(0, 9), 'people')],
  });
};

const Overview = () => {
  const { similar, recommendations, topBilledCast } = useLoaderData<LoaderData>();
  const tvData: { detail: ITvShowDetail } | undefined = useRouteData('routes/tv-shows/$tvId');
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const detail = tvData && tvData.detail;
  const navigate = useNavigate();

  const isSm = useMediaQuery('(max-width: 650px)');
  const onClickViewMore = (type: 'cast' | 'similar' | 'recommendations') => {
    navigate(`/tv-shows/${detail?.id}/${type}`);
  };
  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: '20px',
        maxWidth: '1920px',
      }}
    >
      {!isSm && (
        <Col span={4}>
          <Row justify="center" fluid>
            <H6 h6 css={{ width: '50%' }}>
              <strong>Status</strong>
              <br />
              {detail?.status}
            </H6>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <H6 h6 css={{ width: '50%' }}>
              <strong>Network</strong>
              <br />
              {detail?.networks &&
                detail.networks.map((network, index) => (
                  <NextImage
                    key={`network-item-${index}`}
                    src={TMDB.logoUrl(network?.logo_path || '', 'w154')}
                    alt="Network Image"
                    objectFit="cover"
                    containerCss={{
                      padding: '$sm',
                      backgroundColor: 'var(--nextui-colors-accents5)',
                    }}
                  />
                ))}
            </H6>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <H6 h6 css={{ width: '50%' }}>
              <strong>Type</strong>
              <br />
              {detail?.type}
            </H6>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <H6 h6 css={{ width: '50%' }}>
              <strong>Original Language</strong>
              <br />
              {detail?.original_language}
            </H6>
          </Row>
          <Spacer y={1} />
        </Col>
      )}
      <Col span={isSm ? 12 : 8}>
        <Row>
          <H6 h6 css={{ textAlign: 'justify' }}>
            {detail?.overview}
          </H6>
        </Row>
        <Spacer y={1} />
        <Row wrap="wrap">
          {detail?.created_by && detail?.created_by.length > 0 && (
            <>
              <H6 h6>
                <strong>Creators</strong>
                <br />
                {detail.created_by.map((creator) => (
                  <p key={`director-item-${creator.id}}`}>{creator.name}</p>
                ))}
              </H6>
              <Spacer x={2} />
            </>
          )}
          {detail?.production_countries && detail.production_countries.length > 0 && (
            <>
              <H6 h6>
                <strong>Production Countries</strong>
                <br />
                {detail?.production_countries.map((country, index) => (
                  <p key={`country-item-${index}`}>{country.name}</p>
                ))}
              </H6>
              <Spacer x={2} />
            </>
          )}
          {detail?.spoken_languages && detail.spoken_languages.length > 0 && (
            <>
              <H6 h6>
                <strong>Spoken Languages</strong>
                <br />
                {detail?.spoken_languages.map((language, index) => (
                  <p key={`language-item-${index}`}>{language.english_name}</p>
                ))}
              </H6>
              <Spacer x={2} />
            </>
          )}
        </Row>
        <Spacer y={1} />
        <Divider x={1} css={{ m: 0 }} />
        <Spacer y={1} />
        {topBilledCast && topBilledCast.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={topBilledCast}
              listName="Top Cast"
              showMoreList
              onClickViewMore={() => onClickViewMore('cast')}
              navigationButtons
              itemsType="people"
            />
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        )}
        {detail?.seasons && detail?.seasons.length > 0 && (
          <>
            <H3 h3 css={{ margin: '20px 0 20px 0' }}>
              Seasons
            </H3>
            {detail.seasons
              .filter((season) => !season.name?.includes('Specials'))
              .map((season) => (
                <Link key={season.id} to={`/tv-shows/${detail.id}/season/${season.season_number}/`}>
                  <Card
                    as="div"
                    isHoverable
                    isPressable
                    css={{
                      maxHeight: '195px !important',
                      borderWidth: 0,
                      filter: 'var(--nextui-dropShadows-md)',
                    }}
                    role="figure"
                  >
                    <Card.Body
                      css={{
                        p: 0,
                        flexFlow: 'row nowrap',
                        justifyContent: 'flex-start',
                      }}
                    >
                      {season.poster_path ? (
                        <Card.Image
                          // @ts-ignore
                          as={Image}
                          src={TMDB.posterUrl(season?.poster_path, 'w154')}
                          objectFit="cover"
                          width="130px"
                          height="100%"
                          showSkeleton
                          alt={season.name}
                          title={season.name}
                          css={{
                            minWidth: '130px !important',
                            minHeight: '195px !important',
                          }}
                          loaderUrl="/api/image"
                          placeholder="empty"
                          options={{
                            contentType: MimeType.WEBP,
                          }}
                          containerCss={{ margin: 0, minWidth: '130px', borderRadius: '$lg' }}
                          responsive={[
                            {
                              size: {
                                width: 130,
                                height: 195,
                              },
                            },
                          ]}
                        />
                      ) : (
                        <Avatar
                          icon={<PhotoIcon width={48} height={48} />}
                          pointer
                          squared
                          css={{
                            minWidth: '130px !important',
                            minHeight: '195px !important',
                            size: '$20',
                            borderRadius: '0 !important',
                          }}
                        />
                      )}
                      <Flex direction="column" justify="start" css={{ p: '1.25rem' }}>
                        <H4 h4>{season.name}</H4>
                        <H5 h5>
                          {season.air_date} | {season.episode_count} episodes
                        </H5>
                        {!isSm && (
                          <H6 h6 className="!line-clamp-3">
                            {season.overview}
                          </H6>
                        )}
                      </Flex>
                    </Card.Body>
                  </Card>
                  <Spacer y={1} />
                </Link>
              ))}
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        )}
        {recommendations && recommendations.items && recommendations.items.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={recommendations.items}
              listName="Recommendations"
              showMoreList
              onClickViewMore={() => onClickViewMore('recommendations')}
              itemsType="tv"
              navigationButtons
              genresMovie={rootData?.genresMovie}
              genresTv={rootData?.genresTv}
            />
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        )}
        {similar.items && similar.items.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={similar.items}
              listName="Similar Tv-Shows"
              showMoreList
              onClickViewMore={() => onClickViewMore('similar')}
              itemsType="tv"
              navigationButtons
              genresMovie={rootData?.genresMovie}
              genresTv={rootData?.genresTv}
            />
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        )}
      </Col>
    </Row>
  );
};

export default Overview;
