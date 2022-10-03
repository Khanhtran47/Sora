/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Spacer, Avatar, Card } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';

import TMDB from '~/utils/media';
import { IPeople } from '~/services/tmdb/tmdb.types';
import { H5 } from '~/src/components/styles/Text.styles';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

interface IPeopleItem {
  item: IPeople;
}
const CardItem = ({ item }: { item: IPeople }) => {
  const { name } = item;
  const profilePath = TMDB?.profileUrl(item?.profile_path || '', 'w185');
  const { ref, inView } = useInView({
    rootMargin: '500px 200px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
    triggerOnce: true,
  });

  return (
    <>
      <Card
        as="div"
        isHoverable
        isPressable
        css={{
          minWidth: '160px !important',
          minHeight: '318px !important',
          borderWidth: 0,
          filter: 'var(--nextui-dropShadows-md)',
        }}
        role="figure"
        ref={ref}
      >
        {inView && (
          <Card.Body css={{ p: 0 }}>
            {profilePath ? (
              <Card.Image
                // @ts-ignore
                as={Image}
                src={profilePath || ''}
                objectFit="cover"
                width="100%"
                height="auto"
                alt={name}
                title={name}
                css={{
                  minWidth: '160px !important',
                  minHeight: '240px !important',
                }}
                loaderUrl="/api/image"
                placeholder="blur"
                options={{
                  contentType: MimeType.WEBP,
                }}
                responsive={[
                  {
                    size: {
                      width: 160,
                      height: 240,
                    },
                  },
                ]}
              />
            ) : (
              <Avatar
                icon={<PhotoIcon width={48} height={48} />}
                pointer
                css={{
                  minWidth: '160px !important',
                  minHeight: '240px !important',
                  size: '$20',
                  borderRadius: '0 !important',
                }}
              />
            )}
          </Card.Body>
        )}
        <Card.Footer
          css={{
            justifyItems: 'flex-start',
            flexDirection: 'column',
            alignItems: 'flex-start',
            minHeight: '4.875rem',
            maxWidth: '160px',
          }}
        >
          <H5
            h5
            weight="bold"
            css={{
              minWidth: '130px',
              padding: '0 0.25rem',
            }}
          >
            {name}
          </H5>
        </Card.Footer>
      </Card>
      <Spacer y={1} />
    </>
  );
};

const PeopleItem = (props: IPeopleItem) => {
  const { item } = props;
  return <CardItem item={item} />;
};

export default PeopleItem;
