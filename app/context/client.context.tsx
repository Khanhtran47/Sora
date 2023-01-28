import { createContext, useCallback, useState, useMemo } from 'react';
import { getCssText } from '@nextui-org/react';

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

export interface ClientStyleContextData {
  reset: () => void;
  sheet: string;
}

const ClientStyleContext = createContext<ClientStyleContextData>({
  reset: () => {},
  sheet: '',
});

const ClientCacheProvider = ({ children }: ClientCacheProviderProps) => {
  const [sheet, setSheet] = useState(getCssText());

  const reset = useCallback(() => {
    setSheet(getCssText());
  }, []);

  const styleValue = useMemo(() => ({ reset, sheet }), [reset, sheet]);

  return <ClientStyleContext.Provider value={styleValue}>{children}</ClientStyleContext.Provider>;
};

export { ClientCacheProvider, ClientStyleContext };
