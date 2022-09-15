/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, Grid, Loading, Row, Spacer, Text, Tooltip } from '@nextui-org/react';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IMedia } from '~/services/tmdb/tmdb.types';
import Image, { MimeType } from 'remix-image';
import { useInView } from 'react-intersection-observer';

const CardItemHover = ({ item }: { item: IMedia }) => {
  const { title, overview, releaseDate, voteAverage, mediaType, posterPath } = item;
  const { loading, colorDarkenLighten } = useColorDarkenLighten(posterPath);
  // TODO: add spinner on loading color

  return (
    <Grid.Container
      css={{
        width: 'inherit',
        padding: '0.75rem',
        minWidth: '100px',
        maxWidth: '350px',
      }}
    >
      {loading ? (
        <Loading type="points-opacity" />
      ) : (
        <>
          <Row justify="center" align="center">
            <Text size={18} b color={colorDarkenLighten}>
              {title}
            </Text>
          </Row>
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
                <Text>{`Vote Average: ${voteAverage}`}</Text>
              </Grid>
            )}
          </Grid.Container>
        </>
      )}
    </Grid.Container>
  );
};

const CardItem = ({ item }: { item: IMedia }) => {
  const { title, posterPath } = item;
  const { isDark, colorDarkenLighten } = useColorDarkenLighten(posterPath);
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
        css={{ borderWidth: 0 }}
        className={isDark ? 'bg-black/70' : 'bg-white/70'}
        role="figure"
        ref={ref}
      >
        {inView && (
          <Card.Body css={{ p: 0 }}>
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
                minWidth: 'auto !important',
              }}
              showSkeleton
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
                  maxWidth: 375,
                },
                {
                  size: {
                    width: 301,
                    height: 452,
                  },
                  maxWidth: 650,
                },
                {
                  size: {
                    width: 342,
                    height: 513,
                  },
                  maxWidth: 1279,
                },
                {
                  size: {
                    width: 292,
                    height: 438,
                  },
                  maxWidth: 1399,
                },
                {
                  size: {
                    width: 270,
                    height: 460,
                  },
                },
              ]}
            />
          </Card.Body>
        )}
        <Card.Footer
          css={{
            justifyItems: 'flex-start',
            flexDirection: 'column',
            alignItems: 'flex-start',
            minHeight: '4.875rem',
          }}
        >
          <Tooltip
            placement="bottom"
            content={<CardItemHover item={item} />}
            rounded
            shadow
            className="!w-fit"
          >
            <Text
              size={14}
              b
              css={{
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
          </Tooltip>
        </Card.Footer>
      </Card>

      <Spacer y={1} />
    </>
  );
};

export default CardItem;
