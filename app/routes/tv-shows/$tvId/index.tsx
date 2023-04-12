import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, Link, useParams } from '@remix-run/react';
import { Spacer, Card, Avatar } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import { authenticate } from '~/services/supabase';
import { getSimilar, getCredits, getRecommendation } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';

import { CACHE_CONTROL } from '~/utils/server/http';
import TMDB from '~/utils/media';

import { useMediaQuery } from '@react-hookz/web';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';

import { H2, H4, H5, H6, P } from '~/components/styles/Text.styles';
import MediaList from '~/components/media/MediaList';

import PhotoIcon from '~/assets/icons/PhotoIcon';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

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
  const tvData = useTypedRouteLoaderData('routes/tv-shows/$tvId');
  const rootData = useTypedRouteLoaderData('root');
  const detail = tvData && tvData.detail;
  const navigate = useNavigate();
  const { tvId } = useParams();

  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const onClickViewMore = (type: 'cast' | 'similar' | 'recommendations') => {
    navigate(`/tv-shows/${detail?.id}/${type}`);
  };
  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-center sm:items-stretch mt-3 max-w-[1920px] px-3 sm:px-3.5 xl:px-4 2xl:px-5 gap-x-0 sm:gap-x-4 gap-y-4 sm:gap-y-0">
      <div className="flex flex-col sm:items-center sm:justify-start w-full sm:w-1/3 flex-grow-0">
        <div className="flex flex-col items-start justify-center gap-y-4 rounded-xl bg-background-contrast w-full nextui-sm:w-3/4 xl:w-1/2 p-4">
          <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
              Status
            </H6>
            <P as="p" className="flex-grow">
              {detail?.status}
            </P>
          </div>
          <div className="w-full flex flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
              Network
            </H6>
            <div className="flex flex-col flex-grow">
              {detail?.networks &&
                detail.networks.map((network, index) => (
                  <P as="p" key={`network-item-${index}`}>
                    {network?.name}
                  </P>
                ))}
            </div>
          </div>
          <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
              Type
            </H6>
            <P as="p" className="flex-grow">
              {detail?.type}
            </P>
          </div>
          <div className="w-full flex flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <H6 h6 weight="bold" className="basis-1/3 flex-grow-0">
              Original Language
            </H6>
            <P as="p" className="flex-grow">
              {rootData?.languages?.find((lang) => lang.iso_639_1 === detail?.original_language)
                ?.english_name || detail?.original_language}
            </P>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full sm:w-2/3">
        <div className="flex flex-col justify-start items-start gap-y-4 rounded-xl bg-background-contrast p-4">
          <H6 h6 css={{ textAlign: 'justify' }}>
            {detail?.overview}
          </H6>
          <div className="flex flex-col flex-wrap gap-x-0 gap-y-4 sm:flex-row sm:gap-x-8">
            {detail?.created_by && detail?.created_by.length > 0 ? (
              <div className="w-full sm:w-fit flex flex-row justify-start gap-x-4 sm:flex-col items-start">
                <H6 h6 weight="bold" className="basis-1/3 sm:basis-auto flex-grow-0">
                  Creators
                </H6>
                <div className="flex flex-col flex-grow">
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
                </div>
              </div>
            ) : null}
            {detail?.production_countries && detail.production_countries.length > 0 ? (
              <div className="w-full sm:w-fit flex flex-row justify-start gap-x-4 sm:flex-col items-start">
                <H6 h6 weight="bold" className="basis-1/3 sm:basis-auto flex-grow-0">
                  Production Countries
                </H6>
                <div className="flex flex-col flex-grow">
                  {detail?.production_countries.map((country, index) => (
                    <p key={`country-item-${index}`}>{country.name}</p>
                  ))}
                </div>
              </div>
            ) : null}
            {detail?.spoken_languages && detail.spoken_languages.length > 0 ? (
              <div className="w-full sm:w-fit flex flex-row justify-start gap-x-4 sm:flex-col items-start">
                <H6 h6 weight="bold" className="basis-1/3 sm:basis-auto flex-grow-0">
                  Spoken Languages
                </H6>
                <div className="flex flex-col flex-grow">
                  {detail?.spoken_languages.map((language, index) => (
                    <p key={`language-item-${index}`}>{language.english_name}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {topBilledCast && topBilledCast.length > 0 ? (
          <MediaList
            key={`tv-top-cast-${tvId}`}
            listType="slider-card"
            items={topBilledCast}
            listName="Top Cast"
            showMoreList
            onClickViewMore={() => onClickViewMore('cast')}
            navigationButtons
            itemsType="people"
          />
        ) : null}
        {detail?.seasons && detail?.seasons.length > 0 ? (
          <>
            <H2
              h2
              css={{
                margin: '20px 0 5px 0',
                '@xsMax': {
                  fontSize: '1.75rem !important',
                },
              }}
            >
              Seasons
            </H2>
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
                      filter: 'unset',
                      '&:hover': {
                        boxShadow: '0 0 0 1px var(--nextui-colors-primarySolidHover)',
                        filter:
                          'drop-shadow(0 4px 12px rgb(104 112 118 / 0.15)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.1))',
                      },
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
                      <div className="flex flex-col justify-start p-5">
                        <H4 h4>{season.name}</H4>
                        <H5 h5>
                          {season.air_date} | {season.episode_count} episodes
                        </H5>
                        {!isSm && (
                          <H6 h6 className="!line-clamp-3">
                            {season.overview}
                          </H6>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                  <Spacer y={1} />
                </Link>
              ))}
          </>
        ) : null}
        {recommendations && recommendations.items && recommendations.items.length > 0 ? (
          <MediaList
            key={`tv-recommendations-${tvId}`}
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
        ) : null}
        {similar.items && similar.items.length > 0 ? (
          <MediaList
            key={`tv-similar-${tvId}`}
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
        ) : null}
      </div>
    </div>
  );
};

export default TvOverview;
