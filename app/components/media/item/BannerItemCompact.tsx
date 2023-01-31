/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import { Title } from '~/types/media';

import AspectRatio from '~/components/elements/aspect-ratio/AspectRatio';
import { H5 } from '~/components/styles/Text.styles';

interface IBannerItemCompactProps {
  backdropPath: string;
  title: string | Title;
}

const BannerItemCompact = (props: IBannerItemCompactProps) => {
  const { backdropPath, title } = props;
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
          filter: 'var(--nextui-dropShadows-md)',
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
    </AspectRatio.Root>
  );
};

export default BannerItemCompact;
