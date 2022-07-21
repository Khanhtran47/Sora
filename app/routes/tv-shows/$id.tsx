import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getTvShowDetail } from '~/services/tmdb/tv.server';
import { getCredits, getSimilar, getVideos } from '~/services/tmdb/tmdb.server';

type LoaderData = {
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
  videos: Awaited<ReturnType<typeof getVideos>>;
  credits: Awaited<ReturnType<typeof getCredits>>;
  similar: Awaited<ReturnType<typeof getSimilar>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const tid = Number(id);
  return json<LoaderData>({
    detail: await getTvShowDetail(tid),
    videos: await getVideos('tv', tid),
    credits: await getCredits('tv', tid),
    similar: await getSimilar('tv', tid),
  });
};

const TvShowDetail = () => {
  const { detail, videos, credits, similar } = useLoaderData<LoaderData>();
  console.log(detail);
  console.log(videos);
  console.log(credits);
  console.log(similar);
  return (
    <p>Hello, there, this is a tv show detail page. Things are logged on console. {detail?.name}</p>
  );
};

export default TvShowDetail;
