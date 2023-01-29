/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, Link } from '@remix-run/react';
import { Row, Col, Spacer, Image as NextImage, Card, Avatar } from '@nextui-org/react';
import type { User } from '@supabase/supabase-js';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';

import { authenticate } from '~/services/supabase';
import { getSimilar, getCredits, getRecommendation } from '~/services/tmdb/tmdb.server';
import { ITvShowDetail, ILanguage } from '~/services/tmdb/tmdb.types';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import TMDB from '~/utils/media';
import useMediaQuery from '~/hooks/useMediaQuery';

import { H3, H4, H5, H6 } from '~/components/styles/Text.styles';
import Flex from '~/components/styles/Flex.styles';
import MediaList from '~/components/media/MediaList';

import PhotoIcon from '~/assets/icons/PhotoIcon';

export const loader = async ({ request, params }: LoaderArgs) => {
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

  return json(
    {
      similar,
      recommendations,
      topBilledCast: credits &&
        credits.cast && [...postFetchDataHandler(credits.cast.slice(0, 9), 'people')],
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.detail,
      },
    },
  );
};

const TvOverview = () => {
  const { similar, recommendations, topBilledCast } = useLoaderData<typeof loader>();
  const tvData: { detail: ITvShowDetail } | undefined = useRouteData('routes/tv-shows/$tvId');
  const rootData:
    | {
        user?: User;
        locale: string;
        languages: ILanguage[];
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
        maxWidth: '1920px',
        px: '1.5rem',
        '@xs': {
          px: 'calc(0.75rem + 3vw)',
        },
        '@sm': {
          px: 'calc(0.75rem + 6vw)',
        },
        '@md': {
          px: 'calc(0.75rem + 12vw)',
        },
        '@lg': {
          px: 'calc(0.75rem + 20px)',
        },
      }}
    >
      {!isSm && (
        <Col span={4} css={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Flex
            direction="column"
            align="start"
            justify="center"
            className="space-y-4"
            css={{
              borderRadius: '$lg',
              backgroundColor: '$backgroundContrast',
              width: '50%',
              padding: '$md',
              '@smMax': {
                width: '100%',
              },
              '@mdMax': {
                width: '75%',
              },
            }}
          >
            <H6 h6>
              <strong>Status</strong>
              <br />
              {detail?.status}
            </H6>
            <H6 h6>
              <strong>Network</strong>
              <br />
              {detail?.networks &&
                detail.networks.map((network, index) => (
                  <NextImage
                    // @ts-ignore
                    as={Image}
                    key={`network-item-${index}`}
                    src={TMDB.logoUrl(network?.logo_path || '', 'w154')}
                    alt="Network Image"
                    title={network?.name}
                    showSkeleton
                    objectFit="cover"
                    containerCss={{ padding: '$sm' }}
                    loaderUrl="/api/image"
                    placeholder="empty"
                    option={{
                      contentType: MimeType.WEBP,
                    }}
                  />
                ))}
            </H6>
            <H6 h6>
              <strong>Type</strong>
              <br />
              {detail?.type}
            </H6>
            <H6 h6>
              <strong>Original Language</strong>
              <br />
              {rootData?.languages?.find((lang) => lang.iso_639_1 === detail?.original_language)
                ?.english_name || detail?.original_language}
            </H6>
          </Flex>
        </Col>
      )}
      <Col span={isSm ? 12 : 8}>
        <Flex
          direction="column"
          align="start"
          justify="center"
          className="space-y-4"
          css={{
            borderRadius: '$lg',
            backgroundColor: '$backgroundContrast',
            justifyContent: 'flex-start',
            padding: '$md',
          }}
        >
          <Row>
            <H6 h6 css={{ textAlign: 'justify' }}>
              {detail?.overview}
            </H6>
          </Row>
          <Flex
            direction={isSm ? 'column' : 'row'}
            wrap="wrap"
            className={`${isSm ? 'space-y-4' : 'space-x-8'}`}
          >
            {detail?.created_by && detail?.created_by.length > 0 && (
              <H6 h6>
                <strong>Creators</strong>
                <br />
                <Flex direction="column">
                  {detail.created_by.map((creator) => (
                    <Link
                      key={`director-item-${creator.id}}`}
                      to={`/people/${creator.id}/overview`}
                      style={{ lineHeight: '1.75rem' }}
                      className="text-[var(--nextui-color-text)] hover:text-primary"
                    >
                      {creator.name}
                    </Link>
                  ))}
                </Flex>
              </H6>
            )}
            {detail?.production_countries && detail.production_countries.length > 0 && (
              <H6 h6>
                <strong>Production Countries</strong>
                <br />
                {detail?.production_countries.map((country, index) => (
                  <p key={`country-item-${index}`}>{country.name}</p>
                ))}
              </H6>
            )}
            {detail?.spoken_languages && detail.spoken_languages.length > 0 && (
              <H6 h6>
                <strong>Spoken Languages</strong>
                <br />
                {detail?.spoken_languages.map((language, index) => (
                  <p key={`language-item-${index}`}>{language.english_name}</p>
                ))}
              </H6>
            )}
          </Flex>
        </Flex>
        {topBilledCast && topBilledCast.length > 0 && (
          <MediaList
            listType="slider-card"
            items={topBilledCast}
            listName="Top Cast"
            showMoreList
            onClickViewMore={() => onClickViewMore('cast')}
            navigationButtons
            itemsType="people"
          />
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
          </>
        )}
        {recommendations && recommendations.items && recommendations.items.length > 0 && (
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
        )}
        {similar.items && similar.items.length > 0 && (
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
        )}
      </Col>
    </Row>
  );
};

export default TvOverview;
