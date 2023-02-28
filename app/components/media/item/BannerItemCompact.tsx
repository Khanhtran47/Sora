/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, styled, keyframes } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import { Title } from '~/types/media';

import AspectRatio from '~/components/elements/aspect-ratio/AspectRatio';
import { H5 } from '~/components/styles/Text.styles';

interface IBannerItemCompactProps {
  backdropPath: string;
  title: string | Title;
  progress: number;
}

export const ProgressBar = styled('div', {
  overflow: 'hidden',
  display: 'none',
  position: 'absolute',
  bottom: 0,
  zIndex: 1,
  width: '100%',
  height: 6,
});

const progressBarStripes = keyframes({
  '0%': { backgroundPosition: '40px 0' },
  '100%': { backgroundPosition: '0 0' },
});

const Progress = styled('div', {
  backgroundImage:
    'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
  backgroundSize: '40px 40px',
  float: 'left',
  width: 0,
  height: '100%',
  '-webkit-transition': 'width 0.3s ease',
  '-moz-transition': 'width 0.3s ease',
  '-o-transition': 'width 0.3s ease',
  transition: 'width 0.3s ease',
  animation: `${progressBarStripes} 2s linear infinite`,
  backgroundColor: '$primary',
});

const BannerItemCompact = (props: IBannerItemCompactProps) => {
  const { backdropPath, title, progress } = props;
  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;
  return (
    <AspectRatio.Root ratio={16 / 9}>
      <Card
        as="div"
        className="card"
        isHoverable
        isPressable
        css={{
          minWidth: '240px !important',
          minHeight: '135px !important',
          overflow: 'hidden',
          borderWidth: 0,
          filter: 'unset',
        }}
        role="figure"
      >
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            // @ts-ignore
            as={Image}
            className="card-image"
            src={backdropPath}
            objectFit="cover"
            width="100%"
            height="auto"
            alt={titleItem}
            title={titleItem}
            showSkeleton
            css={{
              minWidth: '240px !important',
              minHeight: '135px !important',
            }}
            loaderUrl="/api/image"
            placeholder="empty"
            options={{
              contentType: MimeType.WEBP,
            }}
            responsive={[
              {
                size: {
                  width: 240,
                  height: 135,
                },
              },
            ]}
          />
        </Card.Body>
        <Card.Footer
          css={{
            paddingLeft: '1.5rem',
            position: 'absolute',
            bottom: 0,
            zIndex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '135px',
            width: '70%',
          }}
        >
          <H5 h5 weight="bold" className="line-clamp-3" css={{ display: 'none' }}>
            {titleItem}
          </H5>
        </Card.Footer>
      </Card>
      <ProgressBar className="progress">
        <Progress css={{ width: `${progress * 100}%` }} />
      </ProgressBar>
    </AspectRatio.Root>
  );
};

export default BannerItemCompact;
