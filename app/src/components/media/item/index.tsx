import { IMedia } from '~/services/tmdb/tmdb.types';
import BannerItem from './BannerItem';
import CardItem from './CardItem';

interface IMediaItem {
  type: 'banner' | 'card';
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  active?: boolean;
}

const MediaItem = (props: IMediaItem) => {
  const { type, item, genresMovie, genresTv, active } = props;

  if (type === 'banner') {
    return <BannerItem item={item} genresMovie={genresMovie} genresTv={genresTv} active={active} />;
  }
  return <CardItem item={item} genresMovie={genresMovie} genresTv={genresTv} />;
};

export default MediaItem;
export { default as BannerItem } from './BannerItem';
export { default as CartItem } from './CardItem';
export { default as RowItem } from './RowItem';
