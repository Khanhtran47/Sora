import { Card, Col, Text } from '@nextui-org/react';
import { IMedia } from '~/models/tmdb.types';

interface IMediaItem {
  type: 'banner' | 'card';
  item: IMedia;
}

const BannerItem = ({ item }: { item: IMedia }) => <p>Banner, {item.title}</p>;

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
