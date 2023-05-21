import { Button, ButtonGroup } from '@nextui-org/button';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import ViewGridCard from '~/assets/icons/ViewGridCardIcon';
import ViewGridDetail from '~/assets/icons/ViewGridDetailIcon';
import ViewGridTable from '~/assets/icons/ViewGridTableIcon';

const ListViewChangeButton = () => {
  const { listViewType } = useSoraSettings();
  return (
    <ButtonGroup>
      <Button
        type="button"
        onPress={() => listViewType.set('card')}
        isIconOnly
        {...(listViewType.value === 'card' ? { color: 'primary' } : { variant: 'ghost' })}
      >
        <ViewGridCard width={40} height={40} />
      </Button>
      <Button
        type="button"
        onPress={() => listViewType.set('detail')}
        isIconOnly
        {...(listViewType.value === 'detail' ? { color: 'primary' } : { variant: 'ghost' })}
      >
        <ViewGridDetail width={40} height={40} />
      </Button>
      <Button
        type="button"
        onPress={() => listViewType.set('table')}
        isIconOnly
        {...(listViewType.value === 'table' ? { color: 'primary' } : { variant: 'ghost' })}
      >
        <ViewGridTable width={40} height={40} />
      </Button>
    </ButtonGroup>
  );
};

export default ListViewChangeButton;
