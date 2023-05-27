import { Card, CardBody } from '@nextui-org/card';
import { Avatar } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { json, type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigate, useParams, type RouteMatch } from '@remix-run/react';
import { MimeType } from 'remix-image';

import { authenticate } from '~/services/supabase';
import { getCredits, getRecommendation, getSimilar } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import TMDB from '~/utils/media';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';
import Image from '~/components/elements/Image';
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
export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <BreadcrumbItem
      to={`/tv-shows/${match.params.tvId}/`}
      key={`tv-shows-${match.params.tvId}-overview`}
    >
      Overview
    </BreadcrumbItem>
  ),
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
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-x-0 gap-y-4 px-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-x-4 sm:gap-y-0 sm:px-3.5 xl:px-4 2xl:px-5">
      <div className="flex w-full grow-0 flex-col sm:w-1/3 sm:items-center sm:justify-start">
        <div className="flex w-full flex-col items-start justify-center gap-y-4 rounded-xl bg-neutral p-4 nextui-sm:w-3/4 xl:w-1/2">
          <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Status</h6>
            <p className="grow">{detail?.status}</p>
          </div>
          <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Network</h6>
            <div className="flex grow flex-col">
              {detail?.networks &&
                detail.networks.map((network, index) => (
                  <p key={`network-item-${index}`}>{network?.name}</p>
                ))}
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Type</h6>
            <p className="grow">{detail?.type}</p>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Original Language</h6>
            <p className="grow">
              {rootData?.languages?.find((lang) => lang.iso_639_1 === detail?.original_language)
                ?.english_name || detail?.original_language}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col sm:w-2/3">
        <div className="flex flex-col items-start justify-start gap-y-4 rounded-xl bg-neutral p-4">
          <h6 className="text-justify">{detail?.overview}</h6>
          <div className="flex flex-col flex-wrap gap-x-0 gap-y-4 sm:flex-row sm:gap-x-8">
            {detail?.created_by && detail?.created_by.length > 0 ? (
              <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:w-fit sm:flex-col">
                <h6 className="grow-0 basis-1/3 sm:basis-auto">Creators</h6>
                <div className="flex grow flex-col">
                  {detail.created_by.map((creator) => (
                    <Link
                      key={`director-item-${creator.id}}`}
                      to={`/people/${creator.id}/`}
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
              <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:w-fit sm:flex-col">
                <h6 className="grow-0 basis-1/3 sm:basis-auto">Production Countries</h6>
                <div className="flex grow flex-col">
                  {detail?.production_countries.map((country, index) => (
                    <p key={`country-item-${index}`}>{country.name}</p>
                  ))}
                </div>
              </div>
            ) : null}
            {detail?.spoken_languages && detail.spoken_languages.length > 0 ? (
              <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:w-fit sm:flex-col">
                <h6 className="grow-0 basis-1/3 sm:basis-auto">Spoken Languages</h6>
                <div className="flex grow flex-col">
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
            items={topBilledCast}
            itemsType="people"
            key={`tv-top-cast-${tvId}`}
            listName="Top Cast"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => onClickViewMore('cast')}
            showMoreList
          />
        ) : null}
        {detail?.seasons && detail?.seasons.length > 0 ? (
          <>
            <h2 style={{ margin: '20px 0 5px 0' }}>Seasons</h2>
            <div className="flex w-full flex-col gap-4">
              {detail.seasons
                .filter((season) => !season.name?.includes('Specials'))
                .map((season) => (
                  <Card
                    as={Link}
                    key={season.id}
                    to={`/tv-shows/${detail.id}/season/${season.season_number}/`}
                    isHoverable
                    isPressable
                    className="!max-h-[195px] hover:shadow-[0_0_0_1px] hover:shadow-primary-200"
                    role="figure"
                  >
                    <CardBody className="flex flex-row flex-nowrap justify-start overflow-hidden p-0">
                      <div className="w-[130px]">
                        {season.poster_path ? (
                          <Image
                            src={TMDB.posterUrl(season?.poster_path, 'w154')}
                            width="130px"
                            height="100%"
                            className="m-0 aspect-[2/3] min-h-[195px] min-w-[130px] overflow-hidden"
                            alt={season.name}
                            title={season.name}
                            loaderUrl="/api/image"
                            placeholder="empty"
                            options={{
                              contentType: MimeType.WEBP,
                            }}
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
                      </div>
                      <div className="flex flex-col justify-start p-5">
                        <h4>{season.name}</h4>
                        <h5>
                          {season.air_date} | {season.episode_count} episodes
                        </h5>
                        {!isSm ? <h6 className="!line-clamp-3">{season.overview}</h6> : null}
                      </div>
                    </CardBody>
                  </Card>
                ))}
            </div>
          </>
        ) : null}
        {recommendations && recommendations.items && recommendations.items.length > 0 ? (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={recommendations.items}
            itemsType="tv"
            key={`tv-recommendations-${tvId}`}
            listName="Recommendations"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => onClickViewMore('recommendations')}
            showMoreList
          />
        ) : null}
        {similar.items && similar.items.length > 0 ? (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={similar.items}
            itemsType="tv"
            key={`tv-similar-${tvId}`}
            listName="Similar Tv-Shows"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => onClickViewMore('similar')}
            showMoreList
          />
        ) : null}
      </div>
    </div>
  );
};

export default TvOverview;
