/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, Text, Row, Col, Spacer } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IMedia } from '~/services/tmdb/tmdb.types';

const BannerItemMobile = ({
  item,
  genresMovie,
  genresTv,
}: {
  item: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
}) => {
  const { backdropPath, title, mediaType, id } = item;
  const { colorDarkenLighten } = useColorDarkenLighten(backdropPath);

  return (
    <Link to={`/${mediaType === 'movie' ? 'movies/' : 'tv-shows/'}${id}`}>
      <Card
        as="div"
        isPressable
        css={{
          marginTop: '4rem',
          w: '100%',
          position: 'relative',
          borderWidth: 0,
          paddingBottom: '56.25%',
          aspectRatio: '16 / 9',
        }}
        className={colorDarkenLighten}
        role="figure"
      >
        <Card.Image
          // @ts-ignore
          as={Image}
          src={backdropPath || ''}
          loading="eager"
          width="100%"
          height="100%"
          css={{
            opacity: 0.3,
            height: 'auto',
            maxHeight: '605px !important',
            minHeight: 'auto !important',
            minWidth: 'auto !important',
          }}
          containerCss={{
            overflow: 'visible',
          }}
          objectFit="cover"
          alt={title}
          title={title}
          loaderUrl="/api/image"
          placeholder="blur"
          responsive={[
            {
              size: {
                width: 375,
                height: 605,
              },
              maxWidth: 375,
            },
            {
              size: {
                width: 650,
                height: 605,
              },
            },
          ]}
          options={{
            contentType: MimeType.WEBP,
          }}
        />
        <Card.Footer css={{ position: 'absolute', zIndex: 1, bottom: 0 }}>
          <Col
            css={{
              marginLeft: '5vw',
              marginRight: '5vw',
              '@sm': {
                marginLeft: '10vw',
              },
            }}
          >
            <Text
              size={28}
              weight="bold"
              color={colorDarkenLighten || undefined}
              css={{
                transition: 'color 0.25s ease 0s',
                margin: 0,
                lineHeight: 'var(--nextui-lineHeights-base)',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                '@xs': {
                  fontSize: '38px',
                },
                '@sm': {
                  fontSize: '48px',
                },
                '@md': {
                  fontSize: '58px',
                },
              }}
            >
              {title}
            </Text>
            <Row css={{ marginTop: '1.25rem' }} align="center">
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
              <Spacer x={1.5} />
              <Text
                h3
                size="$xs"
                css={{
                  display: 'flex',
                  flexDirection: 'row',
                  margin: 0,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {item?.genreIds?.map((genreId) => {
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
              </Text>
            </Row>
          </Col>
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default BannerItemMobile;
