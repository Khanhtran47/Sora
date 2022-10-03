import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import AnimeBannerItem from './AnimeBannerItem';
import AnimeCardItem from './AnimeCardItem';

interface IAnimeItem {
  type: 'banner' | 'card';
  item: IAnimeResult;
  active?: boolean;
  virtual?: boolean;
}

const AnimeItem = (props: IAnimeItem) => {
  const { type, item, active, virtual } = props;

  if (type === 'banner') {
    return <AnimeBannerItem item={item} active={active} />;
  }
  return <AnimeCardItem item={item} virtual={virtual} />;
};

export default AnimeItem;
export { default as AnimeBannerItem } from './AnimeBannerItem';
export { default as AnimeCardItem } from './AnimeCardItem';
