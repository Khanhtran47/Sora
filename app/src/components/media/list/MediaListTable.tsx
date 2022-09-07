import { IMedia } from '~/services/tmdb/tmdb.types';
import { RowItem } from '../item';

const MediaListTable = ({ items }: { items: IMedia[] }) => (
  <>
    {items.map((item) => (
      <RowItem key={item.id} item={item} />
    ))}
  </>
);

export default MediaListTable;
