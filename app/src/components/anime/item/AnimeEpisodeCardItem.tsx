/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, Spacer, Avatar } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';

import useMediaQuery from '~/hooks/useMediaQuery';
import { IAnimeEpisode } from '~/services/consumet/anilist/anilist.types';
import { H5, H6 } from '~/src/components/styles/Text.styles';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

const AnimeEpisodeCardItem = ({ item, virtual }: { item: IAnimeEpisode; virtual?: boolean }) => {
  const { title, image, episodeTitle, episodeNumber, color } = item;
  const { ref, inView } = useInView({
    rootMargin: '3000px 1000px',
    triggerOnce: !virtual,
  });
  const isSm = useMediaQuery(650, 'max');
  const isLg = useMediaQuery(1400, 'max');

  return (
    <>
      <Card
        as="div"
        isHoverable
        isPressable
        css={{
          minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
          minHeight: `${isSm ? '323px' : isLg ? '435px' : '488px'} !important`,
          borderWidth: 0,
          filter: 'var(--nextui-dropShadows-md)',
        }}
        role="figure"
        ref={ref}
      >
        {inView ? (
          <>
            <Card.Body css={{ p: 0 }}>
              {image ? (
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={image || ''}
                  objectFit="cover"
                  width="100%"
                  height="auto"
                  alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  title={title?.userPreferred || title?.english || title?.romaji || title?.native}
                  css={{
                    minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
                    minHeight: `${isSm ? '245px' : isLg ? '357px' : '410px'} !important`,
                  }}
                  loaderUrl="/api/image"
                  placeholder="blur"
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                  responsive={[
                    {
                      size: {
                        width: 164,
                        height: 245,
                      },
                      maxWidth: 650,
                    },
                    {
                      size: {
                        width: 210,
                        height: 357,
                      },
                      maxWidth: 1280,
                    },
                    {
                      size: {
                        width: 240,
                        height: 410,
                      },
                    },
                  ]}
                />
              ) : (
                <Avatar
                  icon={<PhotoIcon width={48} height={48} />}
                  pointer
                  css={{
                    minWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'} !important`,
                    minHeight: `${isSm ? '245px' : isLg ? '357px' : '410px'} !important`,
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
                minHeight: '4.875rem',
                maxWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'}`,
              }}
            >
              <H5
                h5
                weight="bold"
                css={{
                  color,
                  minWidth: `${isSm ? '130px' : isLg ? '180px' : '210px'}`,
                  padding: '0 0.25rem',
                }}
              >
                {title?.userPreferred || title?.english || title?.romaji || title?.native}
              </H5>
              <H6 h6 css={{ color: '$accents7', fontWeight: '$semibold', fontSize: '$sm' }}>
                EP {episodeNumber} - {episodeTitle}
              </H6>
            </Card.Footer>
          </>
        ) : null}
      </Card>

      <Spacer y={1} />
    </>
  );
};

export default AnimeEpisodeCardItem;
