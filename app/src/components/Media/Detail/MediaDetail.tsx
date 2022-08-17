/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, useEffect, useRef } from 'react';
import { Card } from '@nextui-org/react';

import { IMovieDetail, ITvShowDetail } from '~/services/tmdb/tmdb.types';
import TMDB from '~/utils/media';
import CardHeader from './CardHeader';

interface IMediaDetail {
  type: 'movie' | 'tv';
  item: IMovieDetail | ITvShowDetail | undefined;
}

const MediaDetail = (props: IMediaDetail) => {
  const { type, item } = props;
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref?.current && setHeight(ref.current.clientHeight);
  }, [ref?.current?.clientHeight]);

  // TODO: style mobile in landscape mode
  // const isMdLand = useMediaQuery(960, 'max', 'landscape');

  const backdropPath = TMDB?.backdropUrl(item?.backdrop_path || '', 'original');

  // TODO: get and show IMDB score

  return (
    <Card
      variant="flat"
      css={{
        display: 'flex',
        flexFlow: 'column',
        width: '100vw',
        height: `${height}px`,
        borderWidth: 0,
      }}
    >
      <Card.Header ref={ref} css={{ position: 'absolute', zIndex: 1, flexGrow: 1 }}>
        <CardHeader type={type} item={item} />
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

export default MediaDetail;
