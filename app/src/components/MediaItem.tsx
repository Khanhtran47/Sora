import { Card, Col, Row, Button, Text } from '@nextui-org/react';
import { IMedia } from '~/models/tmdb.types';

interface IMediaItem {
  type: 'banner' | 'card';
  item: IMedia;
}

// TODO: redesign this card
const BannerItem = ({ item }: { item: IMedia }) => {
  console.log(item);
  return (
    <Card css={{ w: '100%', h: '600px' }}>
      <Card.Header css={{ position: 'absolute', zIndex: 1, top: 50, left: 20 }}>
        <Col>
          <Text h1 color="white" size={40} weight="bold" transform="uppercase">
            {item.title}
          </Text>
        </Col>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          showSkeleton
          src={item.backdropPath}
          objectFit="cover"
          width="100%"
          height="100%"
          alt="Relaxing app background"
          className="brightness-50"
        />
      </Card.Body>
      <Card.Footer
        isBlurred
        css={{
          position: 'absolute',
          bgBlur: '#ffffff66',
          borderTop: '$borderWeights$light solid rgba(255, 255, 255, 0.2)',
          bottom: 0,
          zIndex: 1,
          height: '200px',
        }}
      >
        <Row>
          <Col>
            <Row>
              <Col span={3}>
                <Card.Image
                  src="https://nextui.org/images/breathing-app-icon.jpeg"
                  css={{ bg: 'black', br: '50%' }}
                  height={40}
                  width={40}
                  alt="Breathing app icon"
                />
              </Col>
              <Col>
                <Text size={18} color="black">
                  {item.overview}
                </Text>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row justify="flex-end">
              <Button flat auto rounded css={{ color: '#94f9f0', bg: '#94f9f026' }}>
                <Text css={{ color: 'inherit' }} size={12} weight="bold" transform="uppercase">
                  Watch now
                </Text>
              </Button>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
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
        showSkeleton
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
