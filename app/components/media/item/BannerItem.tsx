import { Skeleton } from '@nextui-org/skeleton';
import { useMediaQuery } from '@react-hookz/web';

import type { Title } from '~/types/media';
import type { ITrailer } from '~/services/consumet/anilist/anilist.types';

import BannerItemDesktop from './BannerItemDesktop';
import BannerItemMobile from './BannerItemMobile';

interface IBannerItemProps {
  active?: boolean;
  backdropPath: string;
  genreIds: number[];
  genresAnime: string[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  id: number;
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
  overview: string;
  posterPath: string;
  title: string | Title;
  trailer?: ITrailer;
  voteAverage: number;
}

const BannerItem = (props: IBannerItemProps) => {
  const {
    active,
    backdropPath,
    genreIds,
    genresMovie,
    genresTv,
    genresAnime,
    id,
    mediaType,
    overview,
    posterPath,
    title,
    trailer,
    voteAverage,
  } = props;
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  if (isSm === true) {
    return (
      <BannerItemMobile
        active={active}
        posterPath={posterPath}
        genreIds={genreIds}
        genresMovie={genresMovie}
        genresTv={genresTv}
        id={id}
        mediaType={mediaType}
        title={title}
        voteAverage={voteAverage}
        genresAnime={genresAnime}
      />
    );
  }
  if (isSm === false) {
    return (
      <BannerItemDesktop
        active={active}
        backdropPath={backdropPath}
        genreIds={genreIds}
        genresAnime={genresAnime}
        genresMovie={genresMovie}
        genresTv={genresTv}
        id={id}
        mediaType={mediaType}
        overview={overview}
        posterPath={posterPath}
        title={title}
        trailer={trailer}
        voteAverage={voteAverage}
      />
    );
  }
  return <Skeleton className="aspect-[4/5] w-full sm:aspect-[16/8]" />;
};

export default BannerItem;
