/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import { Spacer, Popover, Button, Divider } from '@nextui-org/react';

import { H6 } from '~/src/components/styles/Text.styles';
import ResizablePanel from '~/src/components/elements/shared/ResizablePanel';
import Flex from '~/src/components/styles/Flex.styles';

import Settings from '~/src/assets/icons/SettingsIcon.js';
import Arrow from '~/src/assets/icons/ArrowIcon.js';
import Tick from '~/src/assets/icons/TickIcon.js';
import Play from '~/src/assets/icons/PlayIcon.js';
import Flip from '~/src/assets/icons/FlipIcon.js';
import Ratio from '~/src/assets/icons/RatioIcon.js';
import Subtitle from '~/src/assets/icons/SubtitleIcon.js';

interface IPlayerSettingsProps {
  artplayer: Artplayer | null;
}

const PlayerSettings = (props: IPlayerSettingsProps) => {
  const { artplayer } = props;
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [dropdownLevelKey, setDropdownLevelKey] = useState('general');
  const currentPlaySpeed = useMemo(() => artplayer?.playbackRate, [artplayer]);
  const currentAspectRatio = useMemo(() => artplayer?.aspectRatio, [artplayer]);
  const currentVideoFlip = useMemo(() => artplayer?.flip, [artplayer]);
  const currentSubtitleOffset = useMemo(() => artplayer?.subtitleOffset, [artplayer]);
  const dropdownLevel = [
    {
      id: 'general',
      key: 'general',
      showTitle: false,
      listItems: [
        {
          id: 'play-speed',
          title: 'Play Speed',
          description: 'Change the playback speed',
          showIcon: true,
          icon: <Play type="circle2" />,
          action: () => setDropdownLevelKey('play-speed'),
          currentValue: currentPlaySpeed,
        },
        {
          id: 'aspect-ratio',
          title: 'Aspect Ratio',
          description: 'Change the aspect ratio',
          showIcon: true,
          icon: <Ratio />,
          action: () => setDropdownLevelKey('aspect-ratio'),
          currentValue: currentAspectRatio,
        },
        {
          id: 'video-flip',
          title: 'Video Flip',
          description: 'Flip the video horizontally or vertically',
          showIcon: true,
          icon: <Flip />,
          action: () => setDropdownLevelKey('video-flip'),
          currentValue: currentVideoFlip,
        },
        {
          id: 'subtitle-offset',
          title: 'Subtitle Offset',
          description: 'Change the subtitle offset',
          showIcon: true,
          icon: <Subtitle />,
          action: () => setDropdownLevelKey('subtitle-offset'),
          currentValue: currentSubtitleOffset,
        },
      ],
    },
    {
      id: 'play-speed',
      key: 'play-speed',
      showTitle: true,
      showBackButton: true,
      // backButtonAction: () => setDropdownLevelKey('general'),
      title: 'Play Speed',
      listItems: [
        {
          id: '0.5x',
          title: '0.5x',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.playbackRate = 0.5;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentPlaySpeed === 0.5,
        },
        {
          id: '0.75x',
          title: '0.75x',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.playbackRate = 0.75;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentPlaySpeed === 0.75,
        },
        {
          id: 'normal',
          title: 'Normal',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.playbackRate = 1.0;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentPlaySpeed === 1.0,
        },
        {
          id: '1.25x',
          title: '1.25x',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.playbackRate = 1.25;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentPlaySpeed === 1.25,
        },
        {
          id: '1.5x',
          title: '1.5x',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.playbackRate = 1.5;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentPlaySpeed === 1.5,
        },
        {
          id: '1.75x',
          title: '1.75x',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.playbackRate = 1.75;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentPlaySpeed === 1.75,
        },
        {
          id: '2x',
          title: '2x',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.playbackRate = 2.0;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentPlaySpeed === 2,
        },
      ],
    },
    {
      id: 'aspect-ratio',
      key: 'aspect-ratio',
      showTitle: true,
      showBackButton: true,
      // backButtonAction: () => setDropdownLevelKey('general'),
      title: 'Aspect Ratio',
      listItems: [
        {
          id: 'default',
          title: 'Default',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.aspectRatio = 'default';
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentAspectRatio === 'default',
        },
        {
          id: '16:9',
          title: '16:9',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.aspectRatio = '16:9';
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentAspectRatio === '16:9',
        },
        {
          id: '4:3',
          title: '4:3',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.aspectRatio = '4:3';
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentAspectRatio === '4:3',
        },
      ],
    },
    {
      id: 'video-flip',
      key: 'video-flip',
      showTitle: true,
      showBackButton: true,
      // backButtonAction: () => setDropdownLevelKey('general'),
      title: 'Video Flip',
      listItems: [
        {
          id: 'normal',
          title: 'Normal',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.flip = 'normal';
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentVideoFlip === 'normal',
        },
        {
          id: 'flip-horizontally',
          title: 'Flip Horizontally',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.flip = 'horizontally';
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentVideoFlip === 'horizontally',
        },
        {
          id: 'flip-vertically',
          title: 'Flip Vertically',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.flip = 'vertically';
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentVideoFlip === 'vertically',
        },
      ],
    },
    {
      id: 'subtitle-offset',
      key: 'subtitle-offset',
      showTitle: true,
      showBackButton: true,
      // backButtonAction: () => setDropdownLevelKey('general'),
      title: 'Subtitle Offset',
      listItems: [
        {
          id: '-5s',
          title: '-5s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = -5;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === -5,
        },
        {
          id: '-4s',
          title: '-4s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = -4;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === -4,
        },
        {
          id: '-3s',
          title: '-3s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = -3;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === -3,
        },
        {
          id: '-2s',
          title: '-2s',
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = -2;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === -2,
        },
        {
          id: '-1s',
          title: '-1s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = -1;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === -1,
        },
        {
          id: 'normal',
          title: 'Normal',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = 0;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === 0,
        },
        {
          id: '1s',
          title: '1s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = 1;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === 1,
        },
        {
          id: '2s',
          title: '2s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = 2;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === 2,
        },
        {
          id: '3s',
          title: '3s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = 3;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === 3,
        },
        {
          id: '4s',
          title: '4s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = 4;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === 4,
        },
        {
          id: '5s',
          title: '5s',
          showIcon: false,
          action: () => {
            if (artplayer) {
              artplayer.subtitleOffset = 5;
              // setDropdownLevelKey('general');
            }
          },
          isCurrent: currentSubtitleOffset === 5,
        },
      ],
    },
  ];
  const currentDropdownLevel = useMemo(
    () => dropdownLevel.find((level) => level.key === dropdownLevelKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dropdownLevelKey],
  );
  return (
    <Popover
      shouldFlip
      placement="bottom"
      isOpen={isSettingsOpen}
      onOpenChange={(isOpen) => setSettingsOpen(isOpen)}
      isBordered
      disableShadow
      onClose={() => setDropdownLevelKey('general')}
    >
      <Popover.Trigger>
        <Button auto light aria-label="dropdown" icon={<Settings filled />} />
      </Popover.Trigger>
      <Popover.Content>
        <ResizablePanel>
          {currentDropdownLevel ? (
            <Flex direction="column" align="start" justify="start" className="space-y-2 px-2 py-2">
              {currentDropdownLevel?.showBackButton || currentDropdownLevel?.showTitle ? (
                <>
                  <Flex direction="row" align="center" justify="between">
                    {currentDropdownLevel?.showBackButton ? (
                      <Button
                        auto
                        light
                        // onClick={currentDropdownLevel?.backButtonAction}
                        icon={<Arrow direction="left" />}
                      />
                    ) : null}
                    {currentDropdownLevel?.showTitle ? (
                      <H6 h6 css={{ margin: 0 }} weight="semibold">
                        {currentDropdownLevel?.title}
                      </H6>
                    ) : null}
                  </Flex>
                  <Divider />
                </>
              ) : null}
              <Flex
                direction="column"
                align="start"
                justify="start"
                className="space-y-2 px-2 py-2"
              >
                {currentDropdownLevel?.listItems.map((item) => (
                  <Button
                    key={item.id}
                    auto
                    light
                    onClick={item.action}
                    css={{
                      p: 0,
                      width: '100%',
                      '& span': {
                        '&.nextui-button-text': {
                          display: 'block',
                          width: '100%',
                        },
                      },
                    }}
                  >
                    <Flex direction="row" align="center" justify="between" className="space-x-8">
                      <Flex direction="row" align="center" className="space-x-2">
                        {item?.showIcon ? (
                          (
                            item as {
                              id: string;
                              title: string;
                              description: string;
                              showIcon: boolean;
                              icon: JSX.Element;
                              action: () => void;
                              currentValue: string;
                            }
                          )?.icon
                        ) : (
                            item as {
                              id: string;
                              title: string;
                              showIcon: boolean;
                              action: () => void;
                              isCurrent: boolean;
                            }
                          )?.isCurrent ? (
                          <Tick />
                        ) : (
                          <Spacer x={1.15} />
                        )}
                        <H6 h6 css={{ margin: 0 }} weight="semibold">
                          {item.title}
                        </H6>
                      </Flex>
                      <Flex direction="row" align="center" className="space-x-2">
                        <H6 h6 css={{ margin: 0, color: '$accents9' }} weight="thin">
                          {(
                            item as {
                              id: string;
                              title: string;
                              description: string;
                              showIcon: boolean;
                              icon: JSX.Element;
                              action: () => void;
                              currentValue: string;
                            }
                          )?.currentValue || ''}
                        </H6>
                        {item.showIcon ? <Arrow direction="right" /> : null}
                      </Flex>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}
        </ResizablePanel>
      </Popover.Content>
    </Popover>
  );
};

export default PlayerSettings;
