/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Text, Row, Col, Spacer, Divider } from '@nextui-org/react';
import { getMovieDetail, getSimilar, getVideos, getCredits } from '~/services/tmdb/tmdb.server';
import MediaList from '~/src/components/Media/List';
import PeopleList from '~/src/components/people/PeopleList';
import useMediaQuery from '~/hooks/useMediaQuery';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
  videos: Awaited<ReturnType<typeof getVideos>>;
  credits: Awaited<ReturnType<typeof getCredits>>;
  similar: Awaited<ReturnType<typeof getSimilar>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const mid = Number(id);

  if (!mid) throw new Response('Not Found', { status: 404 });

  const detail = await getMovieDetail(mid);
  const similar = await getSimilar('movie', mid);
  const videos = await getVideos('movie', mid);
  const credits = await getCredits('movie', mid);

  if (!detail || !similar || !videos || !credits) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    videos,
    credits,
    similar,
  });
};

const Overview = () => {
  const {
    detail,
    similar,
    credits,
    // videos,
  } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  // const isXs = useMediaQuery(425, 'max');
  const isSm = useMediaQuery(650, 'max');
  // const isMd = useMediaQuery(960, 'max');
  // const isMdLand = useMediaQuery(960, 'max', 'landscape');

  const directors = credits.crew.filter(({ job }) => job === 'Director');
  const onClickViewMore = (type: 'cast' | 'similar') => {
    navigate(`/movies/${detail?.id}/${type}`);
  };
  return (
    <Row
      fluid
      align="stretch"
      justify="center"
      css={{
        marginTop: '0.75rem',
        padding: 0,
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
      {!isSm && (
        <Col span={4}>
          <Row justify="center">
            <Text
              size={12}
              css={{
                width: '50%',
                margin: 0,
                '@xs': {
                  fontSize: '14px',
                },
                '@sm': {
                  fontSize: '16px',
                },
                '@md': {
                  fontSize: '18px',
                },
              }}
            >
              <strong>Status</strong>
              <br />
              {detail.status}
            </Text>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <Text
              size={12}
              css={{
                width: '50%',
                margin: 0,
                '@xs': {
                  fontSize: '14px',
                },
                '@sm': {
                  fontSize: '16px',
                },
                '@md': {
                  fontSize: '18px',
                },
              }}
            >
              <strong>Original Language</strong>
              <br />
              {detail.original_language}
            </Text>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <Text
              size={12}
              css={{
                width: '50%',
                margin: 0,
                '@xs': {
                  fontSize: '14px',
                },
                '@sm': {
                  fontSize: '16px',
                },
                '@md': {
                  fontSize: '18px',
                },
              }}
            >
              <strong>Budget</strong>
              <br />${detail.budget}
            </Text>
          </Row>
          <Spacer y={1} />
          <Row justify="center">
            <Text
              size={12}
              css={{
                width: '50%',
                margin: 0,
                '@xs': {
                  fontSize: '14px',
                },
                '@sm': {
                  fontSize: '16px',
                },
                '@md': {
                  fontSize: '18px',
                },
              }}
            >
              <strong>Revenue</strong>
              <br />${detail.revenue}
            </Text>
          </Row>
        </Col>
      )}
      <Col span={isSm ? 12 : 8}>
        <Row>
          <Text
            size={12}
            css={{
              textAlign: 'justify',
              margin: 0,
              '@xs': {
                fontSize: '14px',
              },
              '@sm': {
                fontSize: '16px',
              },
              '@md': {
                fontSize: '18px',
              },
            }}
          >
            {detail.overview}
          </Text>
        </Row>
        <Spacer y={1} />

        <Row>
          {directors && directors.length > 0 && (
            <>
              <Text
                size={12}
                css={{
                  margin: 0,
                  '@xs': {
                    fontSize: '14px',
                  },
                  '@sm': {
                    fontSize: '16px',
                  },
                  '@md': {
                    fontSize: '18px',
                  },
                }}
              >
                <strong>Director</strong>
                <br />
                {directors.map((director, index) => (
                  <p key={`director-item-${index}`}>{director.name}</p>
                ))}
              </Text>
              <Spacer x={2} />
            </>
          )}
          {detail?.production_countries && detail.production_countries.length > 0 && (
            <>
              <Text
                size={12}
                css={{
                  margin: 0,
                  '@xs': {
                    fontSize: '14px',
                  },
                  '@sm': {
                    fontSize: '16px',
                  },
                  '@md': {
                    fontSize: '18px',
                  },
                }}
              >
                <strong>Production Countries</strong>
                <br />
                {detail?.production_countries.map((country, index) => (
                  <p key={`country-item-${index}`}>{country.name}</p>
                ))}
              </Text>
              <Spacer x={2} />
            </>
          )}
          {detail?.spoken_languages && detail.spoken_languages.length > 0 && (
            <>
              <Text
                size={12}
                css={{
                  margin: 0,
                  '@xs': {
                    fontSize: '14px',
                  },
                  '@sm': {
                    fontSize: '16px',
                  },
                  '@md': {
                    fontSize: '18px',
                  },
                }}
              >
                <strong>Spoken Languages</strong>
                <br />
                {detail?.spoken_languages.map((language, index) => (
                  <p key={`language-item-${index}`}>{language.english_name}</p>
                ))}
              </Text>
              <Spacer x={2} />
            </>
          )}
        </Row>
        <Spacer y={1} />
        <Divider x={1} />
        <Spacer y={1} />
        {credits?.cast.length > 0 && (
          <PeopleList
            listType="slider-card"
            items={credits?.cast.slice(0, 9)}
            listName="Top Billed Cast"
            showMoreList
            onClickViewMore={() => onClickViewMore('cast')}
            cardType="cast"
          />
        )}
        <Spacer y={1} />
        <Divider x={1} />
        <Spacer y={1} />
        {/*
          TODO: Videos
          <Spacer y={1} />
          <Divider x={1} />
          <Spacer y={1} />
        */}
        {similar.items && similar.items.length > 0 && (
          <MediaList
            listType="slider-card"
            items={similar.items}
            listName="Similar Movies"
            showMoreList
            onClickViewMore={() => onClickViewMore('similar')}
            cardType="similar"
          />
        )}
        <Spacer y={1} />
        <Divider x={1} />
        <Spacer y={1} />
      </Col>
    </Row>
  );
};

export default Overview;
