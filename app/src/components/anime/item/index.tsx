import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import AnimeBannerItem from './AnimeBannerItem';
import AnimeCardItem from './AnimeCardItem';

interface IAnimeItem {
  type: 'banner' | 'card';
  item: IAnimeResult;
  active?: boolean;
}

const AnimeItem = (props: IAnimeItem) => {
  const { type, item, active } = props;

  if (type === 'banner') {
    return <AnimeBannerItem item={item} active={active} />;
  }
  return <AnimeCardItem item={item} />;
};

export default AnimeItem;
export { default as AnimeBannerItem } from './AnimeBannerItem';
export { default as AnimeCardItem } from './AnimeCardItem';
