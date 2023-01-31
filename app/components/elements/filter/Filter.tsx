/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Row, Grid, Button, Dropdown, Tooltip, Input, useInput } from '@nextui-org/react';
import { useLocation, useNavigate, Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import { ILanguage } from '~/services/tmdb/tmdb.types';

import {
  sortMovieItems,
  sortTvItems,
  tvStatus,
  tvType,
  animeGenres,
  animeFormat,
  animeStatus,
  animeSort,
  animeSeason,
} from '~/constants/filterItems';

import { H6 } from '~/components/styles/Text.styles';
import Slider from '~/components/elements/slider/Slider';

interface IFilterProps {
  genres?: { [id: string]: string }; // genres for movies and tv series
  mediaType?: 'movie' | 'tv' | 'anime';
  languages?: ILanguage[];
}

const Filter = (props: IFilterProps) => {
  const { genres, mediaType, languages } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const sortItems =
    mediaType === 'movie' ? sortMovieItems : mediaType === 'tv' ? sortTvItems : animeSort;
  const languageItems = React.useMemo(() => {
    const languagesSorted =
      languages?.sort((a, b) => {
        const textA = a.english_name.toUpperCase();
        const textB = b.english_name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      }) || [];
    return [{ iso_639_1: 'All', english_name: t('all'), name: t('all') }, ...languagesSorted];
  }, [languages, t]);
  const animeYearItems = [
    t('all'),
    ...Array.from(new Array(currentYear - 1938), (x, i) => i + 1940).reverse(),
  ];
  const animeSeasonItems = [t('all'), ...animeSeason];
  const animeStatusItems = [t('all'), ...animeStatus];
  const animeFormatItems = [t('all'), ...animeFormat];

  // Get value from search params url
  const searchParams = new URLSearchParams(location.search);

  // for movies and tv series
  const preLanguages = searchParams.get('with_original_language');
  const preStatus = searchParams.get('with_status');
  const preType = searchParams.get('with_type');
  const preDateGte = searchParams.get('date.gte');
  const preDateLte = searchParams.get('date.lte');
  const preVoteCount = searchParams.get('vote_count.gte');
  const preVoteAverageGte = searchParams.get('vote_average.gte');
  const preVoteAverageLte = searchParams.get('vote_average.lte');
  const preRuntimeGte = searchParams.get('with_runtime.gte');
  const preRuntimeLte = searchParams.get('with_runtime.lte');

  // for anime
  const preAnimeQuery = searchParams.get('query');
  const preAnimeSeason = searchParams.get('season');
  const preAnimeFormat = searchParams.get('format');
  const preAnimeYear = searchParams.get('year');
  const preAnimeStatus = searchParams.get('status');

  const preGenres =
    mediaType === 'anime' ? searchParams.get('genres') : searchParams.get('with_genres');
  const preSort = mediaType === 'anime' ? searchParams.get('sort') : searchParams.get('sort_by');

  // Prepare value for state
  const preLanguagesSet = !preLanguages ? new Set(['All']) : new Set([preLanguages]);
  const preStatusSet = !preStatus ? new Set(['All']) : new Set(['All', ...preStatus.split(',')]);
  const preTypeSet = !preType ? new Set(['All']) : new Set(['All', ...preType.split(',')]);
  const preVoteCountArray = preVoteCount ? [Number(preVoteCount)] : [300];
  const preVoteAverageArray =
    preVoteAverageGte || preVoteAverageLte
      ? [Number(preVoteAverageGte || 0), Number(preVoteAverageLte || 10)]
      : [0, 10];
  const preRuntimeArray =
    preRuntimeGte || preRuntimeLte
      ? [Number(preRuntimeGte || 0), Number(preRuntimeLte || 400)]
      : [0, 400];
  const preAnimeYearSet = !preAnimeYear ? new Set(['All']) : new Set([preAnimeYear]);
  const preAnimeSeasonSet = !preAnimeSeason ? new Set(['All']) : new Set([preAnimeSeason]);
  const preAnimeStatusSet = !preAnimeStatus ? new Set(['All']) : new Set([preAnimeStatus]);
  const preAnimeFormatSet = !preAnimeFormat ? new Set(['All']) : new Set([preAnimeFormat]);
  const preGenresSet = !preGenres ? new Set(['All']) : new Set(['All', ...preGenres.split(',')]);
  const preSortSet = !preSort
    ? new Set(['popularity'])
    : new Set([
        preSort.includes('_')
          ? preSort.replace(/_DESC/g, '').toLowerCase().replace('_', '-')
          : preSort.split('.')[0],
      ]);

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
  const {
    value: animeQuery,
    setValue: setAnimeQuery,
    bindings: animeQueryBindings,
  } = useInput(preAnimeQuery || '');
  const [lang, setLanguage] = React.useState(preLanguagesSet);
  const [status, setStatus] = React.useState(preStatusSet);
  const [type, setType] = React.useState(preTypeSet);
  const [voteCount, setVoteCount] = React.useState<number[]>(preVoteCountArray);
  const [voteAverage, setVoteAverage] = React.useState<number[] | undefined>(preVoteAverageArray);
  const [runtime, setRuntime] = React.useState<number[] | undefined>(preRuntimeArray);
  const [query, setQuery] = React.useState('');
  const [year, setYear] = React.useState(preAnimeYearSet);
  const [season, setSeason] = React.useState(preAnimeSeasonSet);
  const [statusAnime, setStatusAnime] = React.useState(preAnimeStatusSet);
  const [format, setFormat] = React.useState(preAnimeFormatSet);
  const [genre, setGenre] = React.useState(preGenresSet);
  const [sort, setSort] = React.useState(preSortSet);

  const selectedGenre = React.useMemo(
    () =>
      (mediaType === 'anime'
        ? Array.from(genre)
            .filter((item) => item !== 'All')
            .join(', ')
        : Array.from(genre)
            .slice(1)
            .map((key) => genres && genres[key])
            .join(', ')
            .replaceAll('_', ' ')) || t('all'),
    [genre, genres, t, mediaType],
  );

  const selectedLanguage = React.useMemo(
    () =>
      languages?.find((item) => item.iso_639_1 === Array.from(lang)[0])?.english_name || t('all'),
    [lang, languages, t],
  );

  const selectedYear = React.useMemo(() => Array.from(year)[0] || t('all'), [year, t]);

  const selectedSeason = React.useMemo(() => Array.from(season)[0] || t('all'), [season, t]);

  const selectedStatusAnime = React.useMemo(
    () => Array.from(statusAnime)[0] || t('all'),
    [statusAnime, t],
  );

  const selectedFormat = React.useMemo(() => Array.from(format)[0] || t('all'), [format, t]);

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
      _animeQuery = animeQuery,
      _year = year,
      _season = season,
      _statusAnime = statusAnime,
      _format = format,
    ) => {
      let newQuery = '';
      const params = new URLSearchParams();
      if (_genre.size > 1) {
        params.append(
          mediaType === 'anime' ? 'genres' : 'with_genres',
          Array.from(_genre).slice(1).join(','),
        );
      }
      if (mediaType === 'movie' || mediaType === 'tv') {
        if (_releaseDateFrom) {
          params.append('date.gte', _releaseDateFrom);
        }
        if (_releaseDateTo) {
          params.append('date.lte', _releaseDateTo);
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
      }
      if (mediaType === 'anime') {
        if (_animeQuery) {
          params.append('query', _animeQuery);
        }
        if (Array.from(_year)[0] !== 'All') {
          params.append('year', Array.from(_year)[0] as string);
        }
        if (Array.from(_season)[0] !== 'All') {
          params.append('season', Array.from(_season)[0] as string);
        }
        if (Array.from(_statusAnime)[0] !== 'All') {
          params.append('status', Array.from(_statusAnime)[0] as string);
        }
        if (Array.from(_format)[0] !== 'All') {
          params.append('format', Array.from(_format)[0] as string);
        }
        params.append('sort', (Array.from(_sort)[0] as string).toUpperCase().replace('-', '_'));
        newQuery = `?${params.toString()}`;
        if (Array.from(_sort)[0] !== 'title-english') newQuery += '_DESC';
        setQuery(newQuery);
      }
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
      animeQuery,
      year,
      season,
      statusAnime,
      format,
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
        animeQuery,
        year,
        season,
        statusAnime,
        format,
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
      animeQuery,
      year,
      season,
      statusAnime,
      format,
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
      {mediaType === 'movie' || mediaType === 'tv' ? (
        <>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('release-dates')} </H6>
            </Row>
            <Row
              gap={1}
              justify="space-between"
              align="center"
              wrap="wrap"
              css={{ marginTop: '6px' }}
            >
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
                <Dropdown isBordered>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedGenre}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Genres Selection"
                    color="primary"
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
                <Dropdown isBordered>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedLanguage}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Original Language Selection"
                    color="primary"
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
                    <Dropdown isBordered>
                      <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedStatus}</Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Status Selection"
                        color="primary"
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
                    <Dropdown isBordered>
                      <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedType}</Dropdown.Button>
                      <Dropdown.Menu
                        aria-label="Type Selection"
                        color="primary"
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
              <Dropdown isBordered>
                <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedSort}</Dropdown.Button>
                <Dropdown.Menu
                  aria-label="Sort By Selection"
                  color="primary"
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
        </>
      ) : null}
      {mediaType === 'anime' ? (
        <>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('search.title.anime')} </H6>
            </Row>
            <Row css={{ marginTop: '6px' }}>
              <Input
                {...animeQueryBindings}
                clearable
                bordered
                color="primary"
                helperText={t('search.helper.anime')}
                type="text"
                css={{ marginBottom: '$12' }}
              />
            </Row>
          </Grid>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('genre')} </H6>
            </Row>
            <Row css={{ marginTop: '6px' }}>
              {animeGenres && (
                <Dropdown isBordered>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedGenre}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Genres Selection"
                    color="primary"
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={genre}
                    onSelectionChange={(key: any) => setGenre(key)}
                  >
                    {animeGenres.map((item) => (
                      <Dropdown.Item key={item}>{item}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Row>
          </Grid>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('year')} </H6>
            </Row>
            <Row css={{ marginTop: '6px' }}>
              {animeYearItems && (
                <Dropdown isBordered>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedYear}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Year Selection"
                    color="primary"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={year}
                    onSelectionChange={(key: any) => setYear(key)}
                  >
                    {animeYearItems.map((item) => (
                      <Dropdown.Item key={item}>{item}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Row>
          </Grid>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('season')} </H6>
            </Row>
            <Row css={{ marginTop: '6px' }}>
              {animeSeasonItems && (
                <Dropdown isBordered>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedSeason}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Season Selection"
                    color="primary"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={season}
                    onSelectionChange={(key: any) => setSeason(key)}
                  >
                    {animeSeasonItems.map((item) => (
                      <Dropdown.Item key={item}>{item}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Row>
          </Grid>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('format')} </H6>
            </Row>
            <Row css={{ marginTop: '6px' }}>
              {animeFormatItems && (
                <Dropdown isBordered>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedFormat}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Fromat Selection"
                    color="primary"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={format}
                    onSelectionChange={(key: any) => setFormat(key)}
                  >
                    {animeFormatItems.map((item) => (
                      <Dropdown.Item key={item}>{item}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Row>
          </Grid>
          <Grid>
            <Row justify="center">
              <H6 h6> {t('airing-status')} </H6>
            </Row>
            <Row css={{ marginTop: '6px' }}>
              {animeStatusItems && (
                <Dropdown isBordered>
                  <Dropdown.Button css={{ tt: 'capitalize' }}>
                    {selectedStatusAnime}
                  </Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Airing Status Selection"
                    disallowEmptySelection
                    color="primary"
                    selectionMode="single"
                    selectedKeys={statusAnime}
                    onSelectionChange={(key: any) => setStatusAnime(key)}
                  >
                    {animeStatusItems.map((item) => (
                      <Dropdown.Item key={item}>{item}</Dropdown.Item>
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
            <Row css={{ marginTop: '6px' }}>
              <Dropdown isBordered>
                <Dropdown.Button css={{ tt: 'capitalize' }}>{selectedSort}</Dropdown.Button>
                <Dropdown.Menu
                  aria-label="Sort By Selection"
                  disallowEmptySelection
                  color="primary"
                  selectionMode="single"
                  selectedKeys={sort}
                  onSelectionChange={(keys: any) => setSort(keys)}
                >
                  {animeSort.map((item) => (
                    <Dropdown.Item key={item}>{t(item)}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Row>
          </Grid>
        </>
      ) : null}
      <Grid xs={12} sm={12}>
        <Row justify="flex-end" css={{ marginTop: '6px', gap: '6px' }}>
          <Tooltip content={t('reset-tooltip')}>
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
                setAnimeQuery(preAnimeQuery || '');
                setYear(preAnimeYearSet);
                setSeason(preAnimeSeasonSet);
                setFormat(preAnimeFormatSet);
                setStatusAnime(preAnimeStatusSet);
              }}
            >
              {t('reset')}
            </Button>
          </Tooltip>
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
