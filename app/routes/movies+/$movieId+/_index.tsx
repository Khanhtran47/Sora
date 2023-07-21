import { json, type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigate, useParams } from '@remix-run/react';
import { mergeMeta } from '~/utils';

import type { Handle } from '~/types/handle';
import type { loader as movieIdLoader } from '~/routes/movies+/$movieId';
import { authenticate } from '~/services/supabase';
import { getCredits, getRecommendation, getSimilar, getVideos } from '~/services/tmdb/tmdb.server';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { CACHE_CONTROL } from '~/utils/server/http';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import MediaList from '~/components/media/MediaList';
import { BreadcrumbItem } from '~/components/elements/Breadcrumb';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request, undefined, true);

  const { movieId } = params;
  const mid = Number(movieId);

  if (!mid) throw new Response('Not Found', { status: 404 });

  const [similar, videos, credits, recommendations] = await Promise.all([
    getSimilar('movie', mid),
    getVideos('movie', mid),
    getCredits('movie', mid),
    getRecommendation('movie', mid),
  ]);

  if (!similar || !videos || !credits || !recommendations)
    throw new Response('Not Found', { status: 404 });

  return json(
    {
      videos,
      similar,
      recommendations,
      topBilledCast: credits &&
        credits.cast && [...postFetchDataHandler(credits.cast.slice(0, 9), 'people')],
      directors: credits && credits.crew && credits.crew.filter(({ job }) => job === 'Director'),
    },
    {
      headers: {
        'Cache-Control': CACHE_CONTROL.detail,
      },
    },
  );
};

export const meta = mergeMeta<typeof loader, { 'routes/movies+/$movieId': typeof movieIdLoader }>(
  ({ matches, params }) => {
    const movieData = matches.find((match) => match.id === 'routes/movies+/$movieId')?.data;
    if (!movieData) {
      return [
        { title: 'Missing Movie' },
        { name: 'description', content: `There is no movie with ID: ${params.movieId}` },
      ];
    }
    const { detail } = movieData;
    const { title } = detail || {};
    return [
      { title: `Sora - ${title}` },
      { property: 'og:title', content: `Sora - ${title}` },
      { property: 'og:url', content: `https://sorachill.vercel.app/movies/${params.movieId}/` },
      { property: 'twitter:title', content: `Sora - ${title}` },
    ];
  },
);

export const handle: Handle = {
  breadcrumb: ({ match }) => (
    <BreadcrumbItem
      to={`/movies/${match.params.movieId}/`}
      key={`movies-${match.params.movieId}-overview`}
    >
      Overview
    </BreadcrumbItem>
  ),
};

const MovieOverview = () => {
  const { similar, recommendations, topBilledCast, directors } = useLoaderData<typeof loader>();
  const movieData = useTypedRouteLoaderData('routes/movies+/$movieId');
  const rootData = useTypedRouteLoaderData('root');
  const detail = movieData && movieData.detail;
  const navigate = useNavigate();
  const { movieId } = useParams();
  const onClickViewMore = (type: 'cast' | 'similar' | 'recommendations') => {
    navigate(`/movies/${detail?.id}/${type}`);
  };
  return (
    <div className="mt-3 flex w-full max-w-[1920px] flex-col gap-x-0 gap-y-4 px-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-x-4 sm:gap-y-0 sm:px-3.5 xl:px-4 2xl:px-5">
      <div className="flex w-full grow-0 flex-col sm:w-1/3 sm:items-center sm:justify-start">
        <div className="flex w-full flex-col items-start justify-center gap-y-4 rounded-xl bg-content1 p-4 nextui-sm:w-3/4 xl:w-1/2">
          <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Original Title</h6>
            <p className="grow">{detail?.original_title}</p>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Status</h6>
            <p className="grow">{detail?.status}</p>
          </div>
          <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Production Companies</h6>
            <div className="flex grow flex-col">
              {detail?.production_companies &&
                detail.production_companies.map((company) => (
                  <p key={`network-item-${company.id}`}>{company?.name}</p>
                ))}
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Original Language</h6>
            <p className="grow">
              {rootData?.languages?.find((lang) => lang.iso_639_1 === detail?.original_language)
                ?.english_name || detail?.original_language}
            </p>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Budget</h6>
            <p className="grow">
              {detail?.budget
                ? `$${detail?.budget?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : '-'}
            </p>
          </div>
          <div className=" flex w-full flex-row items-center justify-start gap-x-4 sm:flex-col sm:items-start sm:justify-center">
            <h6 className="grow-0 basis-1/3">Revenue</h6>
            <p className="grow">
              {detail?.revenue
                ? `$${detail?.revenue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : '-'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col sm:w-2/3">
        <div className="flex flex-col items-start justify-start gap-y-4 rounded-xl bg-content1 p-4">
          <p className="text-justify">{detail?.overview}</p>
          <div className="flex flex-col flex-wrap gap-x-0 gap-y-4 sm:flex-row sm:gap-x-8">
            {directors && directors.length > 0 ? (
              <div className="flex w-full flex-row items-start justify-start gap-x-4 sm:w-fit sm:flex-col">
                <h6 className="grow-0 basis-1/3 sm:basis-auto">Director</h6>
                <div className="flex grow flex-col">
                  {directors.map((director) => (
                    <Link
                      key={`director-item-${director.id}`}
                      to={`/people/${director.id}/`}
                      style={{ lineHeight: '1.75rem' }}
                      className="text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {director.name}
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
            key={`movie-top-cast-${movieId}`}
            listName="Top Cast"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => onClickViewMore('cast')}
            showMoreList
          />
        ) : null}
        {recommendations && recommendations.items && recommendations.items.length > 0 ? (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={recommendations.items}
            itemsType="movie"
            key={`movie-recommendations-${movieId}`}
            listName="Recommendations"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() => onClickViewMore('recommendations')}
            showMoreList
          />
        ) : null}
        {similar && similar.items && similar.items.length > 0 ? (
          <MediaList
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
            items={similar.items}
            itemsType="movie"
            key={`movie-similar-${movieId}`}
            listName="Similar Movies"
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

export default MovieOverview;
