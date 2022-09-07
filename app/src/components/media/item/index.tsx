import { IMedia } from '~/services/tmdb/tmdb.types';
import BannerItem from './BannerItem';
import CardItem from './CardItem';

interface IMediaItem {
  type: 'banner' | 'card';
  item: IMedia;
  handlerWatchTrailer?: (id: number, type: 'movie' | 'tv') => void;
}

const MediaItem = (props: IMediaItem) => {
  const { type, item, handlerWatchTrailer } = props;

  if (type === 'banner') {
    return <BannerItem item={item} handler={handlerWatchTrailer} />;
  }
  return <CardItem item={item} />;
};

export default MediaItem;
export { default as BannerItem } from './BannerItem';
export { default as CartItem } from './CardItem';
export { default as RowItem } from './RowItem';
