/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Spacer, Avatar, Card } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';

import TMDB from '~/utils/media';
import { IPeople } from '~/services/tmdb/tmdb.types';
import { H5, H6 } from '~/src/components/styles/Text.styles';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

interface IPeopleItem {
  item: IPeople;
  virtual?: boolean;
}
const CardItem = ({ item, virtual }: { item: IPeople; virtual?: boolean }) => {
  const { name } = item;
  const profilePath = TMDB?.profileUrl(item?.profile_path || '', 'w185');
  const { ref, inView } = useInView({
    rootMargin: '1000px 500px',
    triggerOnce: !virtual,
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
        {inView ? (
          <>
            <Card.Body css={{ p: 0 }}>
              {item?.profile_path ? (
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
            <Card.Footer
              css={{
                justifyItems: 'flex-start',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minHeight: '5.25rem',
                maxWidth: '160px',
              }}
            >
              <H5
                h5
                weight="bold"
                css={{
                  minWidth: '130px',
                }}
              >
                {name}
              </H5>
              {item?.known_for && (
                <H6
                  h6
                  className="!line-clamp-2"
                  css={{ color: '$accents7', fontWeight: '$semibold' }}
                >
                  {item?.known_for?.map((movie, index) => (
                    <>
                      {movie?.title || movie?.originalTitle || movie?.name || movie?.originalName}
                      {item?.known_for?.length && (index < item?.known_for?.length - 1 ? ', ' : '')}
                    </>
                  ))}
                </H6>
              )}
              {item?.character && (
                <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                  {item.character}
                </H6>
              )}
              {item?.job && (
                <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold' }}>
                  {item.job}
                </H6>
              )}
            </Card.Footer>
          </>
        ) : null}
      </Card>
      <Spacer y={1} />
    </>
  );
};

const PeopleItem = (props: IPeopleItem) => {
  const { item, virtual } = props;
  return <CardItem item={item} virtual={virtual} />;
};

export default PeopleItem;
