import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Pagination } from '@nextui-org/pagination';
import { useMediaQuery } from '@react-hookz/web';
import { useFetcher } from '@remix-run/react';
import { useGlobalLoadingState } from 'remix-utils';
import { toast } from 'sonner';

import type { ISubtitle, ISubtitlesSearch } from '~/services/open-subtitles/open-subtitles.types';
import usePlayerState from '~/store/player/usePlayerState';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { DialogHeader, DialogTitle } from '~/components/elements/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/elements/Select';

interface ISearchSubtitlesProps {
  artplayer: Artplayer | null;
  containerPortal?: HTMLElement;
  subtitleOptions?: {
    imdb_id?: number;
    tmdb_id?: number;
    parent_feature_id?: number;
    parent_imdb_id?: number;
    parent_tmdb_id?: number;
    episode_number?: number;
    season_number?: number;
    type?: 'movie' | 'episode' | 'all';
    title?: string;
    sub_format: 'srt' | 'webvtt';
  };
  setCurrentSubtitle: React.Dispatch<React.SetStateAction<string>>;
}

const SearchSubtitles = (props: ISearchSubtitlesProps) => {
  const { artplayer, subtitleOptions, containerPortal, setCurrentSubtitle } = props;
  const rootData = useTypedRouteLoaderData('root');
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const fetcher = useFetcher();
  const globalState = useGlobalLoadingState();
  const { updateSubtitleSelector } = usePlayerState((state) => state);

  const preInput: string | undefined =
    subtitleOptions?.type === 'movie'
      ? subtitleOptions?.title
      : subtitleOptions?.type === 'episode'
      ? `${subtitleOptions?.title} ${
          subtitleOptions?.season_number ? `S${subtitleOptions?.season_number}` : ''
        } ${subtitleOptions?.episode_number ? `E${subtitleOptions?.episode_number}` : ''}`
      : '';

  const [value, setValue] = useState<string>(preInput || '');
  const [language, setLanguage] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [subtitle, setSubtitle] = useState<ISubtitle>();
  const [subtitlesSearch, setSubtitlesSearch] = useState<ISubtitlesSearch>();
  const [isGetSubtitleLink, setIsGetSubtitleLink] = useState<boolean>(false);
  const { autoSwitchSubtitle } = useSoraSettings();

  const handlePageChange = (page: number) => {
    setSubtitlesSearch(undefined);
    let url = '/api/subtitles/search';
    const params = new URLSearchParams();
    if (value) {
      params.append('query', value);
    }
    if (language) {
      params.append('language', language);
    }
    if (subtitleOptions && subtitleOptions.imdb_id) {
      params.append('imdb_id', `${subtitleOptions.imdb_id}`);
    }
    if (subtitleOptions && subtitleOptions.tmdb_id) {
      params.append('tmdb_id', `${subtitleOptions.tmdb_id}`);
    }
    if (subtitleOptions && subtitleOptions.parent_feature_id) {
      params.append('parent_feature_id', `${subtitleOptions.parent_feature_id}`);
    }
    if (subtitleOptions && subtitleOptions.parent_imdb_id) {
      params.append('parent_imdb_id', `${subtitleOptions.parent_imdb_id}`);
    }
    if (subtitleOptions && subtitleOptions.parent_tmdb_id) {
      params.append('parent_tmdb_id', `${subtitleOptions.parent_tmdb_id}`);
    }
    if (subtitleOptions && subtitleOptions.episode_number !== undefined) {
      params.append('episode_number', `${subtitleOptions.episode_number}`);
    }
    if (subtitleOptions && subtitleOptions.season_number !== undefined) {
      params.append('season_number', `${subtitleOptions.season_number}`);
    }
    if (subtitleOptions && subtitleOptions.type) {
      params.append('type', subtitleOptions.type);
    }
    if (page) {
      params.append('page', `${page}`);
    }
    url += `?${params}`;
    fetcher.load(url);
  };

  const handleSubtitleClick = (subtitle: ISubtitle) => {
    setSubtitle(subtitle);
    setIsGetSubtitleLink(true);
    fetcher.load(
      `/api/subtitles/download?file_id=${subtitle.attributes.files[0].file_id}&sub_format=${subtitleOptions?.sub_format}`,
    );
  };

  const searchSubtitles = () => {
    setSubtitlesSearch(undefined);
    let url = '/api/subtitles/search';
    const params = new URLSearchParams();
    if (value) {
      params.append('query', value);
    }
    if (language) {
      params.append('language', language);
    }
    if (subtitleOptions && subtitleOptions.imdb_id) {
      params.append('imdb_id', `${subtitleOptions.imdb_id}`);
    }
    if (subtitleOptions && subtitleOptions.tmdb_id) {
      params.append('tmdb_id', `${subtitleOptions.tmdb_id}`);
    }
    if (subtitleOptions && subtitleOptions.parent_feature_id) {
      params.append('parent_feature_id', `${subtitleOptions.parent_feature_id}`);
    }
    if (subtitleOptions && subtitleOptions.parent_imdb_id) {
      params.append('parent_imdb_id', `${subtitleOptions.parent_imdb_id}`);
    }
    if (subtitleOptions && subtitleOptions.parent_tmdb_id) {
      params.append('parent_tmdb_id', `${subtitleOptions.parent_tmdb_id}`);
    }
    if (subtitleOptions && subtitleOptions.episode_number !== undefined) {
      params.append('episode_number', `${subtitleOptions.episode_number}`);
    }
    if (subtitleOptions && subtitleOptions.season_number !== undefined) {
      params.append('season_number', `${subtitleOptions.season_number}`);
    }
    if (subtitleOptions && subtitleOptions.type) {
      params.append('type', subtitleOptions.type);
    }
    url += `?${params}`;
    fetcher.load(url);
  };

  useEffect(() => {
    if (fetcher.data && fetcher.data.subtitlesSearch) {
      setSubtitlesSearch(fetcher.data.subtitlesSearch);
      setPage(fetcher.data.subtitlesSearch.page);
      setTotalPages(fetcher.data.subtitlesSearch.total_pages);
    }
    if (fetcher.data && fetcher.data.subtitle) {
      setIsGetSubtitleLink(false);
      const subtitleName = subtitle?.attributes?.release || '';
      const subtitleHtml =
        subtitleName.length > 20
          ? `${subtitleName.substring(0, 10)}...${subtitleName.substring(
              subtitleName.length - 10,
              subtitleName.length,
            )}`
          : subtitleName;
      const url = fetcher.data.subtitle.link;
      const newSubtitle = [
        {
          html: subtitleHtml,
          url,
        },
      ];
      updateSubtitleSelector(newSubtitle);
      if (artplayer && autoSwitchSubtitle.value) {
        artplayer.subtitle.switch(url, {
          name: subtitleHtml,
        });
        setCurrentSubtitle(subtitleHtml);
        toast.success('Subtitle added successfully', {
          description: 'The subtitle has been switched automatically',
          duration: 3000,
        });
      } else {
        toast.success('Subtitle added successfully', {
          description: 'You can choose the subtitle in the subtitles list',
          duration: 3000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return (
    <>
      <DialogHeader className="!px-2 sm:!px-0">
        <DialogTitle className="!mb-3">Search Subtitles</DialogTitle>
        <div className="!mb-5 flex w-full flex-col items-end justify-start gap-6 sm:flex-row sm:items-center">
          <div className="flex w-full flex-col items-center justify-start gap-4 sm:flex-row sm:flex-wrap">
            <Input
              value={value}
              onValueChange={(value) => setValue(value || '')}
              onClear={() => setValue('')}
              size="sm"
              placeholder="Search Subtitle"
              variant="faded"
              color="default"
              type="text"
              className="w-full sm:w-auto"
            />
            <Select value={language} onValueChange={(value: string) => setLanguage(value)}>
              <SelectTrigger aria-label="Language" className="h-10 sm:w-fit">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent container={containerPortal}>
                {rootData?.languages &&
                  rootData?.languages
                    .sort((a, b) => {
                      const textA = a.english_name.toUpperCase();
                      const textB = b.english_name.toUpperCase();
                      return textA < textB ? -1 : textA > textB ? 1 : 0;
                    })
                    .map((lang) => (
                      <SelectItem value={lang.iso_639_1} key={`SelectItem${lang.iso_639_1}`}>
                        {lang.english_name}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            color="primary"
            isDisabled={globalState === 'loading' && !isGetSubtitleLink}
            isLoading={globalState === 'loading' && !isGetSubtitleLink}
            className="!px-3"
            onPress={searchSubtitles}
          >
            Search
          </Button>
        </div>
      </DialogHeader>
      <div className="flex w-full flex-col gap-y-2">
        {globalState === 'loading' && !isGetSubtitleLink && (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="!mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="!mb-4 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="!mb-4 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="!mb-4 h-2 max-w-[330px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="!mb-4 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {subtitlesSearch &&
          subtitlesSearch.data.map((subtitle) => (
            <Button
              key={subtitle.id}
              type="button"
              variant="light"
              className="!px-3"
              onPress={() => handleSubtitleClick(subtitle)}
            >
              {subtitle.attributes.release} ({subtitle.attributes.language})
            </Button>
          ))}
        {totalPages > 1 ? (
          <div className="!mb-5 flex w-full flex-row items-center justify-center">
            <Pagination
              // showControls={!isSm}
              total={totalPages}
              initialPage={page}
              // shadow
              onChange={handlePageChange}
              {...(isSm && { size: 'sm' })}
              className="[&>*]:!mx-[0.125rem] sm:[&>*]:!mx-1"
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SearchSubtitles;
