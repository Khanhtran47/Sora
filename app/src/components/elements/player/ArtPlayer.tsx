/* eslint-disable no-nested-ternary */
import { useEffect, useRef, memo } from 'react';
import type { CSSProperties } from 'react';
import { styled } from '@nextui-org/react';
import Artplayer from 'artplayer';
import { isMobile } from 'react-device-detect';

import usePlayerState from '~/store/player/usePlayerState';

import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';

interface IPlayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: any;
  getInstance: (art: Artplayer) => void;
  style?: CSSProperties | undefined;
}

const Player: React.FC<IPlayerProps> = (props: IPlayerProps) => {
  const { option, getInstance, style, ...rest } = props;
  const isMini = usePlayerState((state) => state.isMini);

  const artRef = useRef<HTMLDivElement>(null);
  useEffect(
    () => {
      const art = new Artplayer({
        container: artRef.current,
        ...option,
      });
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
      <div ref={artRef} style={style} {...rest} />
    </AspectRatio.Root>
  );
};

const ArtPlayer = styled(Player, {
  '& p': {
    fontSize: 'inherit !important',
  },
});

export default memo(ArtPlayer);
