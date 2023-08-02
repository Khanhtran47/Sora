import { useMemo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Tooltip } from '@nextui-org/tooltip';
import { Form, useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

import type { ILanguage } from '~/services/tmdb/tmdb.types';
import {
  animeFormat,
  animeGenres,
  animeSeason,
  animeStatus,
  tvStatus,
} from '~/constants/filterItems';
import {
  ScrollArea,
  ScrollBar,
  ScrollCorner,
  ScrollViewport,
} from '~/components/elements/ScrollArea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/elements/Select';
import { SheetFooter } from '~/components/elements/Sheet';
import Slider from '~/components/elements/Slider';

interface IFilterProps {
  /**
   * genres for movies and tv series
   */
  genres?: { [id: string]: string };
  mediaType?: 'movie' | 'tv' | 'anime';
  languages?: ILanguage[];
}

const Filter: React.FC<IFilterProps> = (props: IFilterProps) => {
  const { genres, mediaType, languages } = props;
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentYear = new Date().getFullYear();
  const languageItems = useMemo(() => {
    const languagesSorted =
      languages?.sort((a, b) => {
        const textA = a.english_name.toUpperCase();
        const textB = b.english_name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      }) || [];
    return [{ iso_639_1: 'All', english_name: t('all'), name: t('all') }, ...languagesSorted];
  }, [languages, t]);
  const tvStatusItems: typeof tvStatus = {
    All: t('all'),
    ...tvStatus,
  };
  const animeYearItems = [
    t('all'),
    ...Array.from(new Array(currentYear - 1938), (_, i) => (i + 1940).toString()).reverse(),
  ];
  const animeSeasonItems = [t('all'), ...animeSeason];
  const animeFormatItems = [t('all'), ...animeFormat];
  const animeAiringStatusItems = [t('all'), ...animeStatus];
  const currentSearchParams = useMemo<{ [key: string]: string }>(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);
  const [genresSelected, setGenresSelected] = useState<string[]>(
    currentSearchParams?.with_genres?.split(',') || [],
  );
  const [langSelected, setLangSelected] = useState<string>(
    currentSearchParams?.with_original_language || 'All',
  );
  const [tvStatusSelected, setTvStatusSelected] = useState<string>(
    currentSearchParams?.with_status || 'All',
  );
  const [voteCountSelected, setVoteCountSelected] = useState<number[]>(
    currentSearchParams['vote_count.gte'] ? [Number(currentSearchParams['vote_count.gte'])] : [200],
  );
  const [userScoreSelected, setUserScoreSelected] = useState<number[]>(() => {
    const preVoteAverageGte = currentSearchParams['vote_average.gte'];
    const preVoteAverageLte = currentSearchParams['vote_average.lte'];
    if (preVoteAverageGte || preVoteAverageLte) {
      return [Number(preVoteAverageGte || 0), Number(preVoteAverageLte || 10)];
    }
    return [0, 10];
  });
  const [runtimeSelected, setRuntimeSelected] = useState<number[]>(() => {
    const preRuntimeGte = currentSearchParams['with_runtime.gte'];
    const preRuntimeLte = currentSearchParams['with_runtime.lte'];
    if (preRuntimeGte || preRuntimeLte) {
      return [Number(preRuntimeGte || 0), Number(preRuntimeLte || 400)];
    }
    return [0, 400];
  });
  const [animeGenresSelected, setAnimeGenresSelected] = useState<string[]>(
    currentSearchParams?.genres?.split(',') || [],
  );
  const [animeYearSelected, setAnimeYearSelected] = useState<string>(
    currentSearchParams?.year || t('all'),
  );
  const [animeSeasonSelected, setAnimeSeasonSelected] = useState<string>(
    currentSearchParams?.season || t('all'),
  );
  const [animeFormatSelected, setAnimeFormatSelected] = useState<string>(
    currentSearchParams?.format || t('all'),
  );
  const [animeAiringStatusSelected, setAnimeAiringStatusSelected] = useState<string>(
    currentSearchParams?.status || t('all'),
  );
  const [animeQueryInput, setAnimeQueryInput] = useState<string | undefined>(
    currentSearchParams?.query || '',
  );

  const handleGenrePress = (genreId: string) => {
    setGenresSelected((prev) => {
      if (prev?.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      }
      return [...(prev || []), genreId];
    });
  };
  const handleAnimeGenrePress = (genreId: string) => {
    setAnimeGenresSelected((prev) => {
      if (prev?.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      }
      return [...(prev || []), genreId];
    });
  };
  const handleReset = () => {
    setGenresSelected([]);
    setAnimeGenresSelected([]);
    setLangSelected('All');
    setTvStatusSelected('All');
    setVoteCountSelected([200]);
    setUserScoreSelected([0, 10]);
    setRuntimeSelected([0, 400]);
    setAnimeYearSelected('All');
    setAnimeSeasonSelected('All');
    setAnimeFormatSelected('All');
    setAnimeAiringStatusSelected('All');
    setAnimeQueryInput('');
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let params: { [key: string]: string } = {};
    if (mediaType === 'movie' || mediaType === 'tv') {
      params = {
        ...(currentSearchParams?.sort_by ? { sort_by: currentSearchParams?.sort_by } : {}),
        ...(genresSelected && genresSelected.length > 0
          ? { with_genres: genresSelected?.join(',') }
          : {}),
        ...(langSelected && langSelected !== 'All' ? { with_original_language: langSelected } : {}),
        ...(tvStatusSelected && tvStatusSelected !== 'All'
          ? { with_status: tvStatusSelected }
          : {}),
        ...(voteCountSelected && voteCountSelected[0] !== 200
          ? { 'vote_count.gte': voteCountSelected[0].toString() }
          : {}),
        ...(userScoreSelected && userScoreSelected[0] !== 0
          ? { 'vote_average.gte': userScoreSelected[0].toString() }
          : {}),
        ...(userScoreSelected && userScoreSelected[1] !== 10
          ? { 'vote_average.lte': userScoreSelected[1].toString() }
          : {}),
        ...(runtimeSelected && runtimeSelected[0] !== 0
          ? { 'with_runtime.gte': runtimeSelected[0].toString() }
          : {}),
        ...(runtimeSelected && runtimeSelected[1] !== 400
          ? { 'with_runtime.lte': runtimeSelected[1].toString() }
          : {}),
      };
    }
    if (mediaType === 'anime') {
      params = {
        ...(currentSearchParams?.sort ? { sort: currentSearchParams?.sort } : {}),
        ...(animeGenresSelected && animeGenresSelected.length > 0
          ? { genres: animeGenresSelected?.join(',') }
          : {}),
        ...(animeYearSelected && animeYearSelected !== t('all') ? { year: animeYearSelected } : {}),
        ...(animeSeasonSelected && animeSeasonSelected !== t('all')
          ? { season: animeSeasonSelected }
          : {}),
        ...(animeFormatSelected && animeFormatSelected !== t('all')
          ? { format: animeFormatSelected }
          : {}),
        ...(animeAiringStatusSelected && animeAiringStatusSelected !== t('all')
          ? { status: animeAiringStatusSelected }
          : {}),
        ...(animeQueryInput && animeQueryInput !== '' ? { query: animeQueryInput } : {}),
      };
    }
    setSearchParams(params);
  };
  return (
    <Form className="flex w-full flex-col gap-y-6" onSubmit={handleSubmit}>
      <ScrollArea type="always" className="h-[calc(83vh-200px)] w-full md:h-[calc(100vh-180px)]">
        <ScrollViewport>
          <div className="flex w-full flex-col items-start justify-center gap-y-6 px-3 md:px-6">
            {mediaType === 'movie' || mediaType === 'tv' ? (
              <>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <h6>{t('genre')}</h6>
                  {genres ? (
                    <div className="flex w-full flex-row flex-wrap gap-2">
                      {Object.keys(genres).map((id) => (
                        <Button
                          key={id}
                          color={genresSelected?.includes(id) ? 'primary' : 'default'}
                          variant={genresSelected?.includes(id) ? 'flat' : 'solid'}
                          onPress={() => handleGenrePress(id)}
                        >
                          {genres[id]}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <h6>{t('language')}</h6>
                  {languageItems && languageItems.length > 0 ? (
                    <Select value={langSelected} onValueChange={setLangSelected}>
                      <SelectTrigger aria-label="language">
                        <SelectValue placeholder={t('language')} />
                      </SelectTrigger>
                      <SelectContent>
                        {languageItems.map((lang) => (
                          <SelectItem key={lang.iso_639_1} value={lang.iso_639_1}>
                            {lang.english_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
                {mediaType === 'tv' ? (
                  <div className="flex w-full flex-col items-start justify-start gap-3">
                    <h6>{t('status')}</h6>
                    {tvStatusItems ? (
                      <Select value={tvStatusSelected} onValueChange={setTvStatusSelected}>
                        <SelectTrigger aria-label="status">
                          <SelectValue placeholder={t('status')} />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(tvStatusItems).map((id) => (
                            <SelectItem key={id} value={id}>
                              {tvStatusItems[id]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <div className="flex w-full flex-row items-center justify-between">
                    <h6>{t('minimum-user-votes')}</h6>
                    <p className="text-default-foreground/80">{voteCountSelected[0]}</p>
                  </div>
                  <Slider
                    defaultValue={voteCountSelected}
                    value={voteCountSelected}
                    name="Minimum user votes"
                    onValueChange={setVoteCountSelected}
                    min={0}
                    max={500}
                    step={50}
                    color="gradient"
                    showValueOnHover
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <div className="flex w-full flex-row items-center justify-between">
                    <h6>{t('user-score')}</h6>
                    <p className="text-default-foreground/80">
                      {t('rated')} {userScoreSelected[0]} - {userScoreSelected[1]}
                    </p>
                  </div>
                  <Slider
                    defaultValue={userScoreSelected}
                    value={userScoreSelected}
                    name="User score"
                    onValueChange={setUserScoreSelected}
                    min={0}
                    max={10}
                    step={0.5}
                    color="gradient"
                    showValueOnHover
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <div className="flex w-full flex-row items-center justify-between">
                    <h6>{t('runtime')}</h6>
                    <p className="text-default-foreground/80">
                      {runtimeSelected[0]} {t('minutes')} - {runtimeSelected[1]} {t('minutes')}
                    </p>
                  </div>
                  <Slider
                    defaultValue={runtimeSelected}
                    value={runtimeSelected}
                    name="Runtime"
                    onValueChange={setRuntimeSelected}
                    min={0}
                    max={400}
                    step={15}
                    color="gradient"
                    showValueOnHover
                  />
                </div>
              </>
            ) : null}
            {mediaType === 'anime' ? (
              <>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <h6>{t('search.title.anime')}</h6>
                  <Input
                    value={animeQueryInput}
                    onValueChange={setAnimeQueryInput}
                    onClear={() => setAnimeQueryInput('')}
                    variant="faded"
                    description={t('search.helper.anime')}
                    type="text"
                    fullWidth
                    labelPlacement="outside"
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <h6>{t('genre')}</h6>
                  {animeGenres ? (
                    <div className="flex w-full flex-row flex-wrap gap-2">
                      {animeGenres.map((genre) => (
                        <Button
                          key={genre}
                          color={animeGenresSelected?.includes(genre) ? 'primary' : 'default'}
                          variant={animeGenresSelected?.includes(genre) ? 'flat' : 'solid'}
                          onPress={() => handleAnimeGenrePress(genre)}
                        >
                          {genre}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <h6>{t('year')}</h6>
                  {animeYearItems ? (
                    <Select value={animeYearSelected} onValueChange={setAnimeYearSelected}>
                      <SelectTrigger aria-label="year">
                        <SelectValue placeholder={t('year')} />
                      </SelectTrigger>
                      <SelectContent>
                        {animeYearItems.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <h6>{t('season')}</h6>
                  {animeSeasonItems ? (
                    <Select value={animeSeasonSelected} onValueChange={setAnimeSeasonSelected}>
                      <SelectTrigger aria-label="season">
                        <SelectValue placeholder={t('season')} />
                      </SelectTrigger>
                      <SelectContent>
                        {animeSeasonItems.map((season) => (
                          <SelectItem key={season} value={season}>
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <h6>{t('format')}</h6>
                  {animeFormatItems ? (
                    <Select value={animeFormatSelected} onValueChange={setAnimeFormatSelected}>
                      <SelectTrigger aria-label="format">
                        <SelectValue placeholder={t('format')} />
                      </SelectTrigger>
                      <SelectContent>
                        {animeFormatItems.map((format) => (
                          <SelectItem key={format} value={format}>
                            {format}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-3">
                  <h6>{t('airing-status')}</h6>
                  {animeAiringStatusItems ? (
                    <Select
                      value={animeAiringStatusSelected}
                      onValueChange={setAnimeAiringStatusSelected}
                    >
                      <SelectTrigger aria-label="Airing status">
                        <SelectValue placeholder={t('airing-status')} />
                      </SelectTrigger>
                      <SelectContent>
                        {animeAiringStatusItems.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </ScrollViewport>
        <ScrollBar />
        <ScrollCorner />
      </ScrollArea>
      <SheetFooter className="px-1 md:px-6">
        <Tooltip content={t('reset-tooltip')} showArrow closeDelay={0}>
          <Button color="default" type="button" onPress={() => handleReset()}>
            {t('reset')}
          </Button>
        </Tooltip>
        <Button color="primary" type="submit">
          {t('discover')}
        </Button>
      </SheetFooter>
    </Form>
  );
};

export default Filter;
