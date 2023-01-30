/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState, memo } from 'react';
import type { CSSProperties } from 'react';
import { styled } from '@nextui-org/react';
import Artplayer from 'artplayer';
import { isMobile } from 'react-device-detect';
import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

import { useSoraSettings } from '~/hooks/useLocalStorage';

import usePlayerState from '~/store/player/usePlayerState';

import AspectRatio from '~/components/elements/aspect-ratio/AspectRatio';

interface IPlayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: any;
  getInstance: (art: Artplayer) => void;
  style?: CSSProperties | undefined;
}

const Player: React.FC<IPlayerProps> = (props: IPlayerProps) => {
  const { option, getInstance, style, ...rest } = props;
  const isMini = usePlayerState((state) => state.isMini);
  const [artplayer, setArtplayer] = useState<Artplayer | null>(null);
  const { isSwipeFullscreen } = useSoraSettings();
  const artRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
    if (artplayer && isSwipeFullscreen) {
      if (!artplayer.fullscreen && info.offset.y < -100) {
        artplayer.fullscreen = true;
      }
      if (artplayer.fullscreen && info.offset.y > 100) {
        artplayer.fullscreen = false;
      }
    }
  };
  useEffect(
    () => {
      const art = new Artplayer({
        container: artRef.current,
        ...option,
      });
      setArtplayer(art);
      if (getInstance && typeof getInstance === 'function') {
        getInstance(art);
      }
      return () => {
        if (art && art.destroy) {
          art.destroy(false);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <AspectRatio.Root ratio={isMini ? undefined : isMobile ? 16 / 9 : 7 / 3}>
      <motion.div
        ref={artRef}
        style={style}
        drag={isMobile && isSwipeFullscreen ? 'y' : false}
        whileDrag={{ scale: 1.2 }}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragSnapToOrigin
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        {...rest}
      />
    </AspectRatio.Root>
  );
};

const ArtPlayer = styled(Player, {
  '& p': {
    fontSize: 'inherit !important',
  },
});

export default memo(ArtPlayer);
