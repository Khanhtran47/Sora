/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  Modal,
  Loading,
  Container,
  Row,
  Input,
  useInput,
  Button,
  Spacer,
  Pagination,
} from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import { ClientOnly, useRouteData } from 'remix-utils';
import type { User } from '@supabase/supabase-js';

import useWindowSize from '~/hooks/useWindowSize';
import useMediaQuery from '~/hooks/useMediaQuery';
import { ILanguage } from '~/services/tmdb/tmdb.types';
import { ISubtitlesSearch, ISubtitle } from '~/services/open-subtitles/open-subtitles.types';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from '~/src/components/elements/select/Select';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  ToastProvider,
  ToastViewport,
} from '~/src/components/elements/toast/Toast';
import { H3, H6 } from '~/src/components/styles/Text.styles';
import ChevronDownIcon from '~/src/assets/icons/ChevronDownIcon.js';
import ChevronUpIcon from '~/src/assets/icons/ChevronUpIcon.js';
import TickIcon from '~/src/assets/icons/TickIcon.js';

interface ISearchSubtitlesProps {
  visible: boolean;
  closeHandler: () => void;
  setSubtitles: Dispatch<
    SetStateAction<
      {
        html: string;
        url: string;
        default?: boolean | undefined;
      }[]
    >
  >;
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
  const { visible, closeHandler, subtitleOptions, setSubtitles } = props;
  const rootData:
    | {
        user?: User;
        locale: string;
        genresMovie: { [id: string]: string };
        genresTv: { [id: string]: string };
        languages: ILanguage[];
      }
    | undefined = useRouteData('root');
  const isSm = useMediaQuery('(max-width: 650px)');
  const fetcher = useFetcher();
  const { width } = useWindowSize();

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
  const [open, setOpen] = useState(false);

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
      setSubtitles((prevState) => [...prevState, ...newSubtitle]);
      setOpen(true);
      setIsGetSubtitleLink(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return (
    <ClientOnly fallback={<Loading type="default" />}>
      {() => (
        <Modal
          closeButton
          blur
          scroll
          aria-labelledby="Search Subtitles"
          open={visible}
          onClose={closeHandler}
          width={width && width < 960 ? `${width}px` : '960px'}
        >
          <Modal.Header css={{ display: 'flex', flexFlow: 'row wrap' }}>
            <H3 h3 id="Search Subtitles" css={{ margin: '0 0 $8 0' }}>
              Search Subtitles
            </H3>
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
                    {rootData?.languages
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
                auto
                size="sm"
                onClick={searchSubtitles}
                disabled={fetcher.type === 'normalLoad' && !isGetSubtitleLink}
              >
                {fetcher.type === 'normalLoad' && !isGetSubtitleLink ? (
                  <Loading type="points" color="currentColor" size="sm" />
                ) : (
                  'Search'
                )}
              </Button>
            </Row>
          </Modal.Header>
          <Modal.Body
            // @ts-ignore
            as={Container}
            fluid
            responsive
          >
            {fetcher.type === 'normalLoad' && !isGetSubtitleLink && (
              <div role="status" className="max-w-sm animate-pulse">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-4" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-4" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-4" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-4" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {subtitlesSearch &&
              subtitlesSearch.data.map((subtitle) => (
                <ToastProvider swipeDirection="right" key={subtitle.id}>
                  <Button
                    light
                    css={{ '@hover': { color: '$primaryLightContrast' } }}
                    onClick={() => handleSubtitleClick(subtitle)}
                  >
                    {subtitle.attributes.release} ({subtitle.attributes.language})
                  </Button>
                  <Toast open={open} onOpenChange={setOpen} duration={3000}>
                    <ToastTitle>Open Subtitle</ToastTitle>
                    <ToastDescription asChild>
                      <H6 h6 color="success">
                        Subtitle added successfully
                      </H6>
                    </ToastDescription>
                  </Toast>
                  <ToastViewport />
                </ToastProvider>
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
          </Modal.Body>
        </Modal>
      )}
    </ClientOnly>
  );
};

export default SearchSubtitles;
