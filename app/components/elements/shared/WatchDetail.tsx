import { memo } from 'react';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Spacer } from '@nextui-org/spacer';
import { useMediaQuery } from '@react-hookz/web';
import { useNavigate } from '@remix-run/react';
import { MimeType } from 'remix-image';
import tinycolor from 'tinycolor2';

import type { IMedia } from '~/types/media';
import type { IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import type { IEpisode } from '~/services/tmdb/tmdb.types';
import MediaList from '~/components/media/MediaList';
import ListEpisodes from '~/components/elements/shared/ListEpisodes';
import Rating from '~/components/elements/shared/Rating';
import PhotoIcon from '~/assets/icons/PhotoIcon';

import Image from '../Image';

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
  const isMd = useMediaQuery('(max-width: 768px)', { initializeWithValue: false });
  const colorBackground = tinycolor(color).isDark()
    ? tinycolor(color).brighten(40).saturate(70).spin(180).toString()
    : tinycolor(color).darken(40).saturate(70).spin(180).toString();

  return (
    <>
      {type === 'anime' || type === 'tv' ? (
        <>
          {type === 'anime' ? (
            <ListEpisodes
              type="anime"
              id={id}
              episodes={episodes}
              providers={providers || []}
              // episodeId
              // episodeNumber
            />
          ) : null}
          {type === 'tv' ? (
            <ListEpisodes
              type="tv"
              id={id}
              episodes={episodes}
              season={season}
              providers={providers || []}
            />
          ) : null}
          <Spacer y={10} />
        </>
      ) : null}
      <div className="flex flex-row items-start justify-start gap-3 rounded-xl bg-content1 p-2 sm:p-4">
        {!isMd &&
          (posterPath ? (
            <Image
              src={posterPath}
              alt={title}
              title={title}
              disableSkeleton={false}
              radius="lg"
              classNames={{
                base: 'w-full h-auto aspect-[2/3] min-w-[auto] min-h-[auto] max-w-[137px] lg:max-w-[158px] xl:max-w-[173px] 2xl:max-w-[239px]',
              }}
              loading="lazy"
              placeholder="empty"
              responsive={[
                {
                  size: {
                    width: 137,
                    height: 205,
                  },
                  maxWidth: 1024,
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
            <div className="flex items-center justify-center">
              <Avatar
                icon={<PhotoIcon width={48} height={48} />}
                radius="xl"
                classNames={{
                  base: 'z-0 w-[137px] h-auto aspect-[2/3] lg:w-[158px] xl:w-[173px] 2xl:w-[239px]',
                }}
              />
            </div>
          ))}
        <div className="flex w-full flex-col items-start justify-start gap-y-4">
          <h3 className="font-semibold text-default-900">{title}</h3>
          {type === 'movie' || type === 'tv' ? (
            <div className="flex flex-row gap-x-3">
              <Rating rating={tmdbRating?.toFixed(1)} ratingType="movie" />
              {imdbRating && (
                <>
                  <p className="mr-2 rounded-lg bg-[#ddb600] px-1 font-semibold text-black">IMDb</p>
                  <p className="font-semibold">{imdbRating}</p>
                </>
              )}
            </div>
          ) : null}
          {type === 'anime' && anilistRating ? (
            <Rating rating={anilistRating} ratingType="anime" />
          ) : null}
          <div className="flex w-full flex-row flex-wrap items-center justify-start gap-x-3">
            {(type === 'movie' || type === 'tv') &&
              genresMedia &&
              genresMedia.map((genre) => (
                <Button
                  key={genre?.id}
                  type="button"
                  size={isSm ? 'sm' : 'md'}
                  className="hover:opacity-80"
                  style={{
                    marginBottom: '0.125rem',
                    background: color,
                    color: colorBackground,
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
              ))}
            {type === 'anime' &&
              genresAnime &&
              genresAnime.map((genre, index) => (
                <Button
                  key={index}
                  type="button"
                  size={isSm ? 'sm' : 'md'}
                  className="hover:opacity-80"
                  onPress={() => navigate(`/discover/anime?genres=${genre}`)}
                  style={{
                    marginBottom: '0.125rem',
                    background: color,
                    color: colorBackground,
                  }}
                >
                  {genre}
                </Button>
              ))}
          </div>
          {type === 'movie' || type === 'tv' ? (
            <p style={{ textAlign: 'justify' }}>{overview}</p>
          ) : null}
          {type === 'anime' ? (
            <p
              style={{ textAlign: 'justify' }}
              dangerouslySetInnerHTML={{ __html: overview || '' }}
            />
          ) : null}
        </div>
      </div>
      <Spacer y={10} />
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
          <Spacer y={10} />
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
          <Spacer y={10} />
        </>
      ) : null}
    </>
  );
};

export default memo(WatchDetail);
