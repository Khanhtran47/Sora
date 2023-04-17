import { Divider } from '@nextui-org/react';
import { useMeasure } from '@react-hookz/web';
import type { IMedia } from '~/types/media';
import { RowItem } from '../item';

type IProps = {
  items?: IMedia[];
  simplified?: boolean;
  sorted?: boolean;
};

const MediaListTable = (props: IProps) => {
  const { items, simplified, sorted } = props;
  const [size, ref] = useMeasure<HTMLDivElement>();

  if (items && simplified && sorted) {
    items.sort((a, b) => {
      if (!a.releaseDate) return -1;
      if (!b.releaseDate) return 1;

      const yearA: number = new Date(a.releaseDate).getFullYear();
      const yearB: number = new Date(b.releaseDate).getFullYear();

      return yearB - yearA;
    });

    const arrItems = [];
    let currentValue;
    let currentArr: IMedia[] = [];

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (!item.releaseDate) {
        currentArr.push(item);
      } else if (!currentValue) {
        arrItems.push(currentArr.slice());
        currentValue = new Date(item.releaseDate).getFullYear();
        currentArr = [item];
      } else if (new Date(item.releaseDate).getFullYear() === currentValue) {
        currentArr.push(item);
      } else {
        arrItems.push(currentArr.slice());
        currentArr = [item];
        currentValue = new Date(item.releaseDate).getFullYear();
      }
    }

    return (
      <div ref={ref} style={{ padding: '1rem 0.5rem' }}>
        {arrItems.map((arr, index) => (
          <>
            {arr.map((item) => (
              <RowItem
                key={`${item.id}-${index}-card-row`}
                item={item}
                containerWidth={size?.width || 0}
                simplified={simplified}
              />
            ))}
            {index !== arrItems.length - 1 && (
              <Divider height={3} y={2.5} css={{ marginTop: '-1rem' }} />
            )}
          </>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ padding: '1rem 0.5rem' }}>
      {items &&
        items.map((item) => (
          <RowItem
            key={item.id}
            item={item}
            containerWidth={size?.width || 0}
            simplified={simplified}
          />
        ))}
    </div>
  );
};

export default MediaListTable;
