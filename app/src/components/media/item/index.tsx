import { IMedia } from '~/services/tmdb/tmdb.types';
import BannerItem from './BannerItem';
import CardItem from './CardItem';

interface IMediaItem {
  type: 'banner' | 'card';
  item?: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  active?: boolean;
  isCoverCard?: boolean;
  coverItem?: { id: number; name: string; backdropPath: string };
  virtual?: boolean;
}

const MediaItem = (props: IMediaItem) => {
  const { type, item, genresMovie, genresTv, active, isCoverCard, coverItem, virtual } = props;

  if (type === 'banner') {
    return <BannerItem item={item} genresMovie={genresMovie} genresTv={genresTv} active={active} />;
  }
  return (
    <CardItem
      item={item}
      genresMovie={genresMovie}
      genresTv={genresTv}
      isCoverCard={isCoverCard}
      coverItem={coverItem}
      virtual={virtual}
    />
  );
};

export default MediaItem;
export { default as BannerItem } from './BannerItem';
export { default as CartItem } from './CardItem';
export { default as RowItem } from './RowItem';
