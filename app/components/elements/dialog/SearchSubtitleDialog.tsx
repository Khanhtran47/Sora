/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react';
import { Button, Input, Loading, Pagination, Row, Spacer, useInput } from '@nextui-org/react';
import { useMediaQuery } from '@react-hookz/web';
import { useFetcher } from '@remix-run/react';
import { toast } from 'sonner';

import type { ISubtitle, ISubtitlesSearch } from '~/services/open-subtitles/open-subtitles.types';
import usePlayerState from '~/store/player/usePlayerState';
import { useTypedRouteLoaderData } from '~/hooks/useTypedRouteLoaderData';
import { DialogHeader, DialogTitle } from '~/components/elements/Dialog';
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '~/components/elements/select/Select';
import ChevronDownIcon from '~/assets/icons/ChevronDownIcon';
import ChevronUpIcon from '~/assets/icons/ChevronUpIcon';
import TickIcon from '~/assets/icons/TickIcon';

interface ISearchSubtitlesProps {
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
}

const SearchSubtitles = (props: ISearchSubtitlesProps) => {
  const { subtitleOptions } = props;
  const rootData = useTypedRouteLoaderData('root');
  const isSm = useMediaQuery('(max-width: 650px)', { initializeWithValue: false });
  const fetcher = useFetcher();
  const { updateSubtitleSelector } = usePlayerState((state) => state);

  const preInput: string | undefined =
    subtitleOptions?.type === 'movie'
      ? subtitleOptions?.title
      : subtitleOptions?.type === 'episode'
      ? `${subtitleOptions?.title} ${
          subtitleOptions?.season_number ? `S${subtitleOptions?.season_number}` : ''
        } ${subtitleOptions?.episode_number ? `E${subtitleOptions?.episode_number}` : ''}`
      : '';

  const { value, bindings } = useInput(preInput || '');
  const [language, setLanguage] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [subtitle, setSubtitle] = useState<ISubtitle>();
  const [subtitlesSearch, setSubtitlesSearch] = useState<ISubtitlesSearch>();
  const [isGetSubtitleLink, setIsGetSubtitleLink] = useState<boolean>(false);

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
      const newSubtitle = [
        {
          html: subtitle?.attributes?.language,
          url: fetcher.data.subtitle.link,
        },
      ];
      // @ts-ignore
      updateSubtitleSelector(newSubtitle);
      toast.success('Open Subtitle', {
        description: 'Subtitle added successfully',
        duration: 3000,
      });
      setIsGetSubtitleLink(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Search Subtitles</DialogTitle>
        <Row fluid justify="flex-start" align="center" css={{ margin: '0 0 $8 0' }}>
          <Input
            {...bindings}
            size="sm"
            placeholder="Search Subtitle"
            clearable
            bordered
            color="primary"
            type="text"
          />
          <Spacer x={1} />
          <Select value={language} onValueChange={(value: string) => setLanguage(value)}>
            <SelectTrigger aria-label="Language">
              <SelectValue placeholder="Select language" />
              <SelectIcon>
                <ChevronDownIcon />
              </SelectIcon>
            </SelectTrigger>
            <SelectContent>
              <SelectScrollUpButton>
                <ChevronUpIcon />
              </SelectScrollUpButton>
              <SelectViewport>
                {rootData?.languages &&
                  rootData?.languages
                    .sort((a, b) => {
                      const textA = a.english_name.toUpperCase();
                      const textB = b.english_name.toUpperCase();
                      return textA < textB ? -1 : textA > textB ? 1 : 0;
                    })
                    .map((lang) => (
                      <SelectItem value={lang.iso_639_1} key={`SelectItem${lang.iso_639_1}`}>
                        <SelectItemText>{lang.english_name}</SelectItemText>
                        <SelectItemIndicator>
                          <TickIcon />
                        </SelectItemIndicator>
                      </SelectItem>
                    ))}
              </SelectViewport>
              <SelectScrollDownButton>
                <ChevronDownIcon />
              </SelectScrollDownButton>
            </SelectContent>
          </Select>
          <Spacer x={1} />
          <Button
            type="button"
            auto
            size="sm"
            onPress={searchSubtitles}
            disabled={fetcher.type === 'normalLoad' && !isGetSubtitleLink}
          >
            {fetcher.type === 'normalLoad' && !isGetSubtitleLink ? (
              <Loading type="points" color="currentColor" size="sm" />
            ) : (
              'Search'
            )}
          </Button>
        </Row>
      </DialogHeader>
      <div className="w-full">
        {fetcher.type === 'normalLoad' && !isGetSubtitleLink && (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2 max-w-[330px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {subtitlesSearch &&
          subtitlesSearch.data.map((subtitle) => (
            <Button
              key={subtitle.id}
              type="button"
              light
              css={{ '@hover': { color: '$primaryLightContrast' } }}
              onPress={() => handleSubtitleClick(subtitle)}
            >
              {subtitle.attributes.release} ({subtitle.attributes.language})
            </Button>
          ))}
        {totalPages > 1 && (
          <Row fluid justify="center" align="center" css={{ margin: '0 0 $8 0' }}>
            <Pagination
              total={totalPages}
              initialPage={page}
              // shadow
              onChange={handlePageChange}
              {...(isSm && { size: 'xs' })}
            />
          </Row>
        )}
      </div>
    </>
  );
};

export default SearchSubtitles;
