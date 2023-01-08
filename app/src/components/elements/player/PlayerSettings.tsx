/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import { Spacer, Button, Divider, Switch, SwitchEvent } from '@nextui-org/react';
import { isMobileOnly } from 'react-device-detect';

import useLocalStorage from '~/hooks/useLocalStorage';

import { H6 } from '~/src/components/styles/Text.styles';
import ResizablePanel from '~/src/components/elements/shared/ResizablePanel';
import Flex from '~/src/components/styles/Flex.styles';
import Box from '~/src/components/styles/Box.styles';
import { Popover, PopoverTrigger, PopoverContent } from '~/src/components/elements/shared/Popover';
import { Sheet, SheetTrigger, SheetContent } from '~/src/components/elements/shared/Sheet';

import Settings from '~/src/assets/icons/SettingsIcon.js';
import Arrow from '~/src/assets/icons/ArrowIcon.js';
import Tick from '~/src/assets/icons/TickIcon.js';
import Play from '~/src/assets/icons/PlayIcon.js';
import Flip from '~/src/assets/icons/FlipIcon.js';
import Ratio from '~/src/assets/icons/RatioIcon.js';
import Subtitle from '~/src/assets/icons/SubtitleIcon.js';
import Filter from '~/src/assets/icons/FilterIcon.js';
import Search from '~/src/assets/icons/SearchIcon.js';

