import { useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { Spacer } from '@nextui-org/spacer';
import { Switch } from '@nextui-org/switch';
import { isMobileOnly } from 'react-device-detect';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { Dialog, DialogContent, DialogTrigger } from '~/components/elements/Dialog';
import AddSubtitles from '~/components/elements/dialog/AddSubtitleDialog';
import SearchSubtitles from '~/components/elements/dialog/SearchSubtitleDialog';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/elements/Popover';
import ResizablePanel from '~/components/elements/shared/ResizablePanel';
import { Sheet, SheetContent, SheetTrigger } from '~/components/elements/Sheet';
import Arrow from '~/assets/icons/ArrowIcon';
import Filter from '~/assets/icons/FilterIcon';
import Flip from '~/assets/icons/FlipIcon';
import PaperPlus from '~/assets/icons/PaperPlusIcon';
import Play from '~/assets/icons/PlayIcon';
import Ratio from '~/assets/icons/RatioIcon';
import Search from '~/assets/icons/SearchIcon';
import Settings from '~/assets/icons/SettingsIcon';
import Subtitle from '~/assets/icons/SubtitleIcon';
import Tick from '~/assets/icons/TickIcon';

interface IPlayerSettingsProps {
  artplayer: Artplayer | null;
  qualitySelector?: {
    html: string;
    url: string;
    default?: boolean;
    isM3U8?: boolean;
    isDASH?: boolean;
  }[];
  subtitleSelector?: {
    html: string;
    url: string;
    default?: boolean;
    type?: string;
  }[];
  isPlayerFullScreen?: boolean;
  isSettingsOpen: boolean;
  showSubtitle: boolean;
  setShowSubtitle: React.Dispatch<React.SetStateAction<boolean>>;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  subtitleOptions?: {
    imdb_id?: number;
    tmdb_id?: number;
    parent_feature_id?: number;
    parent_imdb_id?: number;
    parent_tmdb_id?: number;
    episode_number?: number;
    season_number?: number;
    type?: 'movie' | 'episode' | 'all';
    title?: string;
    sub_format: 'srt' | 'webvtt';
  };
}

type SettingsOption = {
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
  isTriggerDialog?: boolean;
  switchAction?: (isSelected: boolean) => void;
  dialogName?: string;
};

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
    subtitleOptions,
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
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDialogName, setCurrentDialogName] = useState('');

  const {
    currentSubtitleFontColor,
    currentSubtitleFontSize,
    currentSubtitleBackgroundColor,
    currentSubtitleBackgroundOpacity,
    currentSubtitleWindowColor,
    currentSubtitleWindowOpacity,
    currentSubtitleTextEffects,
  } = useSoraSettings();

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
        listItems: SettingsOption[];
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
              switchAction: (isSelected: boolean) => {
                if (artplayer) {
                  artplayer.subtitle.show = isSelected;
                  setShowSubtitle(isSelected);
                }
              },
            },
            {
              id: 'search-subtitle',
              title: 'Search Subtitle',
              showIcon: true,
              isTriggerDialog: true,
              icon: <Search />,
              action: () => {
                setSettingsOpen(false);
                setDropdownLevelKey('general');
                setOpenDialog(true);
                setCurrentDialogName('search-subtitle');
              },
            },
            {
              id: 'add-subtitle',
              title: 'Add Subtitle',
              showIcon: true,
              isTriggerDialog: true,
              icon: <PaperPlus />,
              action: () => {
                setSettingsOpen(false);
                setDropdownLevelKey('general');
                setOpenDialog(true);
                setCurrentDialogName('add-subtitle');
              },
            },
            ...(subtitleSelector
              ? subtitleSelector.map((subtitle) => ({
                  id: subtitle.html,
                  title: subtitle.html,
                  showIcon: false,
                  action: () => {
                    if (artplayer) {
                      artplayer.subtitle.switch(subtitle.url, {
                        name: subtitle.html,
                        ...(subtitle.type ? { type: subtitle.type } : {}),
                      });
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
              currentValue: currentSubtitleFontColor.value,
            },
            {
              id: 'subtitle-font-size',
              title: 'Font Size',
              description: 'Change the subtitle font size',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-font-size'),
              currentValue: currentSubtitleFontSize.value,
            },
            {
              id: 'subtitle-background-color',
              title: 'Background Color',
              description: 'Change the subtitle background color',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-background-color'),
              currentValue: currentSubtitleBackgroundColor.value,
            },
            {
              id: 'subtitle-background-opacity',
              title: 'Background Opacity',
              description: 'Change the subtitle background opacity',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-background-opacity'),
              currentValue: currentSubtitleBackgroundOpacity.value,
            },
            {
              id: 'subtitle-window-color',
              title: 'Window Color',
              description: 'Change the subtitle window color',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-window-color'),
              currentValue: currentSubtitleWindowColor.value,
            },
            {
              id: 'subtitle-window-opacity',
              title: 'Window Opacity',
              description: 'Change the subtitle window opacity',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-window-opacity'),
              currentValue: currentSubtitleWindowOpacity.value,
            },
            {
              id: 'subtitle-text-effects',
              title: 'Text Effects',
              description: 'Change the subtitle text effects',
              showIcon: true,
              action: () => setDropdownLevelKey('subtitle-text-effects'),
              currentValue: currentSubtitleTextEffects.value,
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
                  currentSubtitleFontColor.set('White');
                  currentSubtitleFontSize.set('100%');
                  currentSubtitleBackgroundColor.set('Black');
                  currentSubtitleBackgroundOpacity.set('0%');
                  currentSubtitleWindowColor.set('Black');
                  currentSubtitleWindowOpacity.set('0%');
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
                  currentSubtitleFontColor.set('White');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'White',
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
                  currentSubtitleFontColor.set('Blue');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'Blue',
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
                  currentSubtitleFontColor.set('Purple');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'Purple',
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
                  currentSubtitleFontColor.set('Green');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'Green',
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
                  currentSubtitleFontColor.set('Yellow');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'Yellow',
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
                  currentSubtitleFontColor.set('Red');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'Red',
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
                  currentSubtitleFontColor.set('Cyan');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'Cyan',
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
                  currentSubtitleFontColor.set('Pink');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'Pink',
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
                  currentSubtitleFontColor.set('Black');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontColor.value === 'Black',
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
                  currentSubtitleFontSize.set('50%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '50%',
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
                  currentSubtitleFontSize.set('75%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '75%',
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
                  currentSubtitleFontSize.set('100%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '100%',
            },
            {
              id: '125%',
              title: '125%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05 * 1.25}px`,
                  });
                  currentSubtitleFontSize.set('125%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '125%',
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
                  currentSubtitleFontSize.set('150%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '150%',
            },
            {
              id: '175%',
              title: '175%',
              showIcon: false,
              action: () => {
                if (artplayer) {
                  artplayer.subtitle.style({
                    fontSize: `${artplayer.height * 0.05 * 1.75}px`,
                  });
                  currentSubtitleFontSize.set('175%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '175%',
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
                  currentSubtitleFontSize.set('200%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '200%',
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
                  currentSubtitleFontSize.set('300%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '300%',
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
                  currentSubtitleFontSize.set('400%');
                  setDropdownLevelKey('subtitle-settings');
                }
              },
              isCurrent: currentSubtitleFontSize.value === '400%',
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
                currentSubtitleBackgroundColor.set('Black');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'Black',
            },
            {
              id: 'blue',
              title: 'Blue',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundColor.set('Blue');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'Blue',
            },
            {
              id: 'purple',
              title: 'Purple',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundColor.set('Purple');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'Purple',
            },
            {
              id: 'green',
              title: 'Green',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundColor.set('Green');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'Green',
            },
            {
              id: 'yellow',
              title: 'Yellow',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundColor.set('Yellow');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'Yellow',
            },
            {
              id: 'red',
              title: 'Red',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundColor.set('Red');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'Red',
            },
            {
              id: 'cyan',
              title: 'Cyan',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundColor.set('Cyan');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'Cyan',
            },
            {
              id: 'pink',
              title: 'Pink',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundColor.set('Pink');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'Pink',
            },
            {
              id: 'white',
              title: 'White',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundColor.set('White');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundColor.value === 'White',
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
                currentSubtitleBackgroundOpacity.set('0%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity.value === '0%',
            },
            {
              id: '25%',
              title: '25%',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundOpacity.set('25%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity.value === '25%',
            },
            {
              id: '50%',
              title: '50%',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundOpacity.set('50%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity.value === '50%',
            },
            {
              id: '75%',
              title: '75%',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundOpacity.set('75%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity.value === '75%',
            },
            {
              id: '100%',
              title: '100%',
              showIcon: false,
              action: () => {
                currentSubtitleBackgroundOpacity.set('100%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleBackgroundOpacity.value === '100%',
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
                currentSubtitleWindowColor.set('Black');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'Black',
            },
            {
              id: 'blue',
              title: 'Blue',
              showIcon: false,
              action: () => {
                currentSubtitleWindowColor.set('Blue');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'Blue',
            },
            {
              id: 'purple',
              title: 'Purple',
              showIcon: false,
              action: () => {
                currentSubtitleWindowColor.set('Purple');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'Purple',
            },
            {
              id: 'green',
              title: 'Green',
              showIcon: false,
              action: () => {
                currentSubtitleWindowColor.set('Green');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'Green',
            },
            {
              id: 'yellow',
              title: 'Yellow',
              showIcon: false,
              action: () => {
                currentSubtitleWindowColor.set('Yellow');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'Yellow',
            },
            {
              id: 'red',
              title: 'Red',
              showIcon: false,
              action: () => {
                currentSubtitleWindowColor.set('Red');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'Red',
            },
            {
              id: 'cyan',
              title: 'Cyan',
              showIcon: false,
              action: () => {
                currentSubtitleWindowColor.set('Cyan');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'Cyan',
            },
            {
              id: 'pink',
              title: 'Pink',
              showIcon: false,
              action: () => {
                currentSubtitleWindowColor.set('Pink');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'Pink',
            },
            {
              id: 'white',
              title: 'White',
              showIcon: false,
              action: () => {
                currentSubtitleWindowColor.set('White');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowColor.value === 'White',
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
                currentSubtitleWindowOpacity.set('0%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity.value === '0%',
            },
            {
              id: '25%',
              title: '25%',
              showIcon: false,
              action: () => {
                currentSubtitleWindowOpacity.set('25%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity.value === '25%',
            },
            {
              id: '50%',
              title: '50%',
              showIcon: false,
              action: () => {
                currentSubtitleWindowOpacity.set('50%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity.value === '50%',
            },
            {
              id: '75%',
              title: '75%',
              showIcon: false,
              action: () => {
                currentSubtitleWindowOpacity.set('75%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity.value === '75%',
            },
            {
              id: '100%',
              title: '100%',
              showIcon: false,
              action: () => {
                currentSubtitleWindowOpacity.set('100%');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleWindowOpacity.value === '100%',
            },
          ],
        },
        {
          id: 'subtitle-text-effects',
          key: 'subtitle-text-effects',
          showTitle: true,
          showBackButton: true,
          backButtonAction: () => setDropdownLevelKey('subtitle-settings'),
          title: 'Text Effects',
          listItems: [
            {
              id: 'none',
              title: 'None',
              showIcon: false,
              action: () => {
                currentSubtitleTextEffects.set('None');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleTextEffects.value === 'None',
            },
            {
              id: 'drop-shadow',
              title: 'Drop Shadow',
              showIcon: false,
              action: () => {
                currentSubtitleTextEffects.set('Drop Shadow');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleTextEffects.value === 'Drop Shadow',
            },
            {
              id: 'raised',
              title: 'Raised',
              showIcon: false,
              action: () => {
                currentSubtitleTextEffects.set('Raised');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleTextEffects.value === 'Raised',
            },
            {
              id: 'depressed',
              title: 'Depressed',
              showIcon: false,
              action: () => {
                currentSubtitleTextEffects.set('Depressed');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleTextEffects.value === 'Depressed',
            },
            {
              id: 'outline',
              title: 'Outline',
              showIcon: false,
              action: () => {
                currentSubtitleTextEffects.set('Outline');
                setDropdownLevelKey('subtitle-settings');
              },
              isCurrent: currentSubtitleTextEffects.value === 'Outline',
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
            action: async () => {
              if (artplayer) {
                await artplayer.switchQuality(quality.url);
                setCurrentQuality(quality.html);
                setDropdownLevelKey('general');
                const currentSubtitleSelected = subtitleSelector?.find(
                  (subtitle) => subtitle.html === currentSubtitle,
                );
                if (currentSubtitleSelected) {
                  artplayer.subtitle.switch(currentSubtitleSelected.url, {
                    name: currentSubtitleSelected.html,
                  });
                }
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
      currentSubtitleFontColor.value,
      currentSubtitleFontSize.value,
      currentSubtitleBackgroundColor.value,
      currentSubtitleBackgroundOpacity.value,
      currentSubtitleWindowColor.value,
      currentSubtitleWindowOpacity.value,
      currentSubtitleTextEffects.value,
    ],
  );
  const currentDropdownLevel = useMemo(
    () => dropdownLevel.find((level) => level.key === dropdownLevelKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dropdownLevelKey],
  );

  const containerPortal = useMemo(
    // portals overlay and content parts into the player when fullscreen is enabled
    () => (isPlayerFullScreen ? artplayer?.template?.$player : document.body),
    [artplayer, isPlayerFullScreen],
  );

  const handleOpenChange = (open: boolean) => {
    setSettingsOpen(open);
    if (!open) setDropdownLevelKey('general');
  };

  const settingsOptions = (item: SettingsOption) => (
    <Button
      key={item.id}
      type="button"
      fullWidth
      variant="light"
      onPress={item.action}
      className="flex h-14 flex-row items-center justify-between gap-x-8 !p-2 data-[hover=true]:bg-default/[.6]"
    >
      <div className="flex shrink-0 grow flex-row items-center gap-x-2">
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
          <Spacer x={6} />
        )}
        <h6 className="!line-clamp-1 !text-default-foreground">{item.title}</h6>
      </div>
      <div className="flex shrink-0 grow flex-row items-center justify-end gap-x-2">
        {item?.isSwitch ? (
          <Switch isSelected={showSubtitle} onValueChange={item.switchAction} />
        ) : (
          <>
            <h6 className="!text-default-foreground">
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
            </h6>
            {item.showIcon ? <Arrow direction="right" /> : null}
          </>
        )}
      </div>
    </Button>
  );

  if (isMobileOnly) {
    return (
      <Sheet open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
        <Sheet open={isSettingsOpen} onOpenChange={(open) => handleOpenChange(open)}>
          <SheetTrigger asChild>
            <Button
              type="button"
              size="md"
              variant="light"
              isIconOnly
              aria-label="dropdown"
              className="art-icon data-[hover=true]:bg-transparent"
            >
              <Settings filled />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            size="content"
            hideCloseButton
            swipeDownToClose
            open={isSettingsOpen}
            onOpenChange={() => handleOpenChange(!isSettingsOpen)}
            container={isPlayerFullScreen ? artplayer?.template?.$player : document.body}
            className="!bg-default"
          >
            <ResizablePanel contentWidth="full">
              {currentDropdownLevel ? (
                <div className="flex w-full flex-col items-start justify-start gap-y-2 !p-2">
                  {currentDropdownLevel?.showBackButton || currentDropdownLevel?.showTitle ? (
                    <>
                      <div className="flex w-full flex-row items-center justify-between">
                        {currentDropdownLevel?.showBackButton ? (
                          <Button
                            type="button"
                            variant="light"
                            onPress={currentDropdownLevel?.backButtonAction}
                            startContent={<Arrow direction="left" />}
                          >
                            {currentDropdownLevel?.showTitle ? (
                              <h6 className="!text-default-foreground">
                                {currentDropdownLevel?.title}
                              </h6>
                            ) : null}
                          </Button>
                        ) : null}
                        {currentDropdownLevel?.showExtraButton ? (
                          <Button
                            type="button"
                            variant="light"
                            onPress={currentDropdownLevel?.extraButtonAction}
                            className="m-0 p-2 font-bold underline"
                          >
                            {currentDropdownLevel?.extraButtonTitle}
                          </Button>
                        ) : null}
                      </div>
                      <Divider />
                    </>
                  ) : null}
                  <div className="flex w-full flex-col items-start justify-start gap-y-2 !p-2">
                    {currentDropdownLevel?.listItems.map((item) => {
                      if (item.isTriggerDialog) {
                        return (
                          <SheetTrigger key={item.id} asChild>
                            {settingsOptions(item)}
                          </SheetTrigger>
                        );
                      }
                      return settingsOptions(item);
                    })}
                  </div>
                </div>
              ) : null}
            </ResizablePanel>
          </SheetContent>
        </Sheet>
        <SheetContent
          container={containerPortal}
          side="bottom"
          size="content"
          hideCloseButton
          swipeDownToClose
          open={openDialog}
          onOpenChange={() => setOpenDialog(!openDialog)}
        >
          {currentDialogName === 'add-subtitle' ? (
            <AddSubtitles artplayer={artplayer} setCurrentSubtitle={setCurrentSubtitle} />
          ) : currentDialogName === 'search-subtitle' ? (
            <SearchSubtitles
              artplayer={artplayer}
              subtitleOptions={subtitleOptions}
              containerPortal={containerPortal}
              setCurrentSubtitle={setCurrentSubtitle}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <Popover open={isSettingsOpen} onOpenChange={(open) => handleOpenChange(open)}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="md"
            variant="light"
            isIconOnly
            aria-label="dropdown"
            className="art-icon data-[hover=true]:bg-transparent"
          >
            <Settings filled />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          container={containerPortal}
          className="z-[1000] bg-default/60 backdrop-blur-2xl backdrop-contrast-125 backdrop-saturate-200"
        >
          <ResizablePanel contentWidth="fit">
            {currentDropdownLevel ? (
              <div className="flex w-max flex-col items-start justify-start gap-y-2">
                {currentDropdownLevel?.showBackButton || currentDropdownLevel?.showTitle ? (
                  <>
                    <div className="flex w-full flex-row items-center justify-between gap-x-4">
                      {currentDropdownLevel?.showBackButton ? (
                        <Button
                          type="button"
                          variant="light"
                          onPress={currentDropdownLevel?.backButtonAction}
                          startContent={<Arrow direction="left" />}
                        >
                          {currentDropdownLevel?.showTitle ? (
                            <h6 className="!text-default-foreground">
                              {currentDropdownLevel?.title}
                            </h6>
                          ) : null}
                        </Button>
                      ) : null}
                      {currentDropdownLevel?.showExtraButton ? (
                        <Button
                          type="button"
                          size="md"
                          variant="light"
                          onPress={currentDropdownLevel?.extraButtonAction}
                          className="m-0 p-2 font-bold underline"
                        >
                          {currentDropdownLevel?.extraButtonTitle}
                        </Button>
                      ) : null}
                    </div>
                    <Divider />
                  </>
                ) : null}
                <div className="flex w-full flex-col items-start justify-start gap-y-2">
                  {currentDropdownLevel?.listItems.map((item) => {
                    if (item.isTriggerDialog) {
                      return (
                        <DialogTrigger key={item.id} asChild>
                          {settingsOptions(item)}
                        </DialogTrigger>
                      );
                    }
                    return settingsOptions(item);
                  })}
                </div>
              </div>
            ) : null}
          </ResizablePanel>
        </PopoverContent>
      </Popover>
      <DialogContent container={containerPortal}>
        {currentDialogName === 'add-subtitle' ? (
          <AddSubtitles artplayer={artplayer} setCurrentSubtitle={setCurrentSubtitle} />
        ) : currentDialogName === 'search-subtitle' ? (
          <SearchSubtitles
            artplayer={artplayer}
            subtitleOptions={subtitleOptions}
            containerPortal={containerPortal}
            setCurrentSubtitle={setCurrentSubtitle}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSettings;
