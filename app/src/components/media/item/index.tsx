import { Title } from '~/types/media';
import { ITrailer } from '~/services/consumet/anilist/anilist.types';
import BannerItem from './BannerItem';
import CardItem from './CardItem';

interface IMediaItem {
  active?: boolean;
  backdropPath?: string;
  color?: string;
  episodeNumber?: number;
  episodeTitle?: string;
  genreIds?: number[];
  genresAnime?: string[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  id?: number | string;
  isCoverCard?: boolean;
  mediaType?: 'movie' | 'tv' | 'anime';
  overview?: string;
  posterPath?: string;
  releaseDate?: string | number;
  title?: string | Title;
  trailer?: ITrailer;
  type: 'banner' | 'card' | 'episode';
  virtual?: boolean;
  voteAverage?: number;
}

const MediaItem = (props: IMediaItem) => {
  const {
    active,
    backdropPath,
    color,
    episodeNumber,
    episodeTitle,
    genreIds,
    genresAnime,
    genresMovie,
    genresTv,
    id,
    isCoverCard,
    mediaType,
    overview,
    posterPath,
    releaseDate,
    title,
    trailer,
    type,
    virtual,
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
      color={color}
      episodeNumber={episodeNumber}
      episodeTitle={episodeTitle}
      genreIds={genreIds || []}
      genresAnime={genresAnime || []}
      genresMovie={genresMovie}
      genresTv={genresTv}
      id={Number(id)}
      isCoverCard={isCoverCard}
      isEpisodeCard={type === 'episode'}
      mediaType={mediaType || 'movie'}
      overview={overview || ''}
      posterPath={posterPath || ''}
      releaseDate={releaseDate || ''}
      title={title || ''}
      trailer={trailer}
      virtual={virtual}
      voteAverage={voteAverage || 0}
    />
  );
};

export default MediaItem;
export { default as BannerItem } from './BannerItem';
export { default as CartItem } from './CardItem';
export { default as RowItem } from './RowItem';
