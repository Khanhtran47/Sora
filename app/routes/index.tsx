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
import { IMedia, IPeople } from '~/services/tmdb/tmdb.types';
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
  todayTrending: IMedia[] | undefined;
  movies: IMedia[] | undefined;
  shows: IMedia[] | undefined;
  people: IPeople[] | undefined;
};

export const loader: LoaderFunction = async ({ request }: DataFunctionArgs) => {
  const locale = await i18next.getLocale(request);

  const url = new URL(request.url);
  let page = Number(url.searchParams.get('page'));
  if (page && (page < 1 || page > 1000)) page = 1;
  const todayTrending = await getTrending('all', 'day', locale, page);
  const movies = await getListMovies('popular', locale, page);
  const shows = await getListTvShows('popular', locale, page);
  const people = await getListPeople('popular', locale, page);

  return json<LoaderData>({
    todayTrending: todayTrending && todayTrending.items && todayTrending.items.slice(0, 10),
    movies: movies && movies.items && movies.items.slice(0, 15),
    shows: shows && shows.items && shows.items.slice(0, 15),
    people: people && people.results && people.results.slice(0, 15),
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
  const [trending] = React.useState(todayTrending);
  const { t } = useTranslation('home');

  const onClickViewMore = (type: 'movies' | 'tv-shows' | 'people') => {
    if (type === 'people') navigate(`/${type}`);
    else navigate(`/${type}/popular`);
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
        {movies.length > 0 && (
          <MediaList
            listType="slider-card"
            items={movies}
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
        {shows.length > 0 && (
          <MediaList
            listType="slider-card"
            items={shows}
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
        {people.length > 0 && (
          <PeopleList
            listType="slider-card"
            items={people}
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
