/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { useState, useEffect, Suspense } from 'react';
import { MetaFunction, LoaderFunction, json } from '@remix-run/node';
import {
  useCatch,
  useLoaderData,
  Link,
  RouteMatch,
  useParams,
  useFetcher,
  useLocation,
  useNavigate,
} from '@remix-run/react';
import {
  Container,
  Spacer,
  Loading,
  Radio,
  Divider,
  Button,
  Tooltip,
  Row,
  Col,
  Card,
  Avatar,
} from '@nextui-org/react';
import { ClientOnly, useRouteData } from 'remix-utils';
import { isDesktop } from 'react-device-detect';
import Hls from 'hls.js';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';
import Image, { MimeType } from 'remix-image';

import { authenticate, insertHistory } from '~/services/supabase';
import {
  getTvShowDetail,
  getTvShowIMDBId,
  getRecommendation,
  getTranslations,
  getImdbRating,
} from '~/services/tmdb/tmdb.server';
import {
  getMovieSearch,
  getMovieInfo,
  getMovieEpisodeStreamLink,
} from '~/services/consumet/flixhq/flixhq.server';
import {
  IMovieResult,
  IMovieSource,
  IMovieSubtitle,
} from '~/services/consumet/flixhq/flixhq.types';
import {
  getKissKhInfo,
  getKissKhEpisodeStream,
  getKissKhEpisodeSubtitle,
} from '~/services/kisskh/kisskh.server';
import { loklokGetTvEpInfo } from '~/services/loklok';
import i18next from '~/i18n/i18next.server';
import { LOKLOK_URL } from '~/services/loklok/utils.server';
import TMDB from '~/utils/media';
import Player from '~/utils/player';
import updateHistory from '~/utils/update-history';
import useMediaQuery from '~/hooks/useMediaQuery';

