import { useWindowSize } from '@react-hookz/web';
import YouTube, { type YouTubeProps } from 'react-youtube';

import { type ITrailer } from '~/services/consumet/anilist/anilist.types';

export type Trailer = {
  iso_639_1?: string;
  iso_3166_1?: string;
  name?: string;
  key?: string;
  site?: string;
  size?: number;
  type?: string;
  official?: boolean;
  published_at?: string;
  id?: string;
};

type WatchTrailerProps = {
  trailer: Trailer | ITrailer;
  currentTime?: number;
};

const WatchTrailer = ({ trailer, currentTime }: WatchTrailerProps) => {
  const { width } = useWindowSize();
  const opts: YouTubeProps['opts'] = {
    height: `${width && width < 720 ? width / 1.5 : 480}`,
    width: `${width && width < 720 ? width : 720}`,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      modestbranding: 1,
      controls: 1,
      start: currentTime || 0,
    },
  };

  if (trailer) {
    return (
      <YouTube
        videoId={(trailer as Trailer).key || (trailer as ITrailer).id}
        opts={opts}
        onReady={({ target }) => {
          target.playVideo();
        }}
      />
    );
  }
  return <h4>No trailer found</h4>;
};

export default WatchTrailer;
