import { IAnimeResult, IAnimeEpisode } from '~/services/consumet/anilist/anilist.types';
import AnimeBannerItem from './AnimeBannerItem';
import AnimeCardItem from './AnimeCardItem';
import AnimeEpisodeCardItem from './AnimeEpisodeCardItem';

interface IAnimeItem {
  type: 'banner' | 'card' | 'episode-card';
  item: IAnimeResult | IAnimeEpisode;
  active?: boolean;
  virtual?: boolean;
}

const AnimeItem = (props: IAnimeItem) => {
  const { type, item, active, virtual } = props;

  if (type === 'banner') {
    return <AnimeBannerItem item={item as IAnimeResult} active={active} />;
  }
  if (type === 'episode-card') {
    return <AnimeEpisodeCardItem item={item as IAnimeEpisode} virtual={virtual} />;
  }
  return <AnimeCardItem item={item as IAnimeResult} virtual={virtual} />;
};

export default AnimeItem;
export { default as AnimeBannerItem } from './AnimeBannerItem';
export { default as AnimeCardItem } from './AnimeCardItem';
