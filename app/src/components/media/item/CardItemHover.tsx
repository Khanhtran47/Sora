/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Grid, Loading, Row, Spacer, Text, Image as NextImage } from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IMedia } from '~/services/tmdb/tmdb.types';

const CardItemHover = ({
  item,
  genresMovie,
  genresTv,
}: {
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
}) => {
  const { title, overview, releaseDate, voteAverage, mediaType, posterPath, backdropPath } = item;
  const { loading, colorDarkenLighten } = useColorDarkenLighten(posterPath);

  return (
    <Grid.Container
      css={{
        padding: '0.75rem 0.375rem',
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

export default CardItemHover;
