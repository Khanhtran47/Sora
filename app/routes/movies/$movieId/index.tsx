/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, Link } from '@remix-run/react';
import { Row, Col, Image as NextImage } from '@nextui-org/react';
import type { User } from '@supabase/supabase-js';
import { useRouteData } from 'remix-utils';
import Image, { MimeType } from 'remix-image';

import useMediaQuery from '~/hooks/useMediaQuery';
import { authenticate } from '~/services/supabase';
import { getSimilar, getVideos, getCredits, getRecommendation } from '~/services/tmdb/tmdb.server';
import { IMovieDetail, ILanguage } from '~/services/tmdb/tmdb.types';
import { postFetchDataHandler } from '~/services/tmdb/utils.server';
import { CACHE_CONTROL } from '~/utils/server/http';

import TMDB from '~/utils/media';

import MediaList from '~/components/media/MediaList';
import { H6 } from '~/components/styles/Text.styles';
import Flex from '~/components/styles/Flex.styles';

export const loader = async ({ request, params }: LoaderArgs) => {
  await authenticate(request);

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

const MovieOverview = () => {
  const { similar, recommendations, topBilledCast, directors } = useLoaderData<typeof loader>();
  const movieData: { detail: IMovieDetail } | undefined = useRouteData('routes/movies/$movieId');
  const rootData:
    | {
        user?: User;
        locale: string;
        languages: ILanguage[];
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const detail = movieData && movieData.detail;
  const navigate = useNavigate();

  const isSm = useMediaQuery('(max-width: 650px)');
  const onClickViewMore = (type: 'cast' | 'similar' | 'recommendations') => {
    navigate(`/movies/${detail?.id}/${type}`);
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
              <strong>Production Companies</strong>
              <br />
              {detail?.production_companies &&
                detail.production_companies.map((company) => (
                  <NextImage
                    // @ts-ignore
                    as={Image}
                    key={`network-item-${company.id}`}
                    src={TMDB.logoUrl(company?.logo_path || '', 'w154')}
                    alt="Production Companies Image"
                    title={company?.name}
                    objectFit="cover"
                    showSkeleton
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
              <strong>Original Language</strong>
              <br />
              {rootData?.languages?.find((lang) => lang.iso_639_1 === detail?.original_language)
                ?.english_name || detail?.original_language}
            </H6>
            <H6 h6>
              <strong>Budget</strong>
              <br />${detail?.budget?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </H6>
            <H6 h6>
              <strong>Revenue</strong>
              <br />${detail?.revenue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
            {directors && directors.length > 0 && (
              <H6 h6>
                <strong>Director</strong>
                <br />
                <Flex direction="column">
                  {directors.map((director) => (
                    <Link
                      key={`director-item-${director.id}`}
                      to={`/people/${director.id}/overview`}
                      style={{ lineHeight: '1.75rem' }}
                      className="text-[var(--nextui-color-text)] hover:text-primary"
                    >
                      {director.name}
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
        {recommendations && recommendations.items && recommendations.items.length > 0 && (
          <MediaList
            listType="slider-card"
            items={recommendations.items}
            listName="Recommendations"
            showMoreList
            onClickViewMore={() => onClickViewMore('recommendations')}
            itemsType="movie"
            navigationButtons
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
        )}

        {similar && similar.items && similar.items.length > 0 && (
          <MediaList
            listType="slider-card"
            items={similar.items}
            listName="Similar Movies"
            showMoreList
            onClickViewMore={() => onClickViewMore('similar')}
            itemsType="movie"
            navigationButtons
            genresMovie={rootData?.genresMovie}
            genresTv={rootData?.genresTv}
          />
        )}
      </Col>
    </Row>
  );
};

export default MovieOverview;
