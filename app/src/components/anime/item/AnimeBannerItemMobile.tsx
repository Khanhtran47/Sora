/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Card, Text, Row, Col, Spacer } from '@nextui-org/react';
// import { Link } from '@remix-run/react';
import Image, { MimeType } from 'remix-image';

import useColorDarkenLighten from '~/hooks/useColorDarkenLighten';
import { IAnimeResult } from '~/services/consumet/anilist/anilist.types';

const AnimeBannerItemMobile = ({ item }: { item: IAnimeResult }) => {
  const { cover, title, rating, genres } = item;
  const { colorDarkenLighten } = useColorDarkenLighten(cover);

  return (
    // <Link to={}>
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
            {title?.userPreferred || title?.english || title?.romaji || title?.native}
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
              Anilist
            </Text>
            <Text size="$sm" weight="bold">
              {rating}%
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
              {genres?.slice(0, 2).map((genre) => (
                <>
                  {genre}
                  <Spacer x={0.5} />
                </>
              ))}
            </Text>
          </Row>
        </Col>
      </Card.Footer>
    </Card>
    // </Link>
  );
};

export default AnimeBannerItemMobile;
