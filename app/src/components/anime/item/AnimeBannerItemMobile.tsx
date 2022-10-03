/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, Row, Col, Spacer } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';

import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';
import { H2, H5 } from '~/src/components/styles/Text.styles';
import AnilistStatIcon from '~/src/assets/icons/AnilistStatIcon.js';

const AnimeBannerItemMobile = ({ item }: { item: IAnimeResult }) => {
  const { id, cover, title, rating, genres } = item;

  return (
    <Link to={`/anime/${id}/overview`}>
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
          src={cover || ''}
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
          alt={title?.userPreferred || title?.english || title?.romaji || title?.native}
          title={title?.userPreferred || title?.english || title?.romaji || title?.native}
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
              {title?.userPreferred || title?.english || title?.romaji || title?.native}
            </H2>
            <Row css={{ marginTop: '1.25rem' }} align="center">
              {rating && (
                <>
                  {Number(rating) > 75 ? (
                    <AnilistStatIcon stat="good" />
                  ) : Number(rating) > 60 ? (
                    <AnilistStatIcon stat="average" />
                  ) : (
                    <AnilistStatIcon stat="bad" />
                  )}
                  <Spacer x={0.25} />
                  <H5 weight="bold">{rating}%</H5>
                  <Spacer x={1.5} />
                </>
              )}
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
                {genres?.slice(0, 2).map((genre) => (
                  <>
                    {genre}
                    <Spacer x={0.5} />
                  </>
                ))}
              </H5>
            </Row>
          </Col>
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default AnimeBannerItemMobile;
