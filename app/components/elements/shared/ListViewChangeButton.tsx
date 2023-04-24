import { Button } from '@nextui-org/react';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import ViewGridCard from '~/assets/icons/ViewGridCardIcon';
import ViewGridDetail from '~/assets/icons/ViewGridDetailIcon';
import ViewGridTable from '~/assets/icons/ViewGridTableIcon';

const ListViewChangeButton = () => {
  const { listViewType } = useSoraSettings();
  return (
    <Button.Group css={{ margin: 0 }}>
      <Button
        type="button"
        onPress={() => listViewType.set('card')}
        icon={<ViewGridCard width={40} height={40} />}
        {...(listViewType.value === 'card' ? {} : { ghost: true })}
      />
      <Button
        type="button"
        onPress={() => listViewType.set('detail')}
        icon={<ViewGridDetail width={40} height={40} />}
        {...(listViewType.value === 'detail' ? {} : { ghost: true })}
      />
      <Button
        type="button"
        onPress={() => listViewType.set('table')}
        icon={<ViewGridTable width={40} height={40} />}
        {...(listViewType.value === 'table' ? {} : { ghost: true })}
      />
    </Button.Group>
  );
};

export default ListViewChangeButton;
