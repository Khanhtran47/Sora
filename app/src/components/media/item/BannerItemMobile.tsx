/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, Row, Col, Spacer } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';

import { IMedia } from '~/services/tmdb/tmdb.types';
import { H2, H5 } from '~/src/components/styles/Text.styles';

const BannerItemMobile = ({
  item,
  genresMovie,
  genresTv,
}: {
  item?: IMedia;
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
}) => {
  const { backdropPath, title, mediaType, id } = item || {};

  return (
    <Link to={`/${mediaType === 'movie' ? 'movies/' : 'tv-shows/'}${id}/`}>
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
            <H2
              h2
              weight="bold"
              css={{
                margin: 0,
                lineHeight: 'var(--nextui-lineHeights-base)',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </H2>
            <Row css={{ marginTop: '1.25rem' }} align="center">
              <H5
                h5
                weight="bold"
                css={{
                  backgroundColor: '#3ec2c2',
                  borderRadius: '$xs',
                  padding: '0 0.25rem 0 0.25rem',
                  marginRight: '0.5rem',
                }}
              >
                TMDb
              </H5>
              <H5 h5 weight="bold">
                {item?.voteAverage?.toFixed(1)}
              </H5>
              <Spacer x={1.5} />
              <H5
                h5
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
              </H5>
            </Row>
          </Col>
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default BannerItemMobile;
