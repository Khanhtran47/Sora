/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Row, Grid, Button, Dropdown } from '@nextui-org/react';
import { useLocation, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { H6 } from '~/src/components/styles/Text.styles';

interface IFilterProps {
  genres?: { [id: string]: string };
  onChange: (value: string) => void;
  listType: string;
  mediaType?: 'movie' | 'tv';
}

const sortMovieItems = ['popularity', 'release_date', 'original_title', 'vote_average'];

const sortTvItems = ['popularity', 'first_air_date', 'vote_average'];

const Filter = (props: IFilterProps) => {
  const { onChange, genres, listType, mediaType } = props;
  const sortItems = mediaType === 'movie' ? sortMovieItems : sortTvItems;

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const urlObject = new URL(`http://abc${location.search}`);
  const preGenres = urlObject.searchParams.get('with_genres');
  const preSort = urlObject.searchParams.get('sort_by');

  const preGenresSet = !preGenres ? new Set(['All']) : new Set(['All', ...preGenres.split(',')]);
  const preSortSet = !preSort ? new Set(['popularity']) : new Set([preSort.split('.')[0]]);

  const [genre, setGenre] = React.useState(preGenresSet);
  const [sort, setSort] = React.useState(preSortSet);
  const [query, setQuery] = React.useState('');

  const selectedGenre = React.useMemo(
    () =>
      Array.from(genre)
        .slice(1)
        .map((key) => genres && genres[key])
        .join(', ')
        .replaceAll('_', ' ') || t('all'),
    [genre, genres, t],
  );

  const selectedSort = React.useMemo(() => t(Array.from(sort)[0]), [sort, t]);

  const setQueryHandler = React.useCallback(
    (_genre = genre, _sort = sort) => {
      let newQuery = '';
      if (_genre.size <= 1) {
        newQuery = `?sort_by=${Array.from(_sort)[0]}`;
      } else {
        newQuery = `?with_genres=${Array.from(_genre).slice(1).join(',')}&sort_by=${
          Array.from(_sort)[0]
        }`;
      }

      if (mediaType === 'tv' && Array.from(_sort)[0] === 'original_title') newQuery += '.asc';
      else newQuery += '.desc';

      setQuery(newQuery);
    },
    [genre, sort, mediaType],
  );

  React.useEffect(() => setQueryHandler(genre, sort), [genre, sort, setQueryHandler]);

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
          <H6 h6> {t('genre')} </H6>
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
                onSelectionChange={(key: any) => setGenre(key)}
              >
                {Object.keys(genres).map((id) => (
                  <Dropdown.Item key={id}>{genres[id]}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Row>
      </Grid>
      <Grid>
        <Row justify="center">
          <H6 h6> {t('sortBy')} </H6>
        </Row>
        <Row css={{ margin: '6px' }}>
          <Dropdown>
            <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedSort}</Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={sort}
              onSelectionChange={(keys: any) => setSort(keys)}
            >
              {sortItems.map((item) => (
                <Dropdown.Item key={item}>{t(item)}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Row>
      </Grid>
      <Grid>
        <Row justify="center">
          <H6 h6> {t('discover')} </H6>
        </Row>
        <Row css={{ margin: '6px' }}>
          <Button auto onClick={() => navigate(query)}>
            {t('letsGo')}
          </Button>
        </Row>
      </Grid>
      <Grid>
        <Row justify="center">
          <H6 h6> {t('listType')} </H6>
        </Row>
        <Row>
          <Button.Group>
            <Button
              type="button"
              onClick={() => onChange('grid')}
              {...(listType === 'grid' ? {} : { ghost: true })}
            >
              {t('grid')}
            </Button>
            <Button
              type="button"
              onClick={() => onChange('table')}
              {...(listType === 'table' ? {} : { ghost: true })}
            >
              {t('table')}
            </Button>
          </Button.Group>
        </Row>
      </Grid>
    </Grid.Container>
  );
};

export default Filter;
