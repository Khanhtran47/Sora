import * as React from 'react';
import { Container, Text, Grid, Spacer, Dropdown, Radio } from '@nextui-org/react';
import { IGenre } from '~/services/tmdb/tmdb.types';

interface IFilterProps {
  genres: IGenre[];
  onChange: (value: string) => void;
}

const Filter = (props: IFilterProps) => {
  const { onChange, genres } = props;
  console.log(genres);

  const [selected, setSelected] = React.useState(new Set(['All']));

  const selectedValue = React.useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected],
  );
  return (
    <Container fluid>
      {genres && (
        <>
          <Dropdown>
            <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedValue}</Dropdown.Button>
            <Dropdown.Menu
              aria-label="Multiple selection actions"
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={selected}
              onSelectionChange={setSelected}
            >
              {genres?.map((genre) => (
                <Dropdown.Item key={genre.name}>{genre.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Spacer />
        </>
      )}
      <Radio.Group
        orientation="horizontal"
        label="List type"
        defaultValue="grid"
        onChange={onChange}
      >
        <Radio value="grid" color="secondary" size="sm">
          Grid
        </Radio>
        <Radio value="table" color="success" size="sm">
          Table
        </Radio>
      </Radio.Group>
    </Container>
  );
};

export default Filter;
