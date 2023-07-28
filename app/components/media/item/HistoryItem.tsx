import { Card, CardBody } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { Link } from '@remix-run/react';
import { MimeType } from 'remix-image';

import type { IHistory } from '~/services/supabase';
import Image from '~/components/elements/Image';
import notFound from '~/assets/images/404.gif';

interface IHistoryItem {
  item: IHistory;
}

const HistoryItem = ({ item }: IHistoryItem) => {
  const watched = Math.round((item?.watched / item?.duration) * 100);

  const url = new URL(`http://abc${item?.route}`);
  if (item?.watched !== 0) {
    url.searchParams.set('t', item.watched.toString());
  }

  return (
    <Link to={url.pathname + url.search} className="w-[304px] sm:w-full">
      <Card
        isPressable
        isHoverable
        className="data-[hover=true]:ring-2 data-[hover=true]:ring-focus sm:!max-h-[171px] sm:w-full"
      >
        <CardBody className="flex flex-col flex-nowrap justify-start overflow-hidden p-0 sm:flex-row">
          <Image
            width="304px"
            height="171px"
            src={item?.poster || notFound}
            alt={item?.title}
            title={item?.title}
            classNames={{
              wrapper: 'z-0 m-0 min-h-[171px] min-w-[304px] overflow-hidden',
            }}
            placeholder="empty"
            loading="lazy"
            options={{ contentType: MimeType.WEBP }}
            responsive={[{ size: { width: 304, height: 171 } }]}
          />
          <div className="flex flex-col justify-start p-3">
            <h4 className="line-clamp-1">{item?.title}</h4>
            {item?.season ? <p>SS {item.season}&ensp;-&ensp;</p> : null}
            {item?.episode ? <p>EP {item.episode.split('-').at(-1)}</p> : null}
            <p>{new Date(item?.updated_at.toString()).toLocaleString()}</p>
          </div>
          {watched > 5 ? (
            <Progress
              size="sm"
              value={watched}
              color="primary"
              className="!absolute bottom-0 w-full"
            />
          ) : null}
        </CardBody>
      </Card>
    </Link>
  );
};

export default HistoryItem;
