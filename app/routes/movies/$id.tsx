/* eslint-disable @typescript-eslint/no-throw-literal */
import { LoaderFunction, json } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import { Container } from '@nextui-org/react';
// @ts-expect-error: this is expected
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { getMovieDetail } from '~/services/tmdb/tmdb.server';
import MediaDetail from '~/src/components/Media/MediaDetail';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getMovieDetail>>;
  // videos: Awaited<ReturnType<typeof getVideos>>;
  // credits: Awaited<ReturnType<typeof getCredits>>;
  // similar: Awaited<ReturnType<typeof getSimilar>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const mid = Number(id);

  if (!mid) throw new Response('Not Found', { status: 404 });

  const detail = await getMovieDetail(mid);

  if (!detail) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    // videos: await getVideos('movie', mid),
    // credits: await getCredits('movie', mid),
    // similar: await getSimilar('movie', mid),
  });
};

const MovieDetail = () => {
  const { detail } = useLoaderData<LoaderData>();
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

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};

export default MovieDetail;
