/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Row, Grid, Button, Dropdown } from '@nextui-org/react';
import { useLocation, useNavigate, Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { ILanguage } from '~/services/tmdb/tmdb.types';

import { H6 } from '~/src/components/styles/Text.styles';

interface IFilterProps {
  genres?: { [id: string]: string };
  onChange: (value: string) => void;
  listType: string;
  mediaType?: 'movie' | 'tv';
  languages?: ILanguage[];
}

const sortMovieItems = ['popularity', 'release_date', 'original_title', 'vote_average'];
const sortTvItems = ['popularity', 'first_air_date', 'vote_average'];
const tvStatus: { [id: string]: string } = {
  0: 'Returning Series',
  1: 'Planned',
  2: 'In Production',
  3: 'Ended',
  4: 'Canceled',
  5: 'Pilot',
};
const tvType: { [id: string]: string } = {
  0: 'Documentary',
  1: 'News',
  2: 'Miniseries',
  3: 'Reality',
  4: 'Scripted',
  5: 'Talk Show',
  6: 'Video',
};

const Filter = (props: IFilterProps) => {
  const { onChange, genres, listType, mediaType, languages } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sortItems = mediaType === 'movie' ? sortMovieItems : sortTvItems;
  const languageItems = React.useMemo(() => {
    const languagesSorted =
      languages?.sort((a, b) => {
        const textA = a.english_name.toUpperCase();
        const textB = b.english_name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      }) || [];
    return [{ iso_639_1: 'All', english_name: t('all'), name: t('all') }, ...languagesSorted];
  }, [languages, t]);

  const searchParams = new URLSearchParams(location.search);
  const preGenres = searchParams.get('with_genres');
  const preLanguages = searchParams.get('with_original_language');
  const preStatus = searchParams.get('with_status');
  const preType = searchParams.get('with_type');
  const preSort = searchParams.get('sort_by');

  const preGenresSet = !preGenres ? new Set(['All']) : new Set(['All', ...preGenres.split(',')]);
  const preLanguagesSet = !preLanguages ? new Set(['All']) : new Set([preLanguages]);
  const preStatusSet = !preStatus ? new Set(['All']) : new Set(['All', ...preStatus.split(',')]);
  const preTypeSet = !preType ? new Set(['All']) : new Set(['All', ...preType.split(',')]);
  const preSortSet = !preSort ? new Set(['popularity']) : new Set([preSort.split('.')[0]]);

  const [genre, setGenre] = React.useState(preGenresSet);
  const [lang, setLanguage] = React.useState(preLanguagesSet);
  const [status, setStatus] = React.useState(preStatusSet);
  const [type, setType] = React.useState(preTypeSet);
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

  const selectedLanguage = React.useMemo(
    () =>
      languages?.find((item) => item.iso_639_1 === Array.from(lang)[0])?.english_name || t('all'),
    [lang, languages, t],
  );

  const selectedStatus = React.useMemo(
    () =>
      Array.from(status)
        .slice(1)
        .map((key) => tvStatus[key])
        .join(', ') || t('all'),
    [status, t],
  );

  const selectedType = React.useMemo(
    () =>
      Array.from(type)
        .slice(1)
        .map((key) => tvType[key])
        .join(', ') || t('all'),
    [type, t],
  );

  const selectedSort = React.useMemo(() => t(Array.from(sort)[0]), [sort, t]);

  const setQueryHandler = React.useCallback(
    (_genre = genre, _lang = lang, _status = status, _type = type, _sort = sort) => {
      let newQuery = '';
      const params = new URLSearchParams();
      if (_genre.size > 1) {
        params.append('with_genres', Array.from(_genre).slice(1).join(','));
      }
      if (Array.from(_lang)[0] !== 'All') {
        params.append('with_original_language', Array.from(_lang)[0] as string);
      }
      if (_status.size > 1) {
        params.append('with_status', Array.from(_status).slice(1).join(','));
      }
      if (_type.size > 1) {
        params.append('with_type', Array.from(_type).slice(1).join(','));
      }
      params.append('sort_by', Array.from(_sort)[0] as string);
      newQuery = `?${params.toString()}`;

      if (mediaType === 'tv' && Array.from(_sort)[0] === 'original_title') newQuery += '.asc';
      else newQuery += '.desc';

      setQuery(newQuery);
    },
    [genre, lang, status, type, sort, mediaType],
  );

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(query);
  };

  React.useEffect(
    () => setQueryHandler(genre, lang, status, type, sort),
    [genre, lang, status, type, sort, setQueryHandler],
  );

  return (
    <Grid.Container
      // @ts-ignore
      as={Form}
      gap={2}
      justify="flex-end"
      alignItems="center"
      css={{
        padding: '$xs',
        '@md': {
          padding: '$md',
        },
      }}
      onSubmit={submitHandler}
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
                aria-label="Genres Selection"
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
          <H6 h6> {t('language')} </H6>
        </Row>
        <Row css={{ margin: '6px' }}>
          {languageItems && (
            <Dropdown>
              <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedLanguage}</Dropdown.Button>
              <Dropdown.Menu
                aria-label="Original Language Selection"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={lang}
                onSelectionChange={(key: any) => setLanguage(key)}
              >
                {languageItems.map(({ name, english_name, iso_639_1 }) => (
                  <Dropdown.Item key={iso_639_1}>{english_name || name}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Row>
      </Grid>
      {mediaType === 'tv' ? (
        <>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('status')} </H6>
            </Row>
            <Row css={{ margin: '6px' }}>
              {tvStatus && (
                <Dropdown>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedStatus}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Status Selection"
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={status}
                    onSelectionChange={(key: any) => setStatus(key)}
                  >
                    {Object.keys(tvStatus).map((id) => (
                      <Dropdown.Item key={id}>{tvStatus[id]}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Row>
          </Grid>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('type')} </H6>
            </Row>
            <Row css={{ margin: '6px' }}>
              {tvType && (
                <Dropdown>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedType}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Type Selection"
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={type}
                    onSelectionChange={(key: any) => setType(key)}
                  >
                    {Object.keys(tvType).map((id) => (
                      <Dropdown.Item key={id}>{tvType[id]}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Row>
          </Grid>
        </>
      ) : null}
      <Grid>
        <Row justify="center">
          <H6 h6> {t('sortBy')} </H6>
        </Row>
        <Row css={{ margin: '6px' }}>
          <Dropdown>
            <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedSort}</Dropdown.Button>
            <Dropdown.Menu
              aria-label="Sort By Selection"
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
          <Button auto type="submit">
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
