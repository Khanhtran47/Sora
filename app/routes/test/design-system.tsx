/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { NavLink, useLocation, useNavigate } from '@remix-run/react';
import { Container, Spacer, Badge, Popover, Button, Divider } from '@nextui-org/react';
import { motion } from 'framer-motion';

import { H2, H4, H6 } from '~/src/components/styles/Text.styles';
import ResizablePanel from '~/src/components/elements/shared/ResizablePanel';
import Flex from '~/src/components/styles/Flex.styles';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '~/src/components/elements/shared/Sheet';

import Settings from '~/src/assets/icons/SettingsIcon.js';
import Arrow from '~/src/assets/icons/ArrowIcon.js';
import Tick from '~/src/assets/icons/TickIcon.js';
import Play from '~/src/assets/icons/PlayIcon.js';
import Flip from '~/src/assets/icons/FlipIcon.js';
import Ratio from '~/src/assets/icons/RatioIcon.js';
import Subtitle from '~/src/assets/icons/SubtitleIcon.js';

export const meta: MetaFunction = () => ({
  title: 'Design System',
  description: 'This page for testing the design system',
  'og:title': 'Design System',
  'og:description': 'This page for testing the design system',
});

export const handle = {
  breadcrumb: () => (
    <NavLink to="/test/design-system" aria-label="Design system Page">
      {({ isActive }) => (
        <Badge
          color="primary"
          variant="flat"
          css={{
            opacity: isActive ? 1 : 0.7,
            transition: 'opacity 0.25s ease 0s',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Design System
        </Badge>
      )}
    </NavLink>
  ),
};

const DesignSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [dropdownLevelKey, setDropdownLevelKey] = useState('general');
  const [currentPlaySpeed, setCurrentPlaySpeed] = useState('Normal');
  const [currentAspectRatio, setCurrentAspectRatio] = useState('Default');
  const [currentVideoFlip, setCurrentVideoFlip] = useState('Normal');
  const [currentSubtitleOffset, setCurrentSubtitleOffset] = useState('Normal');
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
      backButtonAction: () => setDropdownLevelKey('general'),
      title: 'Play Speed',
      listItems: [
        {
          id: '0.25x',
          title: '0.25x',
          showIcon: false,
          action: () => {
            setCurrentPlaySpeed('0.25x');
            setDropdownLevelKey('general');
          },
          isCurrent: currentPlaySpeed === '0.25x',
        },
        {
          id: '0.5x',
          title: '0.5x',
          showIcon: false,
          action: () => {
            setCurrentPlaySpeed('0.5x');
            setDropdownLevelKey('general');
          },
          isCurrent: currentPlaySpeed === '0.5x',
        },
        {
          id: '0.75x',
          title: '0.75x',
          showIcon: false,
          action: () => {
            setCurrentPlaySpeed('0.75x');
            setDropdownLevelKey('general');
          },
          isCurrent: currentPlaySpeed === '0.75x',
        },
        {
          id: 'normal',
          title: 'Normal',
          showIcon: false,
          action: () => {
            setCurrentPlaySpeed('Normal');
            setDropdownLevelKey('general');
          },
          isCurrent: currentPlaySpeed === 'Normal',
        },
        {
          id: '1.25x',
          title: '1.25x',
          showIcon: false,
          action: () => {
            setCurrentPlaySpeed('1.25x');
            setDropdownLevelKey('general');
          },
          isCurrent: currentPlaySpeed === '1.25x',
        },
        {
          id: '1.5x',
          title: '1.5x',
          showIcon: false,
          action: () => {
            setCurrentPlaySpeed('1.5x');
            setDropdownLevelKey('general');
          },
          isCurrent: currentPlaySpeed === '1.5x',
        },
        {
          id: '1.75x',
          title: '1.75x',
          showIcon: false,
          action: () => {
            setCurrentPlaySpeed('1.75x');
            setDropdownLevelKey('general');
          },
          isCurrent: currentPlaySpeed === '1.75x',
        },
        {
          id: '2x',
          title: '2x',
          showIcon: false,
          action: () => {
            setCurrentPlaySpeed('2x');
            setDropdownLevelKey('general');
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
            setCurrentAspectRatio('Default');
            setDropdownLevelKey('general');
          },
          isCurrent: currentAspectRatio === 'Default',
        },
        {
          id: '16:9',
          title: '16:9',
          showIcon: false,
          action: () => {
            setCurrentAspectRatio('16:9');
            setDropdownLevelKey('general');
          },
          isCurrent: currentAspectRatio === '16:9',
        },
        {
          id: '4:3',
          title: '4:3',
          showIcon: false,
          action: () => {
            setCurrentAspectRatio('4:3');
            setDropdownLevelKey('general');
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
            setCurrentVideoFlip('Normal');
            setDropdownLevelKey('general');
          },
          isCurrent: currentVideoFlip === 'Normal',
        },
        {
          id: 'flip-horizontally',
          title: 'Flip Horizontally',
          showIcon: false,
          action: () => {
            setCurrentVideoFlip('Horizontally');
            setDropdownLevelKey('general');
          },
          isCurrent: currentVideoFlip === 'Horizontally',
        },
        {
          id: 'flip-vertically',
          title: 'Flip Vertically',
          showIcon: false,
          action: () => {
            setCurrentVideoFlip('Vertically');
            setDropdownLevelKey('general');
          },
          isCurrent: currentVideoFlip === 'Vertically',
        },
      ],
    },
    {
      id: 'subtitle-offset',
      key: 'subtitle-offset',
      showTitle: true,
      showBackButton: true,
      backButtonAction: () => setDropdownLevelKey('general'),
      title: 'Subtitle Offset',
      listItems: [
        {
          id: '-5s',
          title: '-5s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('-5s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '-5s',
        },
        {
          id: '-4s',
          title: '-4s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('-4s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '-4s',
        },
        {
          id: '-3s',
          title: '-3s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('-3s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '-3s',
        },
        {
          id: '-2s',
          title: '-2s',
          action: () => {
            setCurrentSubtitleOffset('-2s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '-2s',
        },
        {
          id: '-1s',
          title: '-1s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('-1s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '-1s',
        },
        {
          id: 'normal',
          title: 'Normal',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('Normal');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === 'Normal',
        },
        {
          id: '1s',
          title: '1s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('1s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '1s',
        },
        {
          id: '2s',
          title: '2s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('2s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '2s',
        },
        {
          id: '3s',
          title: '3s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('3s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '3s',
        },
        {
          id: '4s',
          title: '4s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('4s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '4s',
        },
        {
          id: '5s',
          title: '5s',
          showIcon: false,
          action: () => {
            setCurrentSubtitleOffset('5s');
            setDropdownLevelKey('general');
          },
          isCurrent: currentSubtitleOffset === '5s',
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
    <motion.main
      key={location.key}
      initial={{ x: '-10%', opacity: 0 }}
      animate={{ x: '0', opacity: 1 }}
      exit={{ y: '-10%', opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Container
        fluid
        display="flex"
        justify="flex-start"
        direction="column"
        css={{
          padding: '0 $sm',
          '@xs': {
            padding: 0,
          },
        }}
      >
        <H2 h2>Design System</H2>
        <Spacer y={1} />
        <Popover
          shouldFlip
          placement="bottom"
          isOpen={isSettingsOpen}
          onOpenChange={setSettingsOpen}
          isBordered
          disableShadow
          onClose={() => setDropdownLevelKey('general')}
        >
          <Popover.Trigger>
            <Button auto light aria-label="dropdown" icon={<Settings />} />
          </Popover.Trigger>
          <Popover.Content>
            <ResizablePanel contentWidth="fit">
              {currentDropdownLevel ? (
                <Flex
                  direction="column"
                  align="start"
                  justify="start"
                  className="space-y-2 px-2 py-2"
                >
                  {currentDropdownLevel?.showBackButton || currentDropdownLevel?.showTitle ? (
                    <>
                      <Flex direction="row" align="center" justify="between">
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
                        <Flex
                          direction="row"
                          align="center"
                          justify="between"
                          className="space-x-8"
                        >
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
        <Spacer y={1} />
        <Flex direction="row" className="space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button auto ghost aria-label="dropdown">
                Top
              </Button>
            </SheetTrigger>
            <SheetContent side="top" hideCloseButton>
              <SheetTitle asChild>
                <H4 h4>Sheet Title</H4>
              </SheetTitle>
              <SheetDescription>Sheet Description</SheetDescription>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button auto ghost aria-label="dropdown">
                Right
              </Button>
            </SheetTrigger>
            <SheetContent side="right" hideCloseButton>
              <SheetTitle asChild>
                <H4 h4>Sheet Title</H4>
              </SheetTitle>
              <SheetDescription>Sheet Description</SheetDescription>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button auto ghost aria-label="dropdown">
                Bottom
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" hideCloseButton>
              <ResizablePanel contentWidth="full">
                {currentDropdownLevel ? (
                  <Flex
                    direction="column"
                    align="start"
                    justify="start"
                    className="space-y-2 px-2 py-2"
                  >
                    {currentDropdownLevel?.showBackButton || currentDropdownLevel?.showTitle ? (
                      <>
                        <Flex direction="row" align="center" justify="between">
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
                          <Flex
                            direction="row"
                            align="center"
                            justify="between"
                            className="space-x-8"
                          >
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
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button auto ghost aria-label="dropdown">
                Left
              </Button>
            </SheetTrigger>
            <SheetContent side="left" hideCloseButton>
              <SheetTitle asChild>
                <H4 h4>Sheet Title</H4>
              </SheetTitle>
              <SheetDescription>Sheet Description</SheetDescription>
            </SheetContent>
          </Sheet>
        </Flex>
        <Spacer y={1} />
        <Button auto light onClick={() => navigate('/test/gesg')}>
          test catch boundary
        </Button>
      </Container>
    </motion.main>
  );
};

export default DesignSystem;
