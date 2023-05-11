import { Button, ButtonGroup } from '@nextui-org/button';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import ViewGridCard from '~/assets/icons/ViewGridCardIcon';
import ViewGridDetail from '~/assets/icons/ViewGridDetailIcon';
import ViewGridTable from '~/assets/icons/ViewGridTableIcon';

const ListViewChangeButton = () => {
  const { listViewType } = useSoraSettings();
  return (
    <ButtonGroup color="primary">
      <Button
        type="button"
        onPress={() => listViewType.set('card')}
        isIconOnly
        {...(listViewType.value === 'card' ? {} : { variant: 'ghost' })}
      >
        <ViewGridCard width={40} height={40} />
      </Button>
      <Button
        type="button"
        onPress={() => listViewType.set('detail')}
        isIconOnly
        {...(listViewType.value === 'detail' ? {} : { variant: 'ghost' })}
      >
        <ViewGridDetail width={40} height={40} />
      </Button>
      <Button
        type="button"
        onPress={() => listViewType.set('table')}
        isIconOnly
        {...(listViewType.value === 'table' ? {} : { variant: 'ghost' })}
      >
        <ViewGridTable width={40} height={40} />
      </Button>
    </ButtonGroup>
  );
};

export default ListViewChangeButton;
