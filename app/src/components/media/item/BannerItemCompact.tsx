/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';

import { IMedia } from '~/services/tmdb/tmdb.types';

import AspectRatio from '~/src/components/elements/aspect-ratio/AspectRatio';
import { H5 } from '~/src/components/styles/Text.styles';

interface IBannerItemCompactProps {
  item?: IMedia;
}

const BannerItemCompact = (props: IBannerItemCompactProps) => {
  const { item } = props;
  const { backdropPath, title } = item || {};
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
            src={backdropPath || ''}
            objectFit="cover"
            width="100%"
            height="auto"
            alt={title}
            title={title}
            css={{
              minWidth: '240px !important',
              minHeight: '135px !important',
            }}
            loaderUrl="/api/image"
            placeholder="blur"
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
            {title}
          </H5>
        </Card.Footer>
      </Card>
    </AspectRatio.Root>
  );
};

export default BannerItemCompact;
