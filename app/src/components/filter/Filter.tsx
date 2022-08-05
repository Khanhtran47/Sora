import * as React from 'react';
import { Row, Text, Grid, Button, Dropdown } from '@nextui-org/react';
import { IGenre } from '~/services/tmdb/tmdb.types';

interface IFilterProps {
  genres: IGenre[] | undefined;
  onChange: (value: string) => void;
  listType: string;
}

const Filter = (props: IFilterProps) => {
  const { onChange, genres, listType } = props;

  const [genre, setGenre] = React.useState(new Set(['All']));
  const [sort, setSort] = React.useState(new Set(['Popularity']));

  const selectedGenre = React.useMemo(
    () => Array.from(genre).join(', ').replaceAll('_', ' '),
    [genre],
  );

  const selectedSort = React.useMemo(
    () => Array.from(sort).join(', ').replaceAll('_', ' '),
    [sort],
  );
  const sortItems = [
    { key: 'populariy', name: 'Popularity' },
    { key: 'release_date', name: 'Release Date' },
    { key: 'original_title', name: 'Name' },
    { key: 'vote_average', name: 'Vote Average' },
  ];
  return (
    <Grid.Container
      gap={2}
      justify="flex-end"
      alignItems="center"
      css={{
        padding: '10px 50px',
      }}
    >
      <Grid>
        <Row justify="center">
          <Text small size={16}>
            Genre
          </Text>
        </Row>
        <Row css={{ margin: '6px' }}>
          {genres && (
            <Dropdown>
              <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedGenre}</Dropdown.Button>
              <Dropdown.Menu
                aria-label="Multiple selection actions"
                disallowEmptySelection
                selectionMode="multiple"
                selectedKeys={genre}
                onSelectionChange={setGenre}
              >
                {genres?.map((genreItem) => (
                  <Dropdown.Item key={genreItem.name}>{genreItem.name}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Row>
      </Grid>
      <Grid>
        <Row justify="center">
          <Text small size={16}>
            Sort By
          </Text>
        </Row>
        <Row css={{ margin: '6px' }}>
          <Dropdown>
            <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedSort}</Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={sort}
              onSelectionChange={setSort}
            >
              {sortItems?.map((item) => (
                <Dropdown.Item key={item.name}>{item.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Row>
      </Grid>
      <Grid>
        <Row justify="center">
          <Text small size={16}>
            List type
          </Text>
        </Row>
        <Row>
          <Button.Group>
            <Button
              type="button"
              onClick={() => onChange('grid')}
              {...(listType === 'grid' ? {} : { ghost: true })}
            >
              Grid
            </Button>
            <Button
              type="button"
              onClick={() => onChange('table')}
              {...(listType === 'table' ? {} : { ghost: true })}
            >
              Table
            </Button>
          </Button.Group>
        </Row>
      </Grid>
    </Grid.Container>
  );
};

export default Filter;
