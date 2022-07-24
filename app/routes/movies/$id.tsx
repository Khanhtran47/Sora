import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Container } from '@nextui-org/react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { getMovieDetail } from '~/services/tmdb/movies.server';
import { getCredits, getSimilar, getVideos } from '~/services/tmdb/tmdb.server';

import MediaDetail from '~/src/components/Media/MediaDetail';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
  videos: Awaited<ReturnType<typeof getVideos>>;
  credits: Awaited<ReturnType<typeof getCredits>>;
  similar: Awaited<ReturnType<typeof getSimilar>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const mid = Number(id);
  return json<LoaderData>({
    detail: await getMovieDetail(mid),
    videos: await getVideos('movie', mid),
    credits: await getCredits('movie', mid),
    similar: await getSimilar('movie', mid),
  });
};

const MovieDetail = () => {
  const { detail, videos, credits, similar } = useLoaderData<LoaderData>();
  return (
    <>
      <MediaDetail type="movie" item={detail} />
      <Container
        as="div"
        fluid
        responsive
        css={{
          margin: 0,
          paddingRight: 0,
          paddingLeft: '88px',
        }}
      >
        <Tabs
          id="controlled-tabs"
          // for
          // selectedTabClassName="bg-white"
        >
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Cast</Tab>
            <Tab>Crew</Tab>
            <Tab>Videos</Tab>
            <Tab>Photos</Tab>
          </TabList>

          <TabPanel>
            <p>
              Hello, there, this is a movie detail page. Things are logged on console.{' '}
              {detail?.title}
            </p>
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
          </TabPanel>
          <TabPanel>
            <h2>Any content 3</h2>
          </TabPanel>
          <TabPanel>
            <h2>Any content 4</h2>
          </TabPanel>
          <TabPanel>
            <h2>Any content 4</h2>
          </TabPanel>
        </Tabs>
      </Container>
    </>
  );
};

// TODO: add CatchBoundary and ErrorBoundary

export default MovieDetail;
