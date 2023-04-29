/* eslint-disable no-nested-ternary */
import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { Button } from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';
import Artplayer from 'artplayer';
import { isMobile } from 'react-device-detect';

import usePlayerState from '~/store/player/usePlayerState';
import AspectRatio from '~/components/elements/aspect-ratio/AspectRatio';
import { H5 } from '~/components/styles/Text.styles';
import Close from '~/assets/icons/CloseIcon';

interface IPlayerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: any;
  getInstance: (art: Artplayer) => void;
  style?: CSSProperties | undefined;
  className?: string;
  setIsPlayerPlaying: Dispatch<SetStateAction<boolean>>;
}

const Player: React.FC<IPlayerProps> = (props: IPlayerProps) => {
  const { option, getInstance, style, className, setIsPlayerPlaying, ...rest } = props;
  const navigate = useNavigate();
  const {
    isMini,
    setIsMini,
    setShouldShowPlayer,
    routePlayer,
    setRoutePlayer,
    titlePlayer,
    setTitlePlayer,
    setPlayerData,
    setQualitySelector,
    setSubtitleSelector,
  } = usePlayerState((state) => state);
  const [artplayer, setArtplayer] = useState<Artplayer | null>(null);
  // const { isSwipeFullscreen } = useSoraSettings();
  const artRef = useRef<HTMLDivElement>(null);

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleDragEnd = (event: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
  //   if (artplayer && isSwipeFullscreen.value) {
  //     if (!artplayer.fullscreen && info.offset.y < -100) {
  //       artplayer.fullscreen = true;
  //     }
  //     if (artplayer.fullscreen && info.offset.y > 100) {
  //       artplayer.fullscreen = false;
  //     }
  //   }
  // };
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
    <AspectRatio.Root
      ratio={isMini ? undefined : isMobile ? 16 / 9 : 7 / 3}
      className={isMini ? 'overflow-hidden rounded-lg' : ''}
    >
      <div
        ref={artRef}
        style={style}
        className={className}
        // drag={isMobile && isSwipeFullscreen ? 'y' : false}
        // whileDrag={{ scale: 1.2 }}
        // dragConstraints={{ top: 0, bottom: 0 }}
        // dragSnapToOrigin
        // dragElastic={0.8}
        // onDragEnd={handleDragEnd}
        {...rest}
      />
      {isMini ? (
        <div className="inset-x-0 bottom-[-64px] flex h-16 flex-row items-center justify-between rounded-b-lg bg-background-contrast p-3">
          <H5
            h5
            weight="bold"
            onClick={() => navigate(routePlayer)}
            className="line-clamp-1"
            css={{ cursor: 'pointer' }}
            title={titlePlayer}
          >
            {titlePlayer}
          </H5>
          <Button
            type="button"
            auto
            light
            onPress={() => {
              if (artplayer) artplayer.destroy();
              setShouldShowPlayer(false);
              setPlayerData(undefined);
              setIsMini(false);
              setRoutePlayer('');
              setTitlePlayer('');
              setQualitySelector([]);
              setSubtitleSelector([]);
              setIsPlayerPlaying(false);
            }}
            icon={<Close />}
          />
        </div>
      ) : null}
    </AspectRatio.Root>
  );
};

export default memo(Player);
