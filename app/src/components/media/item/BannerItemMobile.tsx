/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, Row, Col, Spacer } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';

import { Title } from '~/types/media';

import { H2, H5 } from '~/src/components/styles/Text.styles';
import Rating from '~/src/components/elements/shared/Rating';

interface IBannerItemMobileProps {
  backdropPath: string;
  genreIds: number[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  id: number | string;
  mediaType: 'movie' | 'tv' | 'anime' | 'people';
  title: string | Title;
  voteAverage: number;
  genresAnime: string[];
}

const BannerItemMobile = (props: IBannerItemMobileProps) => {
  const {
    backdropPath,
    genreIds,
    genresMovie,
    genresTv,
    id,
    mediaType,
    title,
    voteAverage,
    genresAnime,
  } = props;

  const titleItem =
    typeof title === 'string'
      ? title
      : title?.userPreferred || title?.english || title?.romaji || title?.native;

  return (
    <Link
      to={`/${
        mediaType === 'movie' ? 'movies/' : mediaType === 'tv' ? 'tv-shows/' : 'anime/'
      }${id}/${mediaType === 'anime' ? 'overview' : ''}`}
    >
      <Card
        as="div"
        isPressable
        css={{
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
          showSkeleton
          objectFit="cover"
          alt={titleItem}
          title={titleItem}
          loaderUrl="/api/image"
          placeholder="empty"
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
              {titleItem}
            </H2>
            <Row css={{ marginTop: '1.25rem' }} align="center">
              <Rating
                rating={mediaType === 'anime' ? voteAverage : Number(voteAverage.toFixed(1))}
                ratingType={mediaType}
              />
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
                {mediaType === 'anime'
                  ? genresAnime?.slice(0, 2).map((genre) => (
                      <>
                        {genre}
                        <Spacer x={0.5} />
                      </>
                    ))
                  : genreIds?.map((genreId) => {
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
