import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getMovieDetail } from '~/services/tmdb/movies.server';
import { getCredits, getSimilar, getVideos } from '~/services/tmdb/tmdb.server';

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
  console.log(detail);
  console.log(videos);
  console.log(credits);
  console.log(similar);
  return (
    <p>Hello, there, this is a movie detail page. Things are logged on console. {detail?.title}</p>
  );
};

export default MovieDetail;
