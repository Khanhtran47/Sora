import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { useFetcher, useNavigate } from '@remix-run/react';
import { useGlobalLoadingState } from 'remix-utils';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { DialogHeader, DialogTitle } from '~/components/elements/Dialog';

type SelectProviderProps = {
  id: number | string | undefined;
  visible: boolean;
  closeHandler: () => void;
  type: 'movie' | 'tv' | 'anime';
  title: string;
  origTitle: string;
  year: number;
  season?: number;
  episode?: number;
  animeType?: string;
  isEnded?: boolean;
};

const SelectProvider = (props: SelectProviderProps) => {
  const {
    id,
    visible,
    closeHandler,
    type,
    title,
    origTitle,
    year,
    season,
    episode,
    animeType,
    isEnded,
  } = props;
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const globalState = useGlobalLoadingState();
  const { isShowSkipOpEdButton } = useSoraSettings();
  const [provider, setProvider] = useState<
    {
      id?: string | number | null;
      provider: string;
      episodesCount?: number;
    }[]
  >();
  const handleProvider = (item: {
    id?: string | number | null;
    provider: string;
    episodesCount?: number;
  }) => {
    closeHandler();
    if (type === 'movie') navigate(`/movies/${id}/watch?provider=${item.provider}&id=${item.id}`);
    else if (type === 'tv')
      navigate(
        `/tv-shows/${id}/season/${season}/episode/${episode}/watch?provider=${item.provider}&id=${item.id}`,
      );
    else if (type === 'anime')
      navigate(
        `/anime/${id}/episode/${episode}/watch?provider=${item.provider}&id=${item.id}&episode=${episode}&skipOpEd=${isShowSkipOpEdButton.value}`,
      );
  };
  useEffect(() => {
    if (visible) {
      setProvider([]);
      if (type === 'movie')
        fetcher.load(
          `/api/provider?title=${title}&type=${type}&origTitle=${origTitle}&year=${year}&isEnded=${isEnded}&tmdbId=${id}`,
        );
      else if (type === 'tv')
        fetcher.load(
          `/api/provider?title=${title}&type=${type}&origTitle=${origTitle}&year=${year}&season=${season}&isEnded=${isEnded}&tmdbId=${id}`,
        );
      else if (type === 'anime')
        fetcher.load(
          `/api/provider?title=${title}&type=${type}&origTitle=${origTitle}&year=${year}&aid=${id}&animeType=${animeType}&isEnded=${isEnded}`,
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.provider) {
      setProvider(fetcher.data.provider);
    }
  }, [fetcher.data]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Select Provider</DialogTitle>
      </DialogHeader>
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        {provider && Array.isArray(provider)
          ? provider.map((item) => (
              <Button
                type="button"
                key={item.id}
                variant="light"
                onPress={() => handleProvider(item)}
              >
                {item.provider}
              </Button>
            ))
          : null}
        {globalState === 'loading' ? (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="sr-only">Loading...</span>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SelectProvider;
