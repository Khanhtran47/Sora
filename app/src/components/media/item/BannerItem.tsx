import useMediaQuery from '~/hooks/useMediaQuery';
import { IMedia } from '~/services/tmdb/tmdb.types';
import BannerItemMobile from './BannerItemMobile';
import BannerItemDesktop from './BannerItemDesktop';

type BannerItemProps = {
  item?: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  active?: boolean;
};

const BannerItem = ({ item, genresMovie, genresTv, active }: BannerItemProps) => {
  const isSm = useMediaQuery('(max-width: 650px)');
  if (isSm) {
    return <BannerItemMobile item={item} genresMovie={genresMovie} genresTv={genresTv} />;
  }
  return (
    <BannerItemDesktop item={item} genresMovie={genresMovie} genresTv={genresTv} active={active} />
  );
};

export default BannerItem;
