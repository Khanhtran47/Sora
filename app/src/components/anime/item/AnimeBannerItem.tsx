import useMediaQuery from '~/hooks/useMediaQuery';
import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import AnimeBannerItemMobile from './AnimeBannerItemMobile';
import AnimeBannerItemDesktop from './AnimeBannerItemDesktop';

type BannerItemProps = {
  item: IAnimeResult;
  active?: boolean;
};

const BannerItem = ({ item, active }: BannerItemProps) => {
  const isSm = useMediaQuery('(max-width: 650px)');

  if (isSm) {
    return <AnimeBannerItemMobile item={item} />;
  }
  return <AnimeBannerItemDesktop item={item} active={active} />;
};

export default BannerItem;
