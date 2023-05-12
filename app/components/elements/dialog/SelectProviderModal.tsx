/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Modal } from '@nextui-org/react';
import { useWindowSize } from '@react-hookz/web';
import { useFetcher, useNavigate } from '@remix-run/react';

import { useSoraSettings } from '~/hooks/useLocalStorage';
import { H3 } from '~/components/styles/Text.styles';

type SelectProviderModalProps = {
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

const SelectProviderModal = (props: SelectProviderModalProps) => {
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
  const { isShowSkipOpEdButton } = useSoraSettings();
  const [provider, setProvider] = useState<
    {
      id?: string | number | null;
      provider: string;
      episodesCount?: number;
    }[]
  >();
  const { width } = useWindowSize();
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
    <Modal
      closeButton
      blur
      scroll
      aria-labelledby="Select Provider"
      open={visible}
      onClose={closeHandler}
      width={width && width < 720 ? `${width}px` : '720px'}
    >
      <Modal.Header css={{ display: 'flex', flexFlow: 'row wrap' }}>
        <H3 h3 css={{ margin: '0 0 $8 0' }}>
          Select Provider
        </H3>
      </Modal.Header>
      <Modal.Body
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {provider && Array.isArray(provider)
          ? provider.map((item) => (
              <Button
                type="button"
                key={item.id}
                variant="light"
                color="primary"
                onPress={() => handleProvider(item)}
              >
                {item.provider}
              </Button>
            ))
          : null}
        {fetcher.type === 'normalLoad' && (
          <div role="status" className="max-w-sm animate-pulse">
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SelectProviderModal;
