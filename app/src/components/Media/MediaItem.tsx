import { Link } from '@remix-run/react';
import { Card, Col, Text, Row, Button } from '@nextui-org/react';
import { IMedia } from '~/models/tmdb.types';

interface IMediaItem {
  type: 'banner' | 'card';
  item: IMedia;
}

const BannerItem = ({ item }: { item: IMedia }) => {
  const { backdropPath, overview, posterPath, title, id, mediaType } = item;
  return (
    <Card css={{ w: '100vw', h: '100vh' }}>
      <Card.Header css={{ position: 'absolute', zIndex: 1 }}>
        <Row>
          <Col css={{ marginTop: '25vh', marginLeft: '10vw' }}>
            <Text size={68} weight="bold" transform="uppercase" color="black" css={{ margin: 0 }}>
              {title}
            </Text>
            <Text size={18} weight="bold" color="black" css={{ margin: '5vh 0 0 0' }}>
              {overview}
            </Text>
            <Row>
              <Col span={4}>
                <Button
                  size="lg"
                  shadow
                  rounded
                  color="gradient"
                  css={{
                    marginTop: '5vh',
                  }}
                >
                  <Link to={`/${mediaType === 'movie' ? 'movies/' : 'tv-shows/'}${id}`}>
                    <Text size={24} weight="bold" transform="uppercase">
                      Watch now
                    </Text>
                  </Link>
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  size="lg"
                  shadow
                  rounded
                  bordered
                  color="gradient"
                  css={{
                    marginTop: '5vh',
                  }}
                >
                  <Text size={24} weight="bold" transform="uppercase">
                    Watch trailer
                  </Text>
                </Button>
              </Col>
            </Row>
          </Col>
          <Col>
            <Card.Image
              src={posterPath}
              alt={title}
              objectFit="cover"
              width="40%"
              height="40%"
              css={{
                marginTop: '20vh',
                borderRadius: '12px',
              }}
            />
          </Col>
        </Row>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src={backdropPath}
          css={{
            minHeight: '100vh',
            minWidth: '100vw',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            objectFit: 'cover',
            opacity: 0.3,
          }}
          alt="Card example background"
        />
      </Card.Body>
    </Card>
  );
};

const CardItem = ({ item }: { item: IMedia }) => {
  const { title, posterPath } = item;

  return (
    <Card>
      <Card.Header css={{ position: 'absolute', zIndex: 1, top: 5 }}>
        <Col>
          <Text h4 color="white">
            {title}
          </Text>
        </Col>
      </Card.Header>
      <Card.Image
        src={posterPath}
        objectFit="cover"
        width="100%"
        height={340}
        alt="Card image background"
      />
    </Card>
  );
};

const MediaItem = (props: IMediaItem) => {
  const { type, item } = props;

  if (type === 'banner') {
    return <BannerItem item={item} />;
  }
  return <CardItem item={item} />;
};

export default MediaItem;