import ArtPlayer from '~/src/components/elements/player/ArtPlayer';
import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import MediaList from '~/src/components/media/MediaList';
import Flex from '~/src/components/styles/Flex.styles';
import { H2, H5, H6 } from '~/src/components/styles/Text.styles';
import WatchTrailerModal, { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import CatchBoundaryView from '~/src/components/CatchBoundaryView';
import ErrorBoundaryView from '~/src/components/ErrorBoundaryView';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

type LoaderData = {
  provider?: string;
  detail: Awaited<ReturnType<typeof getTvShowDetail>>;
  imdbId: Awaited<ReturnType<typeof getTvShowIMDBId>>;
  recommendations: Awaited<ReturnType<typeof getRecommendation>>;
  data?: Awaited<ReturnType<typeof getMovieInfo>>;
  sources?: IMovieSource[] | undefined;
  subtitles?: IMovieSubtitle[] | undefined;
  userId?: string;
  imdbRating?: { count: number; star: number };
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: 'Missing Episode',
      description: `This season of tv show doesn't have episode ${params.episodeId}`,
    };
  }
  const { detail } = data;
  return {
    title: `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} HD online Free - Sora`,
    description: `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} in full HD online with Subtitle`,
    keywords: `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Stream ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} HD, Online ${detail.name} season ${params.seasonId} episode ${params.episodeId}, Streaming ${detail.name} season ${params.seasonId} episode ${params.episodeId}, English, Subtitle ${detail.name} season ${params.seasonId} episode ${params.episodeId}, English Subtitle`,
    'og:url': `https://sora-anime.vercel.app/tv-shows/${params.tvId}/season/${params.seasonId}/episode/${params.episodeId}`,
    'og:title': `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} HD online Free - Sora`,
    'og:description': `Watch ${detail.name} season ${params.seasonId} episode ${params.episodeId} in full HD online with Subtitle`,
    'og:image': TMDB.backdropUrl(detail?.backdrop_path || '', 'w780'),
    refresh: {
      httpEquiv: 'Content-Security-Policy',
      content: 'upgrade-insecure-requests',
    },
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const [user, locale] = await Promise.all([authenticate(request), i18next.getLocale(request)]);

  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const idProvider = url.searchParams.get('id');
  const { tvId, seasonId, episodeId } = params;
  const tid = Number(tvId);

  if (!tid) throw new Response('Not Found', { status: 404 });

  const [detail, imdbId, recommendations] = await Promise.all([
    getTvShowDetail(tid),
    getTvShowIMDBId(tid),
    getRecommendation('tv', tid),
  ]);

  if (user) {
    insertHistory({
      user_id: user.id,
      media_type: 'movie',
      duration: (detail?.episode_run_time?.[0] || 0) * 60,
      watched: 0,
      route: url.pathname + url.search,
      media_id: (detail?.id || tid).toString(),
      poster: TMDB.backdropUrl(detail?.backdrop_path || '', 'w300'),
      title: detail?.name || detail?.original_name || undefined,
      overview: detail?.overview || undefined,
      season: seasonId,
      episode: episodeId,
    });
  }

  if (provider === 'Loklok') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    // const tvDetail = await loklokGetTvEpInfo(idProvider, Number(episodeId) - 1);
    const [tvDetail, imdbRating] = await Promise.all([
      loklokGetTvEpInfo(idProvider, Number(episodeId) - 1),
      imdbId ? getImdbRating(imdbId) : undefined,
    ]);
    return json<LoaderData>({
      provider,
      detail,
      imdbId,
      recommendations,
      imdbRating,
      sources: tvDetail?.sources,
      subtitles: tvDetail?.subtitles.map((sub) => ({
        lang: `${sub.language} (${sub.lang})`,
        url: `${LOKLOK_URL}/subtitle?url=${sub.url}`,
      })),
      userId: user?.id,
    });
  }

  if (provider === 'Flixhq') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [tvDetail, imdbRating] = await Promise.all([
      getMovieInfo(idProvider),
      imdbId ? getImdbRating(imdbId) : undefined,
    ]);
    const tvEpisodeDetail = tvDetail?.episodes?.find(
      (episode) => episode.season === Number(seasonId) && episode.number === Number(episodeId),
    );
    if (tvEpisodeDetail) {
      const tvEpisodeStreamLink = await getMovieEpisodeStreamLink(
        tvEpisodeDetail?.id || '',
        tvDetail?.id || '',
      );
      return json<LoaderData>({
        provider,
        detail,
        imdbId,
        recommendations,
        imdbRating,
        data: tvDetail,
        sources: tvEpisodeStreamLink?.sources,
        subtitles: tvEpisodeStreamLink?.subtitles,
        userId: user?.id,
      });
    }
  }

  if (provider === 'KissKh') {
    if (!idProvider) throw new Response('Id Not Found', { status: 404 });
    const [episodeDetail, imdbRating] = await Promise.all([
      getKissKhInfo(Number(idProvider)),
      imdbId ? getImdbRating(imdbId) : undefined,
    ]);
    const episodeSearch = episodeDetail?.episodes?.find((e) => e?.number === Number(episodeId));
    const [episodeStream, episodeSubtitle] = await Promise.all([
      getKissKhEpisodeStream(Number(episodeSearch?.id)),
      episodeSearch && episodeSearch.sub > 0
        ? getKissKhEpisodeSubtitle(Number(episodeSearch?.id))
        : undefined,
    ]);

    return json<LoaderData>({
      provider,
      detail,
      imdbId,
      recommendations,
      imdbRating,
      sources: [{ url: episodeStream?.Video || '', isM3U8: true, quality: 'auto' }],
      subtitles: episodeSubtitle?.map((sub) => ({
        lang: sub.label,
        url: sub.src,
        ...(sub.default && { default: true }),
      })),
      userId: user?.id,
    });
  }

  if (provider === 'Embed') {
    const imdbRating = imdbId ? await getImdbRating(imdbId) : undefined;
    return json<LoaderData>({
      detail,
      imdbId,
      recommendations,
      imdbRating,
      userId: user?.id,
    });
  }
  let search;
  let tvDetail;
  let tvEpisodeDetail;
  let tvEpisodeStreamLink;
  let imdbRating;
  if ((detail && detail.original_language === 'en') || locale === 'en') {
    [search, imdbRating] = await Promise.all([
      getMovieSearch(detail?.name || ''),
      imdbId ? getImdbRating(imdbId) : undefined,
    ]);
    const findMovie: IMovieResult | undefined = search?.results.find(
      (item) => item.title === detail?.name,
    );
    if (findMovie && findMovie.id) {
      tvDetail = await getMovieInfo(findMovie.id);
      tvEpisodeDetail = tvDetail?.episodes?.find(
        (episode) => episode.season === Number(seasonId) && episode.number === Number(episodeId),
      );
      if (tvEpisodeDetail) {
        tvEpisodeStreamLink = await getMovieEpisodeStreamLink(
          tvEpisodeDetail?.id || '',
          tvDetail?.id || '',
        );
      }
    }
  } else {
    const translations = await getTranslations('tv', tid);
    const findTranslation = translations?.translations.find((item) => item.iso_639_1 === 'en');
    if (findTranslation) {
      [search, imdbRating] = await Promise.all([
        getMovieSearch(detail?.name || ''),
        imdbId ? getImdbRating(imdbId) : undefined,
      ]);
      const findMovie: IMovieResult | undefined = search?.results.find(
        (item) => item.title === detail?.name,
      );
      if (findMovie && findMovie.id) {
        tvDetail = await getMovieInfo(findMovie.id);
        tvEpisodeDetail = tvDetail?.episodes?.find(
          (episode) => episode.season === Number(seasonId) && episode.number === Number(episodeId),
        );
        if (tvEpisodeDetail) {
          tvEpisodeStreamLink = await getMovieEpisodeStreamLink(
            tvEpisodeDetail?.id || '',
            tvDetail?.id || '',
          );
        }
      }
    }
  }

  if (!imdbId || !detail) throw new Response('Not Found', { status: 404 });

  return json<LoaderData>({
    detail,
    imdbId,
    recommendations,
    imdbRating,
    data: tvDetail,
    sources: tvEpisodeStreamLink?.sources,
    subtitles: tvEpisodeStreamLink?.subtitles,
    userId: user?.id,
  });
};

