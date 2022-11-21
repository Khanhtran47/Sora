/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Row, Grid, Button, Dropdown, Input, useInput } from '@nextui-org/react';
import { useLocation, useNavigate, Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { ILanguage } from '~/services/tmdb/tmdb.types';

import { sortMovieItems, sortTvItems, tvStatus, tvType } from '~/src/constants/filterItems';

import { H6 } from '~/src/components/styles/Text.styles';
import Slider from '~/src/components/elements/slider/Slider';

interface IFilterProps {
  genres?: { [id: string]: string };
  mediaType?: 'movie' | 'tv';
  languages?: ILanguage[];
}

const Filter = (props: IFilterProps) => {
  const { genres, mediaType, languages } = props;
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
  const preDateGte = searchParams.get('date.gte');
  const preDateLte = searchParams.get('date.lte');
  const preVoteCount = searchParams.get('vote_count.gte');
  const preVoteAverageGte = searchParams.get('vote_average.gte');
  const preVoteAverageLte = searchParams.get('vote_average.lte');
  const preRuntimeGte = searchParams.get('with_runtime.gte');
  const preRuntimeLte = searchParams.get('with_runtime.lte');

  const preGenresSet = !preGenres ? new Set(['All']) : new Set(['All', ...preGenres.split(',')]);
  const preLanguagesSet = !preLanguages ? new Set(['All']) : new Set([preLanguages]);
  const preStatusSet = !preStatus ? new Set(['All']) : new Set(['All', ...preStatus.split(',')]);
  const preTypeSet = !preType ? new Set(['All']) : new Set(['All', ...preType.split(',')]);
  const preSortSet = !preSort ? new Set(['popularity']) : new Set([preSort.split('.')[0]]);
  const preVoteCountArray = preVoteCount ? [Number(preVoteCount)] : [300];
  const preVoteAverageArray =
    preVoteAverageGte || preVoteAverageLte
      ? [Number(preVoteAverageGte || 0), Number(preVoteAverageLte || 10)]
      : [0, 10];
  const preRuntimeArray =
    preRuntimeGte || preRuntimeLte
      ? [Number(preRuntimeGte || 0), Number(preRuntimeLte || 400)]
      : [0, 400];

  const {
    value: releaseDateFrom,
    setValue: setReleaseDateFrom,
    bindings: releaseDateFromBindings,
  } = useInput(preDateGte || '');
  const {
    value: releaseDateTo,
    setValue: setReleaseDateTo,
    bindings: releaseDateToBindings,
  } = useInput(preDateLte || '');
  const [genre, setGenre] = React.useState(preGenresSet);
  const [lang, setLanguage] = React.useState(preLanguagesSet);
  const [status, setStatus] = React.useState(preStatusSet);
  const [type, setType] = React.useState(preTypeSet);
  const [sort, setSort] = React.useState(preSortSet);
  const [voteCount, setVoteCount] = React.useState<number[]>(preVoteCountArray);
  const [voteAverage, setVoteAverage] = React.useState<number[] | undefined>(preVoteAverageArray);
  const [runtime, setRuntime] = React.useState<number[] | undefined>(preRuntimeArray);
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
    (
      _releaseDateFrom = releaseDateFrom,
      _releaseDateTo = releaseDateTo,
      _genre = genre,
      _lang = lang,
      _status = status,
      _type = type,
      _sort = sort,
      _voteCount = voteCount,
      _voteAverage = voteAverage,
      _runtime = runtime,
    ) => {
      let newQuery = '';
      const params = new URLSearchParams();
      if (_releaseDateFrom) {
        params.append('date.gte', _releaseDateFrom);
      }
      if (_releaseDateTo) {
        params.append('date.lte', _releaseDateTo);
      }
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
      if (_voteCount[0] >= 0) {
        params.append('vote_count.gte', _voteCount[0].toString());
      }
      if (_voteAverage) {
        if (_voteAverage[0] >= 0) params.append('vote_average.gte', _voteAverage[0].toString());
        if (_voteAverage[1] <= 10 && _voteAverage[1] >= 0)
          params.append('vote_average.lte', _voteAverage[1].toString());
      }
      if (_runtime) {
        if (_runtime[0] >= 0) params.append('with_runtime.gte', _runtime[0].toString());
        if (_runtime[1] <= 400 && _runtime[1] >= 0)
          params.append('with_runtime.lte', _runtime[1].toString());
      }
      params.append('sort_by', Array.from(_sort)[0] as string);
      newQuery = `?${params.toString()}`;

      if (mediaType === 'tv' && Array.from(_sort)[0] === 'original_title') newQuery += '.asc';
      else newQuery += '.desc';

      setQuery(newQuery);
    },
    [
      releaseDateFrom,
      releaseDateTo,
      genre,
      lang,
      status,
      type,
      sort,
      voteCount,
      voteAverage,
      runtime,
      mediaType,
    ],
  );

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(query);
  };

  React.useEffect(
    () =>
      setQueryHandler(
        releaseDateFrom,
        releaseDateTo,
        genre,
        lang,
        status,
        type,
        sort,
        voteCount,
        voteAverage,
        runtime,
      ),
    [
      releaseDateFrom,
      releaseDateTo,
      genre,
      lang,
      status,
      type,
      sort,
      voteCount,
      voteAverage,
      runtime,
      setQueryHandler,
    ],
  );

  return (
    <Grid.Container
      // @ts-ignore
      as={Form}
      gap={2}
      justify="flex-end"
      alignItems="stretch"
      wrap="wrap"
      css={{
        padding: '$xs',
        marginTop: '$10',
        marginBottom: '$6',
        borderRadius: '$lg',
        backgroundColor: '$backgroundContrast',
        '@mdMin': {
          marginTop: '$5',
          padding: '$md',
        },
      }}
      onSubmit={submitHandler}
    >
      <Grid>
        <Row justify="center">
          <H6 h6> {t('release-dates')} </H6>
        </Row>
        <Row gap={1} justify="space-between" align="center" wrap="wrap" css={{ marginTop: '6px' }}>
          <Input
            {...releaseDateFromBindings}
            clearable
            bordered
            color="primary"
            helperText={t('from')}
            type="date"
            css={{ marginBottom: '$12' }}
          />
          <Input
            {...releaseDateToBindings}
            clearable
            bordered
            color="primary"
            helperText={t('to')}
            type="date"
            css={{ marginBottom: '$12' }}
          />
        </Row>
      </Grid>
      <Grid>
        <Row justify="center">
          <H6 h6> {t('genre')} </H6>
        </Row>
        <Row css={{ marginTop: '6px' }}>
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
        <Row css={{ marginTop: '6px' }}>
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
            <Row css={{ marginTop: '6px' }}>
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
            <Row css={{ marginTop: '6px' }}>
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
        <Row css={{ marginTop: '6px' }}>
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
          <H6 h6> {t('minimum-user-votes')} </H6>
        </Row>
        <Row css={{ marginTop: '6px' }}>
          <Slider
            defaultValue={voteCount}
            value={voteCount}
            name="Minimum User Votes"
            min={0}
            max={500}
            step={50}
            onValueChange={(value: number[]) => setVoteCount(value)}
          />
        </Row>
        <Row justify="center">
          <H6 h6>{voteCount[0]}</H6>
        </Row>
      </Grid>
      <Grid>
        <Row justify="center">
          <H6 h6> {t('user-score')} </H6>
        </Row>
        <Row css={{ marginTop: '6px' }}>
          <Slider
            defaultValue={voteAverage}
            value={voteAverage}
            name="User Score"
            min={0}
            max={10}
            step={1}
            onValueChange={(value: number[]) => setVoteAverage(value)}
          />
        </Row>
        {voteAverage ? (
          <Row justify="center">
            <H6 h6>
              {t('rated')} {voteAverage[0]} - {voteAverage[1]}
            </H6>
          </Row>
        ) : null}
      </Grid>
      <Grid>
        <Row justify="center">
          <H6 h6> {t('runtime')} </H6>
        </Row>
        <Row css={{ marginTop: '6px' }}>
          <Slider
            defaultValue={runtime}
            value={runtime}
            name="Runtime"
            min={0}
            max={400}
            step={15}
            onValueChange={(value: number[]) => setRuntime(value)}
          />
        </Row>
        {runtime ? (
          <Row justify="center">
            <H6 h6>
              {runtime[0]} {t('minutes')} - {runtime[1]} {t('minutes')}
            </H6>
          </Row>
        ) : null}
      </Grid>
      <Grid xs={12} sm={12}>
        <Row justify="flex-end" css={{ marginTop: '6px', gap: '6px' }}>
          <Button
            auto
            type="button"
            onClick={() => {
              setReleaseDateFrom(preDateGte || '');
              setReleaseDateTo(preDateLte || '');
              setGenre(preGenresSet);
              setLanguage(preLanguagesSet);
              setStatus(preStatusSet);
              setType(preTypeSet);
              setSort(preSortSet);
              setVoteCount(preVoteCountArray);
              setVoteAverage(preVoteAverageArray);
              setRuntime(preRuntimeArray);
            }}
          >
            {t('reset')}
          </Button>
          <Button auto type="submit">
            {t('discover')}
          </Button>
        </Row>
      </Grid>
    </Grid.Container>
  );
};

Filter.displayName = 'Filter';

export default Filter;
