/* eslint-disable @typescript-eslint/indent */
import { memo } from 'react';
import { Avatar, Button, Card, Col, Row, Spacer } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { useNavigate } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';
import tinycolor from 'tinycolor2';

import type { IMedia } from '~/types/media';
import type { IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import type { IEpisode } from '~/services/tmdb/tmdb.types';
import MediaList from '~/components/media/MediaList';
import ListEpisodes from '~/components/elements/shared/ListEpisodes';
import Rating from '~/components/elements/shared/Rating';
import Flex from '~/components/styles/Flex.styles';
import { H2, H6 } from '~/components/styles/Text.styles';
import PhotoIcon from '~/assets/icons/PhotoIcon';

interface IWatchDetailProps {
  id?: number | string | undefined;
  type: 'movie' | 'tv' | 'anime';
  title: string;
  overview?: string;
  posterPath?: string;
  tmdbRating?: number;
  imdbRating?: number;
  anilistRating?: number;
  genresMedia?: {
    id?: number;
    name?: string;
  }[];
  genresAnime?: string[];
  recommendationsMovies?: IMedia[];
  recommendationsAnime?: IMedia[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  color?: string;
  episodes?: IEpisode[] | IEpisodeInfo[];
  season?: number;
  providers?: {
    id?: string | number | null;
    provider: string;
    episodesCount?: number;
  }[];
}

const WatchDetail: React.FC<IWatchDetailProps> = (props: IWatchDetailProps) => {
  const {
    id,
    type,
    title,
    overview,
    posterPath,
    tmdbRating,
    imdbRating,
    anilistRating,
    genresMedia,
    genresAnime,
    recommendationsMovies,
    recommendationsAnime,
    genresMovie,
    genresTv,
    color,
    episodes,
    season,
    providers,
  } = props;
  const navigate = useNavigate();
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const colorBackground = tinycolor(color).isDark()
    ? tinycolor(color).brighten(40).saturate(70).spin(180).toString()
    : tinycolor(color).darken(40).saturate(70).spin(180).toString();

  return (
    <>
      {type === 'anime' || type === 'tv' ? (
        <>
          <Row>
            {type === 'anime' ? (
              <Col span={12}>
                <ListEpisodes
                  type="anime"
                  id={id}
                  episodes={episodes}
                  providers={providers || []}
                  // episodeId
                  // episodeNumber
                />
              </Col>
            ) : null}
            {type === 'tv' ? (
              <Col span={12}>
                <ListEpisodes
                  type="tv"
                  id={id}
                  episodes={episodes}
                  season={season}
                  providers={providers || []}
                />
              </Col>
            ) : null}
          </Row>
          <Spacer y={2} />
        </>
      ) : null}
      <Row
        css={{
          backgroundColor: '$backgroundContrast',
          p: '$lg',
          borderRadius: '$lg',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '$lg',
        }}
      >
        {!isSm &&
          (posterPath ? (
            <Card.Image
              // @ts-ignore
              as={Image}
              src={posterPath}
              alt={title}
              title={title}
              objectFit="cover"
              showSkeleton
              css={{
                width: '100%',
                height: 'auto',
                aspectRatio: '2 / 3',
                borderRadius: '$sm',
                minWidth: 'auto !important',
                minHeight: 'auto !important',
                maxWidth: '137px',
                '@sm': { maxWidth: '158px' },
                '@md': { maxWidth: '173px' },
                '@lg': { maxWidth: '239px' },
              }}
              containerCss={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              loading="lazy"
              loaderUrl="/api/image"
              placeholder="empty"
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
          ))}
        <Flex direction="column" justify="start" align="start" className="w-full">
          <H2 h2 weight="bold">
            {title}
          </H2>
          <Spacer y={0.5} />
          {type === 'movie' || type === 'tv' ? (
            <>
              <Flex direction="row">
                <Rating rating={tmdbRating?.toFixed(1)} ratingType="movie" />
                {imdbRating && (
                  <>
                    <Spacer x={0.75} />
                    <H6
                      h6
                      weight="semibold"
                      css={{
                        backgroundColor: '#ddb600',
                        color: '#000',
                        borderRadius: '$xs',
                        padding: '0 0.25rem 0 0.25rem',
                        marginRight: '0.5rem',
                      }}
                    >
                      IMDb
                    </H6>
                    <H6 h6 weight="semibold">
                      {imdbRating}
                    </H6>
                  </>
                )}
              </Flex>
              <Spacer y={1} />
            </>
          ) : null}
          {type === 'anime' && anilistRating ? (
            <>
              <Rating rating={anilistRating} ratingType="anime" />
              <Spacer y={1} />
            </>
          ) : null}
          <Flex align="center" wrap="wrap" justify="start" className="w-full">
            {(type === 'movie' || type === 'tv') &&
              genresMedia &&
              genresMedia.map((genre) => (
                <>
                  <Button
                    key={genre?.id}
                    type="button"
                    color="primary"
                    auto
                    size={isSm ? 'sm' : 'md'}
                    css={{
                      marginBottom: '0.125rem',
                      background: color,
                      color: colorBackground,
                      '&:hover': {
                        background: colorBackground,
                        color,
                      },
                    }}
                    onPress={() =>
                      navigate(
                        `/discover/${type === 'movie' ? 'movies' : 'tv-shows'}?with_genres=${
                          genre?.id
                        }`,
                      )
                    }
                  >
                    {genre?.name}
                  </Button>
                  <Spacer x={0.5} />
                </>
              ))}
            {type === 'anime' &&
              genresAnime &&
              genresAnime.map((genre, index) => (
                <>
                  <Button
                    key={index}
                    type="button"
                    auto
                    size={isSm ? 'sm' : 'md'}
                    onPress={() => navigate(`/discover/anime?genres=${genre}`)}
                    css={{
                      marginBottom: '0.125rem',
                      background: color,
                      color: colorBackground,
                      '&:hover': {
                        background: colorBackground,
                        color,
                      },
                    }}
                  >
                    {genre}
                  </Button>
                  <Spacer x={1} />
                </>
              ))}
          </Flex>
          <Spacer y={1} />
          {type === 'movie' || type === 'tv' ? (
            <H6 h6 css={{ textAlign: 'justify' }}>
              {overview}
            </H6>
          ) : null}
          {type === 'anime' ? (
            <H6
              h6
              css={{ textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: overview || '' }}
            />
          ) : null}
          <Spacer y={1} />
        </Flex>
      </Row>
      <Spacer y={2} />
      {(type === 'movie' || type === 'tv') &&
      recommendationsMovies &&
      recommendationsMovies.length > 0 ? (
        <>
          <MediaList
            genresMovie={genresMovie}
            genresTv={genresTv}
            items={recommendationsMovies}
            itemsType={type}
            listName="You May Also Like"
            listType="slider-card"
            navigationButtons
            onClickViewMore={() =>
              navigate(`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}/recommendations`)
            }
            showMoreList
          />
          <Spacer y={2} />
        </>
      ) : null}
      {type === 'anime' && recommendationsAnime && recommendationsAnime.length > 0 ? (
        <>
          <MediaList
            items={recommendationsAnime}
            itemsType="anime"
            listName="You May Also Like"
            listType="slider-card"
            navigationButtons
          />
          <Spacer y={2} />
        </>
      ) : null}
    </>
  );
};

export default memo(WatchDetail);
