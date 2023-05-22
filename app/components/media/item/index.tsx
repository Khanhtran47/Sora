import type { IMedia, Title } from '~/types/media';
import type { ITrailer } from '~/services/consumet/anilist/anilist.types';

import BannerItem from './BannerItem';
import CardItem from './CardItem';

interface IMediaItem {
  active?: boolean; // help for detecting active banner, require when type is banner
  backdropPath?: string; // value is backdrop path of media
  character?: string; // value is character name, can exist when media type is people
  color?: string; // value is color of banner image, can exist when media type is anime
  episodeNumber?: number; // value is episode number, require when type is episode
  episodeTitle?: string; // value is episode title, require when type is episode
  genreIds?: number[]; // value is genres of a movie or tv-series, require when type is movie or tv
  genresAnime?: string[]; // value is genres of an anime, require when type is anime
  genresMovie?: { [id: string]: string }; // value is all genres of movies, require when type is movie
  genresTv?: { [id: string]: string }; // value is all genres of tv-series, require when type is tv
  id?: number | string; // value is id of media
  isCoverCard?: boolean; // value is true if the cover card is active
  isCreditsCard?: boolean; // value is true if the card is in people's credits
  isSliderCard?: boolean; // value is true if the card is in slider
  job?: string; // value is job of a person, can exist when media type is people
  knownFor?: IMedia[]; // value is known for of a person, can exist when media type is people
  linkTo?: string; // value is link to media detail page
  mediaType?: 'movie' | 'tv' | 'anime' | 'people'; // value is type of media
  overview?: string; // value is overview of media
  posterPath?: string; // value is poster path of media
  releaseDate?: string | number; // value is release date of media
  title?: string | Title; // value is title of media
  trailer?: ITrailer; // value is trailer of media
  type: 'banner' | 'card' | 'episode'; // value is type of media item
  voteAverage?: number; // value is vote average of media
}

const MediaItem = (props: IMediaItem) => {
  const {
    active,
    backdropPath,
    character,
    color,
    episodeNumber,
    episodeTitle,
    genreIds,
    genresAnime,
    genresMovie,
    genresTv,
    id,
    isCoverCard,
    isCreditsCard,
    isSliderCard,
    job,
    knownFor,
    linkTo,
    mediaType,
    overview,
    posterPath,
    releaseDate,
    title,
    trailer,
    type,
    voteAverage,
  } = props;

  if (type === 'banner') {
    return (
      <BannerItem
        active={active}
        backdropPath={backdropPath || ''}
        genreIds={genreIds || []}
        genresAnime={genresAnime || []}
        genresMovie={genresMovie}
        genresTv={genresTv}
        id={Number(id)}
        mediaType={mediaType || 'movie'}
        overview={overview || ''}
        posterPath={posterPath || ''}
        title={title || ''}
        trailer={trailer}
        voteAverage={voteAverage || 0}
      />
    );
  }
  return (
    <CardItem
      backdropPath={backdropPath || ''}
      character={character || ''}
      color={color}
      episodeNumber={episodeNumber}
      episodeTitle={episodeTitle}
      genreIds={genreIds || []}
      genresAnime={genresAnime || []}
      genresMovie={genresMovie}
      genresTv={genresTv}
      id={Number(id)}
      isCoverCard={isCoverCard}
      isSliderCard={isSliderCard}
      isEpisodeCard={type === 'episode'}
      job={job || ''}
      knownFor={knownFor}
      linkTo={linkTo || ''}
      mediaType={mediaType || 'movie'}
      overview={overview || ''}
      posterPath={posterPath || ''}
      releaseDate={releaseDate || ''}
      title={title || ''}
      trailer={trailer}
      voteAverage={voteAverage || 0}
      isCreditsCard={isCreditsCard}
    />
  );
};

export default MediaItem;
export { default as BannerItem } from './BannerItem';
export { default as CartItem } from './CardItem';