interface IPlayerSettingsProps {
  artplayer: Artplayer | null;
  qualitySelector?: {
    html: string;
    url: string;
    default?: boolean;
    isM3U8?: boolean;
    isDASH?: boolean;
  }[];
  subtitleSelector?: { html: string; url: string; default?: boolean }[];
  isPlayerFullScreen?: boolean;
  isSettingsOpen: boolean;
  showSubtitle: boolean;
  setShowSubtitle: React.Dispatch<React.SetStateAction<boolean>>;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerSettings = (props: IPlayerSettingsProps) => {
  const {
    artplayer,
    qualitySelector,
    subtitleSelector,
    isPlayerFullScreen,
    isSettingsOpen,
    showSubtitle,
    setShowSubtitle,
    setSettingsOpen,
    setSearchModalVisible,
  } = props;

  const [dropdownLevelKey, setDropdownLevelKey] = useState('general');
  const [currentPlaySpeed, setCurrentPlaySpeed] = useState('Normal');
  const [currentAspectRatio, setCurrentAspectRatio] = useState('Default');
  const [currentVideoFlip, setCurrentVideoFlip] = useState('Normal');
  const [currentQuality, setCurrentQuality] = useState(
    qualitySelector?.find((quality) => quality.default === true)?.html || 'Auto',
  );
  const [currentSubtitle, setCurrentSubtitle] = useState(
    subtitleSelector?.find((subtitle) => subtitle.default === true)?.html || 'English',
  );
  const [currentSubtitleOffset, setCurrentSubtitleOffset] = useState('Normal');

  const [currentSubtitleFontColor, setCurrentSubtitleFontColor] = useLocalStorage(
    'sora-settings_subtitle_font-color',
    'White',
  );
  const [currentSubtitleFontSize, setCurrentSubtitleFontSize] = useLocalStorage(
    'sora-settings_subtitle_font-size',
    '100%',
  );
  const [currentSubtitleBackgroundColor, setCurrentSubtitleBackgroundColor] = useLocalStorage(
    'sora-settings_subtitle_background-color',
    'Black',
  );
  const [currentSubtitleBackgroundOpacity, setCurrentSubtitleBackgroundOpacity] = useLocalStorage(
    'sora-settings_subtitle_background-opacity',
    '0%',
  );
  const [currentSubtitleWindowColor, setCurrentSubtitleWindowColor] = useLocalStorage(
    'sora-settings_subtitle_window-color',
    'Black',
  );
  const [currentSubtitleWindowOpacity, setCurrentSubtitleWindowOpacity] = useLocalStorage(
    'sora-settings_subtitle_window-opacity',
    '0%',
  );

  const dropdownLevel = useMemo(
    () => {
      const level: {
        id: string;
        key: string;
        showTitle: boolean;
        showBackButton?: boolean;
        backButtonAction?: () => void;
        title?: string;
        showExtraButton?: boolean;
        extraButtonAction?: () => void;
        extraButtonTitle?: string;
        listItems: {
          id: string;
          title: string;
          description?: string;
          showIcon?: boolean;
          icon?: JSX.Element;
          action?: () => void;
          currentValue?: string;
          isCurrent?: boolean;
          isSwitch?: boolean;
          isSwitchOn?: boolean;
          switchAction?: (e: SwitchEvent) => void;
        }[];
      }[] = [
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
              description: 'Flip the video horizontal or vertical',
              showIcon: true,
              icon: <Flip />,
              action: () => setDropdownLevelKey('video-flip'),
              currentValue: currentVideoFlip,
            },
            ...(qualitySelector
              ? [
                  {
                    id: 'quality',
                    title: 'Quality',
                    description: 'Change the video quality',
                    showIcon: true,
                    icon: <Filter />,
                    action: () => setDropdownLevelKey('quality'),
                    currentValue: currentQuality,
                  },
                ]
              : []),
            ...(subtitleSelector
              ? [
                  {
                    id: 'subtitle',
                    title: 'Subtitle',
                    description: 'Change the subtitle',
                    showIcon: true,
                    icon: <Subtitle filled />,
                    action: () => setDropdownLevelKey('subtitle'),
                    currentValue: currentSubtitle,
                  },
                ]
              : []),
          ],
        },
        {
          id: 'play-speed',
          key: 'play-speed',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('general'),
          title: 'Play Speed',
          listItems: [
            {
              id: '0.5x',
              title: '0.5x',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.playbackRate = 0.5;
                  setCurrentPlaySpeed('0.5x');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentPlaySpeed === '0.5x',
            },
            {
              id: '0.75x',
              title: '0.75x',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.playbackRate = 0.75;
                  setCurrentPlaySpeed('0.75x');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentPlaySpeed === '0.75x',
            },
            {
              id: 'normal',
              title: 'Normal',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.playbackRate = 1.0;
                  setCurrentPlaySpeed('Normal');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentPlaySpeed === 'Normal',
            },
            {
              id: '1.25x',
              title: '1.25x',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.playbackRate = 1.25;
                  setCurrentPlaySpeed('1.25x');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentPlaySpeed === '1.25x',
            },
            {
              id: '1.5x',
              title: '1.5x',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.playbackRate = 1.5;
                  setCurrentPlaySpeed('1.5x');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentPlaySpeed === '1.5x',
            },
            {
              id: '1.75x',
              title: '1.75x',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.playbackRate = 1.75;
                  setCurrentPlaySpeed('1.75x');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentPlaySpeed === '1.75x',
            },
            {
              id: '2x',
              title: '2x',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.playbackRate = 2.0;
                  setCurrentPlaySpeed('2x');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentPlaySpeed === '2x',
            },
          ],
        },
        {
          id: 'aspect-ratio',
          key: 'aspect-ratio',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('general'),
          title: 'Aspect Ratio',
          listItems: [
            {
              id: 'default',
              title: 'Default',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.aspectRatio = 'default';
                  setCurrentAspectRatio('Default');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentAspectRatio === 'Default',
            },
            {
              id: '16:9',
              title: '16:9',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.aspectRatio = '16:9';
                  setCurrentAspectRatio('16:9');
                  setDropdownLevelKey('general');
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
                  setCurrentAspectRatio('4:3');
                  setDropdownLevelKey('general');
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
          backButtonAction: () => setDropdownLevelKey('general'),
          title: 'Video Flip',
          listItems: [
            {
              id: 'normal',
              title: 'Normal',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.flip = 'normal';
                  setCurrentVideoFlip('Normal');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentVideoFlip === 'Normal',
            },
            {
              id: 'flip-horizontal',
              title: 'Flip Horizontal',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.flip = 'horizontal';
                  setCurrentVideoFlip('Horizontal');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentVideoFlip === 'Horizontal',
            },
            {
              id: 'flip-vertical',
              title: 'Flip Vertical',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.flip = 'vertical';
                  setCurrentVideoFlip('Vertical');
                  setDropdownLevelKey('general');
                }
              },
              isCurrent: currentVideoFlip === 'Vertical',
            },
          ],
        },
        {
          id: 'subtitle',
          key: 'subtitle',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('general'),
          title: 'Subtitle',
          showExtraButton: true,
          extraButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          extraButtonTitle: 'Subtitle Settings',
          listItems: [
            {
              id: 'toggle-subtitle',
              title: 'Show Subtitle',
              showIcon: false,
              action: undefined,
              isSwitch: true,
              isSwitchOn: showSubtitle,
              switchAction: (e: SwitchEvent) => {
                if (artplayer) {
                  artplayer.subtitle.show = e.target.checked;
                  setShowSubtitle(e.target.checked);
                }
              },
            },
            {
              id: 'search-subtitle',
              title: 'Search Subtitle',
              showIcon: true,
              icon: <Search />,
              action: () => setSearchModalVisible(true),
            },
            ...(subtitleSelector
              ? subtitleSelector.map((subtitle) => ({
                  id: subtitle.html,
                  title: subtitle.html,
                  showIcon: false,
                  action: () => {
                    if (artplayer) {
                      artplayer.subtitle.switch(subtitle.url, { name: subtitle.html });
                      setCurrentSubtitle(subtitle.html);
                      setDropdownLevelKey('general');
                    }
                  },
                  isCurrent: currentSubtitle === subtitle.html,
                }))
              : []),
          ],
        },
        {
          id: 'subtitle-settings',
          key: 'subtitle-settings',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle'),
          title: 'Subtitle Settings',
          listItems: [
            {
              id: 'subtitle-offset',
              title: 'Offset',
              description: 'Change the subtitle offset',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-offset'),
              currentValue: currentSubtitleOffset,
            },
            {
              id: 'subtitle-font-color',
              title: 'Font Color',
              description: 'Change the subtitle font color',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-font-color'),
              currentValue: currentSubtitleFontColor,
            },
            {
              id: 'subtitle-font-size',
              title: 'Font Size',
              description: 'Change the subtitle font size',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-font-size'),
              currentValue: currentSubtitleFontSize,
            },
            {
              id: 'subtitle-background-color',
              title: 'Background Color',
              description: 'Change the subtitle background color',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-background-color'),
              currentValue: currentSubtitleBackgroundColor,
            },
            {
              id: 'subtitle-background-opacity',
              title: 'Background Opacity',
              description: 'Change the subtitle background opacity',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-background-opacity'),
              currentValue: currentSubtitleBackgroundOpacity,
            },
            {
              id: 'subtitle-window-color',
              title: 'Window Color',
              description: 'Change the subtitle window color',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-window-color'),
              currentValue: currentSubtitleWindowColor,
            },
            {
              id: 'subtitle-window-opacity',
              title: 'Window Opacity',
              description: 'Change the subtitle window opacity',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-window-opacity'),
              currentValue: currentSubtitleWindowOpacity,
            },
            {
              id: 'subtitle-reset',
              title: 'Reset',
              description: 'Reset the subtitle settings',
              showIcon: true,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = 0;
                  artplayer.subtitle.style({
                    color: '#fff',
                    fontSize: `${artplayer.height * 0.05}px`,
                  });
                  setCurrentSubtitleOffset('Normal');
                  setCurrentSubtitleFontColor('White');
                  setCurrentSubtitleFontSize('100%');
                  setCurrentSubtitleBackgroundColor('Black');
                  setCurrentSubtitleBackgroundOpacity('0%');
                  setCurrentSubtitleWindowColor('Black');
                  setCurrentSubtitleWindowOpacity('0%');
                  setDropdownLevelKey('subtitle');
                }
              },
            },
          ],
        },
        {
          id: 'subtitle-offset',
          key: 'subtitle-offset',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          title: 'Subtitle Offset',
          listItems: [
            {
              id: '-5s',
              title: '-5s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = -5;
                  setCurrentSubtitleOffset('-5s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '-5s',
            },
            {
              id: '-4s',
              title: '-4s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = -4;
                  setCurrentSubtitleOffset('-4s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '-4s',
            },
            {
              id: '-3s',
              title: '-3s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = -3;
                  setCurrentSubtitleOffset('-3s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '-3s',
            },
            {
              id: '-2s',
              title: '-2s',
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = -2;
                  setCurrentSubtitleOffset('-2s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '-2s',
            },
            {
              id: '-1s',
              title: '-1s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = -1;
                  setCurrentSubtitleOffset('-1s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '-1s',
            },
            {
              id: 'normal',
              title: 'Normal',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = 0;
                  setCurrentSubtitleOffset('Normal');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === 'Normal',
            },
            {
              id: '1s',
              title: '1s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = 1;
                  setCurrentSubtitleOffset('1s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '1s',
            },
            {
              id: '2s',
              title: '2s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = 2;
                  setCurrentSubtitleOffset('2s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '2s',
            },
            {
              id: '3s',
              title: '3s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = 3;
                  setCurrentSubtitleOffset('3s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '3s',
            },
            {
              id: '4s',
              title: '4s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = 4;
                  setCurrentSubtitleOffset('4s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '4s',
            },
            {
              id: '5s',
              title: '5s',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitleOffset = 5;
                  setCurrentSubtitleOffset('5s');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleOffset === '5s',
            },
          ],
        },
        {
          id: 'subtitle-font-color',
          key: 'subtitle-font-color',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          title: 'Font Color',
          listItems: [
            {
              id: 'white',
              title: 'White',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#fff',
                  });
                  setCurrentSubtitleFontColor('White');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'White',
            },
            {
              id: 'blue',
              title: 'Blue',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#0072F5',
                  });
                  setCurrentSubtitleFontColor('Blue');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'Blue',
            },
            {
              id: 'purple',
              title: 'Purple',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#7828C8',
                  });
                  setCurrentSubtitleFontColor('Purple');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'Purple',
            },
            {
              id: 'green',
              title: 'Green',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#17C964',
                  });
                  setCurrentSubtitleFontColor('Green');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'Green',
            },
            {
              id: 'yellow',
              title: 'Yellow',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#F5A524',
                  });
                  setCurrentSubtitleFontColor('Yellow');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'Yellow',
            },
            {
              id: 'red',
              title: 'Red',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#F31260',
                  });
                  setCurrentSubtitleFontColor('Red');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'Red',
            },
            {
              id: 'cyan',
              title: 'Cyan',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#06B7DB',
                  });
                  setCurrentSubtitleFontColor('Cyan');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'Cyan',
            },
            {
              id: 'pink',
              title: 'Pink',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#FF4ECD',
                  });
                  setCurrentSubtitleFontColor('Pink');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'Pink',
            },
            {
              id: 'black',
              title: 'Black',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    color: '#000',
                  });
                  setCurrentSubtitleFontColor('Black');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor === 'Black',
            },
          ],
        },
        {
          id: 'subtitle-font-size',
          key: 'subtitle-font-size',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          title: 'Font Size',
          listItems: [
            {
              id: '50%',
              title: '50%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05 * 0.5}px`,
                  });
                  setCurrentSubtitleFontSize('50%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize === '50%',
            },
            {
              id: '75%',
              title: '75%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05 * 0.75}px`,
                  });
                  setCurrentSubtitleFontSize('75%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize === '75%',
            },
            {
              id: '100%',
              title: '100%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05}px`,
                  });
                  setCurrentSubtitleFontSize('100%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize === '100%',
            },
            {
              id: '150%',
              title: '150%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05 * 1.5}px`,
                  });
                  setCurrentSubtitleFontSize('150%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize === '150%',
            },
            {
              id: '200%',
              title: '200%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05 * 2.0}px`,
                  });
                  setCurrentSubtitleFontSize('200%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize === '200%',
            },
            {
              id: '300%',
              title: '300%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05 * 3.0}px`,
                  });
                  setCurrentSubtitleFontSize('300%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize === '300%',
            },
            {
              id: '400%',
              title: '400%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05 * 4.0}px`,
                  });
                  setCurrentSubtitleFontSize('400%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize === '400%',
            },
          ],
        },
        {
          id: 'subtitle-background-color',
          key: 'subtitle-background-color',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          title: 'Background Color',
          listItems: [
            {
              id: 'black',
              title: 'Black',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('Black');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'Black',
            },
            {
              id: 'blue',
              title: 'Blue',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('Blue');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'Blue',
            },
            {
              id: 'purple',
              title: 'Purple',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('Purple');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'Purple',
            },
            {
              id: 'green',
              title: 'Green',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('Green');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'Green',
            },
            {
              id: 'yellow',
              title: 'Yellow',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('Yellow');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'Yellow',
            },
            {
              id: 'red',
              title: 'Red',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('Red');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'Red',
            },
            {
              id: 'cyan',
              title: 'Cyan',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('Cyan');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'Cyan',
            },
            {
              id: 'pink',
              title: 'Pink',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('Pink');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'Pink',
            },
            {
              id: 'white',
              title: 'White',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundColor('White');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor === 'White',
            },
          ],
        },
        {
          id: 'subtitle-background-opacity',
          key: 'subtitle-background-opacity',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          title: 'Background Opacity',
          listItems: [
            {
              id: '0%',
              title: '0%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundOpacity('0%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity === '0%',
            },
            {
              id: '25%',
              title: '25%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundOpacity('25%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity === '25%',
            },
            {
              id: '50%',
              title: '50%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundOpacity('50%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity === '50%',
            },
            {
              id: '75%',
              title: '75%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundOpacity('75%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity === '75%',
            },
            {
              id: '100%',
              title: '100%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleBackgroundOpacity('100%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity === '100%',
            },
          ],
        },
        {
          id: 'subtitle-window-color',
          key: 'subtitle-window-color',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          title: 'Window Color',
          listItems: [
            {
              id: 'black',
              title: 'Black',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('Black');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'Black',
            },
            {
              id: 'blue',
              title: 'Blue',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('Blue');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'Blue',
            },
            {
              id: 'purple',
              title: 'Purple',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('Purple');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'Purple',
            },
            {
              id: 'green',
              title: 'Green',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('Green');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'Green',
            },
            {
              id: 'yellow',
              title: 'Yellow',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('Yellow');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'Yellow',
            },
            {
              id: 'red',
              title: 'Red',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('Red');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'Red',
            },
            {
              id: 'cyan',
              title: 'Cyan',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('Cyan');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'Cyan',
            },
            {
              id: 'pink',
              title: 'Pink',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('Pink');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'Pink',
            },
            {
              id: 'white',
              title: 'White',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowColor('White');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor === 'White',
            },
          ],
        },
        {
          id: 'subtitle-window-opacity',
          key: 'subtitle-window-opacity',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          title: 'Window Opacity',
          listItems: [
            {
              id: '0%',
              title: '0%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowOpacity('0%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity === '0%',
            },
            {
              id: '25%',
              title: '25%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowOpacity('25%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity === '25%',
            },
            {
              id: '50%',
              title: '50%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowOpacity('50%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity === '50%',
            },
            {
              id: '75%',
              title: '75%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowOpacity('75%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity === '75%',
            },
            {
              id: '100%',
              title: '100%',
              showIcon: false,
              action: () => {
                setCurrentSubtitleWindowOpacity('100%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity === '100%',
            },
          ],
        },
      ];
      if (qualitySelector) {
        level.push({
          id: 'quality',
          key: 'quality',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('general'),
          title: 'Quality',
          listItems: qualitySelector.map((quality) => ({
            id: quality.html,
            title: quality.html,
            showIcon: false,
            action: () => {
              if (artplayer) {
                artplayer.switchQuality(quality.url);
                setCurrentQuality(quality.html);
                setDropdownLevelKey('general');
              }
            },
            isCurrent: currentQuality === quality.html,
          })),
        });
      }
      return level;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      qualitySelector,
      subtitleSelector,
      currentSubtitle,
      currentQuality,
      currentPlaySpeed,
      currentAspectRatio,
      currentVideoFlip,
      currentSubtitleOffset,
      currentSubtitleFontColor,
      currentSubtitleFontSize,
      currentSubtitleBackgroundColor,
      currentSubtitleBackgroundOpacity,
      currentSubtitleWindowColor,
      currentSubtitleWindowOpacity,
    ],
  );
  const currentDropdownLevel = useMemo(
    () => dropdownLevel.find((level) => level.key === dropdownLevelKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dropdownLevelKey],
  );
  if (isMobileOnly) {
    return (
      <Sheet
        onOpenChange={(open) => {
          if (!open) setDropdownLevelKey('general');
        }}
      >
        <SheetTrigger asChild>
          <Button
            auto
            light
            aria-label="dropdown"
            icon={<Settings filled />}
            css={{ color: '#eee' }}
          />
        </SheetTrigger>
        <SheetContent
          side="bottom"
          hideCloseButton
          // portals overlay and content parts into the player when fullscreen is enabled
          container={isPlayerFullScreen ? artplayer?.template?.$player : document.body}
          css={{ padding: '$2 !important' }}
        >
          <ResizablePanel contentWidth="full">
            {currentDropdownLevel ? (
              <Flex
                direction="column"
                align="start"
                justify="start"
                className="space-y-2 !p-2 w-full"
              >
                {currentDropdownLevel?.showBackButton || currentDropdownLevel?.showTitle ? (
                  <>
                    <Flex direction="row" align="center" justify="between" className="w-full">
                      <Flex direction="row" align="center" justify="start">
                        {currentDropdownLevel?.showBackButton ? (
                          <Button
                            auto
                            light
                            onClick={currentDropdownLevel?.backButtonAction}
                            icon={<Arrow direction="left" />}
                          />
                        ) : null}
                        {currentDropdownLevel?.showTitle ? (
                          <H6 h6 css={{ margin: 0 }} weight="semibold">
                            {currentDropdownLevel?.title}
                          </H6>
                        ) : null}
                      </Flex>
                      {currentDropdownLevel?.showExtraButton ? (
                        <Button
                          auto
                          light
                          onClick={currentDropdownLevel?.extraButtonAction}
                          css={{ fontWeight: '$bold', textDecoration: 'underline', p: 0, m: 0 }}
                        >
                          {currentDropdownLevel?.extraButtonTitle}
                        </Button>
                      ) : null}
                    </Flex>
                    <Divider />
                  </>
                ) : null}
                <Flex
                  direction="column"
                  align="start"
                  justify="start"
                  className="space-y-2 !p-2 w-full"
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
                          {item?.isSwitch ? (
                            <Switch checked={showSubtitle} onChange={item.switchAction} />
                          ) : (
                            <>
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
                            </>
                          )}
                        </Flex>
                      </Flex>
                    </Button>
                  ))}
                </Flex>
              </Flex>
            ) : null}
          </ResizablePanel>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Popover
      open={isSettingsOpen}
      onOpenChange={(open) => {
        setSettingsOpen(open);
        if (!open) setDropdownLevelKey('general');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          auto
          light
          aria-label="dropdown"
          icon={<Settings filled />}
          css={{ color: '#eee' }}
        />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        // portals overlay and content parts into the player when fullscreen is enabled
        container={isPlayerFullScreen ? artplayer?.template?.$player : document.body}
        css={{
          zIndex: 1000,
          backgroundColor: '$backgroundAlpha',
          backdropFilter: 'blur(21px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(21px) saturate(180%)',
          border: '1px solid $border',
        }}
      >
        <ResizablePanel contentWidth="fit">
          {currentDropdownLevel ? (
            <Flex direction="column" align="start" justify="start" className="space-y-2 w-fit">
              {currentDropdownLevel?.showBackButton || currentDropdownLevel?.showTitle ? (
                <Box className="w-full">
                  <Flex
                    direction="row"
                    align="center"
                    justify="between"
                    className="w-fit !p-2 space-x-4"
                  >
                    <Flex direction="row" align="center" justify="start">
                      {currentDropdownLevel?.showBackButton ? (
                        <Button
                          auto
                          light
                          onClick={currentDropdownLevel?.backButtonAction}
                          icon={<Arrow direction="left" />}
                        />
                      ) : null}
                      {currentDropdownLevel?.showTitle ? (
                        <H6 h6 css={{ margin: 0, px: '$6' }} weight="semibold">
                          {currentDropdownLevel?.title}
                        </H6>
                      ) : null}
                    </Flex>
                    {currentDropdownLevel?.showExtraButton ? (
                      <Button
                        auto
                        light
                        onClick={currentDropdownLevel?.extraButtonAction}
                        css={{ fontWeight: '$bold', textDecoration: 'underline', p: 0, m: 0 }}
                      >
                        {currentDropdownLevel?.extraButtonTitle}
                      </Button>
                    ) : null}
                  </Flex>
                  <Divider css={{ m: 0 }} />
                </Box>
              ) : null}
              <Flex direction="column" align="start" justify="start" className="space-y-2 w-full">
                {currentDropdownLevel?.listItems.map((item) => (
                  <Button
                    key={item.id}
                    auto
                    light
                    onClick={item.action}
                    css={{
                      p: '$4 !important',
                      height: 'auto',
                      width: '100%',
                      '& span': {
                        '&.nextui-button-text': {
                          display: 'block',
                          width: '100%',
                        },
                      },
                      '&:hover': {
                        backgroundColor: '$backgroundAlpha',
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
                        {item?.isSwitch ? (
                          <Switch checked={showSubtitle} onChange={item.switchAction} />
                        ) : (
                          <>
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
                          </>
                        )}
                      </Flex>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          ) : null}
        </ResizablePanel>
      </PopoverContent>
    </Popover>
  );
};

export default PlayerSettings;
