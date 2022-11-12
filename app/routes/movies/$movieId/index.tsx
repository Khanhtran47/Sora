/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Row, Col, Spacer, Divider } from '@nextui-org/react';
import type { User } from '@supabase/supabase-js';
import { useRouteData } from 'remix-utils';
import { getSimilar, getVideos, getCredits, getRecommendation } from '~/services/tmdb/tmdb.server';
import { IMovieDetail, IPeople } from '~/services/tmdb/tmdb.types';
import MediaList from '~/src/components/media/MediaList';
import PeopleList from '~/src/components/people/PeopleList';
import { H6 } from '~/src/components/styles/Text.styles';
import useMediaQuery from '~/hooks/useMediaQuery';
import { authenticate } from '~/services/supabase';

type LoaderData = {
  videos: Awaited<ReturnType<typeof getVideos>>;
  similar: Awaited<ReturnType<typeof getSimilar>>;
  recommendations: Awaited<ReturnType<typeof getRecommendation>>;
  topBilledCast: IPeople[];
  directors: IPeople[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
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

  return json<LoaderData>({
    videos,
    similar,
    recommendations,
    topBilledCast: credits && credits.cast && credits.cast.slice(0, 9),
    directors: credits && credits.crew && credits.crew.filter(({ job }) => job === 'Director'),
  });
};

const Overview = () => {
  const {
    similar,
    // videos,
    recommendations,
    topBilledCast,
    directors,
  } = useLoaderData<LoaderData>();
  const movieData: { detail: IMovieDetail } | undefined = useRouteData('routes/movies/$movieId');
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const detail = movieData && movieData.detail;
  const navigate = useNavigate();

  // const isXs = useMediaQuery(425, 'max');
  const isSm = useMediaQuery(650, 'max');
  // const isMd = useMediaQuery(960, 'max');
  // const isMdLand = useMediaQuery(960, 'max', 'landscape');
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
              <strong>Original Language</strong>
              <br />
              {detail?.original_language}
            </H6>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <H6 h6 css={{ width: '50%' }}>
              <strong>Budget</strong>
              <br />${detail?.budget}
            </H6>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <H6 h6 css={{ width: '50%' }}>
              <strong>Revenue</strong>
              <br />${detail?.revenue}
            </H6>
          </Row>
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
          {directors && directors.length > 0 && (
            <>
              <H6 h6>
                <strong>Director</strong>
                <br />
                {directors.map((director, index) => (
                  <p key={`director-item-${index}`}>{director.name}</p>
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
            <PeopleList
              listType="slider-card"
              items={topBilledCast}
              listName="Top Billed Cast"
              showMoreList
              onClickViewMore={() => onClickViewMore('cast')}
              navigationButtons
            />
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
              cardType="similar-movie"
              navigationButtons
              genresMovie={rootData?.genresMovie}
              genresTv={rootData?.genresTv}
            />
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        )}

        {similar && similar.items && similar.items.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={similar.items}
              listName="Similar Movies"
              showMoreList
              onClickViewMore={() => onClickViewMore('similar')}
              cardType="similar-movie"
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
