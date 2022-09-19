/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Card,
  Grid,
  Loading,
  Row,
  Spacer,
  Text,
  Tooltip,
  Avatar,
  Image as NextImage,
} from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';
import useMediaQuery from '~/hooks/useMediaQuery';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IMedia } from '~/services/tmdb/tmdb.types';

import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

const CardItemHover = ({
  item,
  genresMovie,
  genresTv,
}: {
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
}) => {
  console.log('🚀 ~ file: CardItem.tsx ~ line 21 ~ item', item);
  const { title, overview, releaseDate, voteAverage, mediaType, posterPath, backdropPath } = item;
  const { loading, colorDarkenLighten } = useColorDarkenLighten(posterPath);
  // TODO: add spinner on loading color

  return (
    <Grid.Container
      css={{
        padding: '0.75rem',
        minWidth: '350px',
        maxWidth: '400px',
        width: 'inherit',
      }}
    >
      {loading ? (
        <Loading type="points-opacity" />
      ) : (
        <>
          {backdropPath && (
            <NextImage
              // @ts-ignore
              as={Image}
              src={backdropPath || ''}
              objectFit="cover"
              width="100%"
              height="212px"
              alt={title}
              title={title}
              containerCss={{
                borderRadius: '0.5rem',
              }}
              css={{
                minWidth: '240px !important',
                minHeight: 'auto !important',
              }}
              loaderUrl="/api/image"
              placeholder="blur"
              options={{
                contentType: MimeType.WEBP,
              }}
              responsive={[
                {
                  size: {
                    width: 376,
                    height: 212,
                  },
                },
              ]}
            />
          )}
          <Row justify="center" align="center">
            <Spacer y={0.5} />
            <Text size={18} b color={colorDarkenLighten}>
              {title}
            </Text>
          </Row>
          {overview && (
            <Row>
              {item?.genreIds?.slice(0, 3).map((genreId) => {
                if (mediaType === 'movie') {
                  return (
                    <>
                      {genresMovie?.[genreId]}
                      <Spacer x={0.5} />
                    </>
                  );
                }
                return (
                  <>
                    {genresTv?.[genreId]}
                    <Spacer x={0.5} />
                  </>
                );
              })}
            </Row>
          )}
          {overview && (
            <Row>
              <Text>{`${overview?.substring(0, 100)}...`}</Text>
            </Row>
          )}
          <Grid.Container justify="space-between" alignContent="center">
            {releaseDate && (
              <Grid>
                <Text>{`${mediaType === 'movie' ? 'Movie' : 'TV-Shows'} • ${releaseDate}`}</Text>
              </Grid>
            )}
            {voteAverage && (
              <Grid>
                <Row>
                  <Text
                    weight="bold"
                    size="$xs"
                    css={{
                      backgroundColor: '#3ec2c2',
                      borderRadius: '$xs',
                      padding: '0 0.25rem 0 0.25rem',
                      marginRight: '0.5rem',
                    }}
                  >
                    TMDb
                  </Text>
                  <Text size="$sm" weight="bold">
                    {item?.voteAverage?.toFixed(1)}
                  </Text>
                </Row>
              </Grid>
            )}
          </Grid.Container>
        </>
      )}
    </Grid.Container>
  );
};

const CardItem = ({
  item,
  genresMovie,
  genresTv,
}: {
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
}) => {
  const { title, posterPath } = item;
  const { isDark, colorDarkenLighten } = useColorDarkenLighten(posterPath);
  const { ref, inView } = useInView({
    rootMargin: '500px 200px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
    triggerOnce: true,
  });
  const isSm = useMediaQuery(650, 'max');
  const isLg = useMediaQuery(1400, 'max');

  return (
    <>
      <Card
        as="div"
        isHoverable
        isPressable
        css={{ borderWidth: 0 }}
        className={isDark ? 'bg-black/70' : 'bg-white/70'}
        role="figure"
        ref={ref}
      >
        {inView && (
          <Card.Body css={{ p: 0 }}>
            {posterPath ? (
              <Card.Image
                // @ts-ignore
                as={Image}
                src={posterPath || ''}
                objectFit="cover"
                width="100%"
                height="auto"
                alt={title}
                title={title}
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
        )}
        <Tooltip
          placement="bottom"
          content={<CardItemHover item={item} genresMovie={genresMovie} genresTv={genresTv} />}
          rounded
          shadow
          className="!w-fit"
        >
          <Card.Footer
            css={{
              justifyItems: 'flex-start',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minHeight: '4.875rem',
              maxWidth: `${isSm ? '164px' : isLg ? '210px' : '240px'}`,
            }}
          >
            <Text
              size={14}
              b
              css={{
                minWidth: `${isSm ? '130px' : isLg ? '180px' : '210px'}`,
                padding: '0 0.25rem',
                '@xs': {
                  fontSize: '16px',
                },
                '@sm': {
                  fontSize: '18px',
                },
                '&:hover': {
                  color: colorDarkenLighten,
                },
              }}
            >
              {title}
            </Text>
          </Card.Footer>
        </Tooltip>
      </Card>

      <Spacer y={1} />
    </>
  );
};

export default CardItem;
