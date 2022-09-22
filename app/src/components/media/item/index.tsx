import { IMedia } from '~/services/tmdb/tmdb.types';
import { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';
import BannerItem from './BannerItem';
import CardItem from './CardItem';

interface IMediaItem {
  type: 'banner' | 'card';
  item: IMedia;
  handlerWatchTrailer?: (id: number, type: 'movie' | 'tv') => void;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  setShowTrailer?: React.Dispatch<React.SetStateAction<boolean>>;
  showTrailer?: boolean;
  trailer?: Trailer;
}

const MediaItem = (props: IMediaItem) => {
  const {
    type,
    item,
    handlerWatchTrailer,
    genresMovie,
    genresTv,
    setShowTrailer,
    showTrailer,
    trailer,
  } = props;

  if (type === 'banner') {
    return (
      <BannerItem
        item={item}
        handler={handlerWatchTrailer}
        genresMovie={genresMovie}
        genresTv={genresTv}
        setShowTrailer={setShowTrailer}
        showTrailer={showTrailer}
        trailer={trailer}
      />
    );
  }
  return <CardItem item={item} genresMovie={genresMovie} genresTv={genresTv} />;
};

export default MediaItem;
export { default as BannerItem } from './BannerItem';
export { default as CartItem } from './CardItem';
export { default as RowItem } from './RowItem';
