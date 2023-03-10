import { Modal } from '@nextui-org/react';
import YouTube, { YouTubeProps } from 'react-youtube';

import { useWindowSize } from '@react-hookz/web';
import { ITrailer } from '~/services/consumet/anilist/anilist.types';

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

type WatchTrailerModalProps = {
  trailer: Trailer | ITrailer;
  visible: boolean;
  closeHandler: () => void;
  currentTime?: number;
};

const WatchTrailerModal = ({
  trailer,
  visible,
  closeHandler,
  currentTime,
}: WatchTrailerModalProps) => {
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

  return (
    <Modal
      closeButton
      blur
      aria-labelledby="Watch Trailer"
      open={visible}
      onClose={closeHandler}
      className="!max-w-fit"
      noPadding
      autoMargin={false}
      width={width && width < 720 ? `${width}px` : '720px'}
    >
      <Modal.Body>
        {trailer && (
          <YouTube
            videoId={(trailer as Trailer).key || (trailer as ITrailer).id}
            opts={opts}
            onReady={({ target }) => {
              target.playVideo();
            }}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default WatchTrailerModal;
