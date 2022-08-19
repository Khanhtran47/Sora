import * as React from 'react';
import { MetaFunction, LoaderFunction, json, DataFunctionArgs } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate, useFetcher } from '@remix-run/react';
import { Container, Modal } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import YouTube, { YouTubeProps } from 'react-youtube';

import i18next from '~/i18n/i18next.server';
import {
  getTrending,
  getListMovies,
  getListTvShows,
  getListPeople,
} from '~/services/tmdb/tmdb.server';
import useWindowSize from '~/hooks/useWindowSize';
import MediaList from '~/src/components/Media/MediaList';
import PeopleList from '~/src/components/people/PeopleList';

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => ({
  title: 'Remix App',
  description: '（づ￣3￣）づ╭❤️～',
});

export const handle = {
  i18n: 'home',
};

type Trailer = {
  iso_639_1?: string;
  iso_3166_1?: string;
  name?: string;
  key?: string;
  site?: string;
  size?: number;
  type?: string;
  official?: boolean;
  published_at?: string;
  id?: string;
};

type LoaderData = {
  todayTrending: Awaited<ReturnType<typeof getTrending>>;
  movies: Awaited<ReturnType<typeof getListMovies>>;
  shows: Awaited<ReturnType<typeof getListTvShows>>;
  people: Awaited<ReturnType<typeof getListPeople>>;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const locale = await i18next.getLocale(request);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (page && (page < 1 || page > 1000)) page = 1;

  return json<LoaderData>({
    todayTrending: await getTrending('all', 'day', locale, page),
    movies: await getListMovies('popular', locale, page),
    shows: await getListTvShows('popular', locale, page),
    people: await getListPeople('popular', locale, page),
  });
};

// https://remix.run/guides/routing#index-routes
const Index = () => {
  const { movies, shows, people, todayTrending } = useLoaderData();
  const fetcher = useFetcher();
  const { width } = useWindowSize();
  const [visible, setVisible] = React.useState(false);
  const [trailer, setTrailer] = React.useState<Trailer>({});
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    height: `${width && width < 720 ? width / 1.5 : 480}`,
    width: `${width && width < 720 ? width : 720}`,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      modestbranding: 1,
      controls: 1,
      mute: 1,
    },
  };

  const Handler = (id: number, type: 'movie' | 'tv') => {
    setVisible(true);
    fetcher.load(`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}/videos`);
  };
  const closeHandler = () => {
    setVisible(false);
    setTrailer({});
  };
  React.useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.name === 'Official Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);

  const location = useLocation();
  const navigate = useNavigate();
  const [trending] = React.useState(todayTrending.items);
  const { t } = useTranslation('home');

  const onClickViewMore = (type: 'movies' | 'tv-shows' | 'people') => {
    navigate(`/${type}/popular`);
  };

  return (
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MediaList listType="slider-banner" items={trending} handlerWatchTrailer={Handler} />
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          marginTop: '48px',
          paddingLeft: '88px',
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {movies?.items.length > 0 && (
          <MediaList
            listType="slider-card"
            items={movies.items}
            listName={t('popularMovies')}
            showMoreList
            onClickViewMore={() => onClickViewMore('movies')}
          />
        )}
      </Container>
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          marginTop: '48px',
          paddingLeft: '88px',
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {shows?.items.length > 0 && (
          <MediaList
            listType="slider-card"
            items={shows.items}
            listName={t('popularTv')}
            showMoreList
            onClickViewMore={() => onClickViewMore('tv-shows')}
          />
        )}
      </Container>
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          marginTop: '48px',
          paddingLeft: '88px',
          '@xsMax': {
            paddingLeft: 'calc(var(--nextui-space-sm))',
            paddingRight: 'calc(var(--nextui-space-sm))',
          },
        }}
      >
        {people?.results.length > 0 && (
          <PeopleList
            listType="slider-card"
            items={people.results}
            listName={t('popularPeople')}
            showMoreList
            onClickViewMore={() => onClickViewMore('people')}
          />
        )}
      </Container>

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
        className="!max-w-fit"
        noPadding
        autoMargin={false}
        width={width && width < 720 ? `${width}px` : '720px'}
      >
        <Modal.Body>
          {trailer && trailer.key && (
            <YouTube videoId={trailer.key} opts={opts} onReady={onPlayerReady} />
          )}
        </Modal.Body>
      </Modal>
    </motion.main>
  );
};

export default Index;