export const handle = {
  breadcrumb: (match: RouteMatch) => (
    <>
      <Link
        to={`/tv-shows/${match.params.tvId}`}
        aria-label={
          match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId
        }
      >
        {match.data?.detail?.name || match.data?.detail?.original_name || match.params.tvId}
      </Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/`}
        aria-label={`Season ${match.params.seasonId}`}
      >
        Season {match.params.seasonId}
      </Link>
      <Spacer x={0.5} />
      <span> ❱ </span>
      <Spacer x={0.5} />
      <Link
        to={`/tv-shows/${match.params.tvId}/season/${match.params.seasonId}/episode/${match.params.episodeId}`}
        aria-label={`Episode ${match.params.episodeId}`}
      >
        Episode {match.params.episodeId}
      </Link>
    </>
  ),
};

const EpisodeWatch = () => {
  const { provider, detail, imdbId, recommendations, imdbRating, sources, subtitles, userId } =
    useLoaderData<LoaderData>();
  const rootData:
    | {
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
      }
    | undefined = useRouteData('root');
  const { seasonId, episodeId } = useParams();
  const isSm = useMediaQuery(960, 'max');
  const id = detail && detail.id;
  const [player, setPlayer] = useState<string>('1');
  const [source, setSource] = useState<string>(Player.moviePlayerUrl(Number(id), 1));

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const closeHandler = () => {
    setVisible(false);
    setTrailer({});
  };
  const releaseYear = new Date(detail?.first_air_date || '').getFullYear();

  useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);

  useEffect(
    () =>
      player === '2'
        ? setSource(Player.tvPlayerUrl(Number(imdbId), Number(player), Number(episodeId) || 1))
        : setSource(
            Player.tvPlayerUrl(
              Number(detail?.id),
              Number(player),
              Number(seasonId) || 1,
              Number(episodeId),
            ),
          ),
    [player, imdbId, seasonId, episodeId, detail?.id],
  );
  const subtitleSelector = subtitles?.map(({ lang, url }: { lang: string; url: string }) => ({
    html: lang.toString(),
    url: url.toString(),
    ...(provider === 'Flixhq' && lang === 'English' && { default: true }),
    ...(provider === 'KissKh' && lang === 'English' && { default: true }),
    ...(provider === 'Loklok' && lang === 'en' && { default: true }),
  }));
  const qualitySelector = sources?.map(
    ({ quality, url }: { quality: number | string; url: string }) => ({
      html: quality.toString(),
      url: url.toString(),
      isM3U8: true,
      isDASH: false,
      ...(provider === 'Flixhq' && quality === 'auto' && { default: true }),
      ...(provider === 'Loklok' && Number(quality) === 720 && { default: true }),
    }),
  );
  return (
    <Container
      fluid
      css={{
        paddingTop: '100px',
        paddingLeft: '88px',
        paddingRight: '23px',
        '@smMax': {
          padding: '100px 0 65px 0',
        },
      }}
    >
      <ClientOnly fallback={<Loading type="default" />}>
        {() => (
          <Suspense fallback={<Loading type="default" />}>
            <AspectRatio.Root ratio={7 / 3}>
              {sources ? (
                <ArtPlayer
                  option={{
                    title: detail?.name,
                    url:
                      provider === 'Flixhq'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'auto',
                          )?.url || sources[0]?.url
                        : provider === 'Loklok'
                        ? sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              Number(item.quality) === 720,
                          )?.url || sources[0]?.url
                        : provider === 'KissKh'
                        ? sources[0]?.url
                        : sources?.find(
                            (item: { quality: number | string; url: string }) =>
                              item.quality === 'auto',
                          )?.url || sources[0]?.url,
                    subtitle: {
                      url:
                        provider === 'Flixhq'
                          ? subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
                            )?.url || ''
                          : provider === 'Loklok'
                          ? subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
                            )?.url || ''
                          : provider === 'KissKh'
                          ? subtitles?.find(
                              (item: { lang: string; url: string; default?: boolean }) =>
                                item.default,
                            )?.url || ''
                          : subtitles?.find((item: { lang: string; url: string }) =>
                              item.lang.includes('English'),
                            )?.url || '',
                      encoding: 'utf-8',
                      style: {
                        fontSize: isDesktop ? '40px' : '20px',
                      },
                    },
                    poster: TMDB.backdropUrl(detail?.backdrop_path || '', isSm ? 'w780' : 'w1280'),
                    isLive: false,
                    autoMini: true,
                    backdrop: true,
                    playsInline: true,
                    autoPlayback: true,
                    layers: [
                      {
                        name: 'title',
                        html: `<span>${detail?.name} - SS ${seasonId} - EP ${episodeId}</span>`,
                        style: {
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          fontSize: '1.125rem',
                        },
                      },
                    ],
                    customType: {
                      m3u8: (video: HTMLMediaElement, url: string) => {
                        if (Hls.isSupported()) {
                          const hls = new Hls();
                          hls.loadSource(url);
                          hls.attachMedia(video);
                        } else {
                          const canPlay = video.canPlayType('application/vnd.apple.mpegurl');
                          if (canPlay === 'probably' || canPlay === 'maybe') {
                            video.src = url;
                          }
                        }
                      },
                    },
                    plugins:
                      provider === 'KissKh'
                        ? [
                            artplayerPluginHlsQuality({
                              setting: true,
                              title: 'Quality',
                              auto: 'Auto',
                            }),
                          ]
                        : [],
                  }}
                  qualitySelector={qualitySelector || []}
                  subtitleSelector={subtitleSelector || []}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  subtitleOptions={{
                    parent_tmdb_id: detail?.id,
                    season_number: Number(seasonId),
                    episode_number: Number(episodeId),
                    type: 'episode',
                  }}
                  getInstance={(art) => {
                    art.on('ready', () => {
                      const t = new URLSearchParams(location.search).get('t');
                      if (t) {
                        art.currentTime = Number(t);
                      }
                    });

                    if (userId) {
                      updateHistory(
                        art,
                        fetcher,
                        userId,
                        location.pathname + location.search,
                        'tv',
                        detail?.name || detail?.name || '',
                        detail?.overview || '',
                        seasonId,
                        episodeId,
                      );
                    }

                    art.on('pause', () => {
                      art.layers.title.style.display = 'block';
                    });
                    art.on('play', () => {
                      art.layers.title.style.display = 'none';
                    });
                    art.on('hover', (state: boolean) => {
                      art.layers.title.style.display = state || !art.playing ? 'block' : 'none';
                    });
                  }}
                />
              ) : (
                <iframe
                  id="iframe"
                  src={source}
                  style={{
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  frameBorder="0"
                  title="movie-player"
                  allowFullScreen
                  scrolling="no"
                  // @ts-expect-error: this is expected
                  sandbox
                />
              )}
            </AspectRatio.Root>
            {!sources && (
              <>
                <Spacer y={1} />
                <Radio.Group
                  label="Choose Player"
                  defaultValue="1"
                  orientation="horizontal"
                  value={player}
                  onChange={setPlayer}
                >
                  <Radio value="1">Player 1</Radio>
                  <Radio value="2">Player 2</Radio>
                  <Radio value="3">Player 3</Radio>
                </Radio.Group>
              </>
            )}
          </Suspense>
        )}
      </ClientOnly>
      <Spacer y={1} />
      <Container
        fluid
        alignItems="stretch"
        justify="center"
        css={{
          marginTop: '0.75rem',
          padding: '0 0.75rem',
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
        <Flex justify="start" align="center" wrap="wrap">
          <Tooltip content="In developpement">
            <Button size="sm" color="primary" auto ghost css={{ marginBottom: '0.75rem' }}>
              Toggle Light
            </Button>
          </Tooltip>
          <Spacer x={0.5} />
          <Button
            size="sm"
            color="primary"
            auto
            ghost
            onClick={() => {
              setVisible(true);
              fetcher.load(`/movies/${id}/videos`);
            }}
            css={{ marginBottom: '0.75rem' }}
          >
            Watch Trailer
          </Button>
          <Spacer x={0.5} />
          <Tooltip content="In developpement">
            <Button size="sm" color="primary" auto ghost css={{ marginBottom: '0.75rem' }}>
              Add to Watchlist
            </Button>
          </Tooltip>
        </Flex>
        <Spacer y={1} />
        <Divider x={1} css={{ m: 0 }} />
        <Spacer y={1} />
        <Row>
          {!isSm && (
            <Col span={4}>
              {detail?.poster_path ? (
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={TMDB.posterUrl(detail?.poster_path, 'w342')}
                  alt={detail?.name}
                  objectFit="cover"
                  width="50%"
                  css={{
                    minWidth: 'auto !important',
                    minHeight: '205px !important',
                    borderRadius: '24px',
                  }}
                  loaderUrl="/api/image"
                  placeholder="blur"
                  responsive={[
                    {
                      size: {
                        width: 137,
                        height: 205,
                      },
                      maxWidth: 960,
                    },
                    {
                      size: {
                        width: 158,
                        height: 237,
                      },
                      maxWidth: 1280,
                    },
                    {
                      size: {
                        width: 173,
                        height: 260,
                      },
                      maxWidth: 1400,
                    },
                    {
                      size: {
                        width: 239,
                        height: 359,
                      },
                    },
                  ]}
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                />
              ) : (
                <Row align="center" justify="center">
                  <Avatar
                    icon={<PhotoIcon width={48} height={48} />}
                    css={{
                      width: '50% !important',
                      size: '$20',
                      minWidth: 'auto !important',
                      minHeight: '205px !important',
                      marginTop: '10vh',
                      borderRadius: '24px !important',
                    }}
                  />
                </Row>
              )}
            </Col>
          )}
          <Col span={isSm ? 12 : 8}>
            <Row>
              <H2 h2 weight="bold">
                {`${detail?.name} (${releaseYear})`}
              </H2>
            </Row>
            <Spacer y={0.5} />
            <Flex direction="row">
              <H5
                h5
                css={{
                  backgroundColor: '#3ec2c2',
                  borderRadius: '$xs',
                  padding: '0 0.25rem 0 0.25rem',
                  marginRight: '0.5rem',
                }}
              >
                TMDb
              </H5>
              <H5 h5>{detail?.vote_average?.toFixed(1)}</H5>
              {imdbRating && (
                <>
                  <Spacer x={1.25} />
                  <H5
                    h5
                    css={{
                      backgroundColor: '#ddb600',
                      color: '#000',
                      borderRadius: '$xs',
                      padding: '0 0.25rem 0 0.25rem',
                      marginRight: '0.5rem',
                    }}
                  >
                    IMDb
                  </H5>
                  <H5 h5>{imdbRating?.star}</H5>
                </>
              )}
            </Flex>
            <Spacer y={1} />
            <Row fluid align="center" wrap="wrap" justify="flex-start" css={{ width: '100%' }}>
              {detail?.genres &&
                detail?.genres?.map((genre) => (
                  <>
                    <Button
                      color="primary"
                      auto
                      ghost
                      rounded
                      key={genre?.id}
                      size={isSm ? 'sm' : 'md'}
                      css={{ marginBottom: '0.125rem' }}
                      onClick={() => navigate(`/tv-shows/discover?with_genres=${genre?.id}`)}
                    >
                      {genre?.name}
                    </Button>
                    <Spacer x={1} />
                  </>
                ))}
            </Row>
            <Spacer y={1} />
            <Row>
              <H6 h6 css={{ textAlign: 'justify' }}>
                {detail?.overview}
              </H6>
            </Row>
            <Spacer y={1} />
          </Col>
        </Row>
        <Spacer y={1} />
        <Divider x={1} css={{ m: 0 }} />
        <Spacer y={1} />
        {recommendations && recommendations.items && recommendations.items.length > 0 && (
          <>
            <MediaList
              listType="slider-card"
              items={recommendations.items}
              listName="You May Also Like"
              showMoreList
              onClickViewMore={() => navigate(`/tv-shows/${detail?.id}/recommendations`)}
              cardType="similar-tv"
              navigationButtons
              genresMovie={rootData?.genresMovie}
              genresTv={rootData?.genresTv}
            />
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        )}
      </Container>
      <WatchTrailerModal trailer={trailer} visible={visible} closeHandler={closeHandler} />
    </Container>
  );
};

export default EpisodeWatch;

export const CatchBoundary = () => {
  const caught = useCatch();

  return <CatchBoundaryView caught={caught} />;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const isProd = process.env.NODE_ENV === 'production';

  return <ErrorBoundaryView error={error} isProd={isProd} />;
};
