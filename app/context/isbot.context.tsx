import { createContext, useContext, type ReactNode } from 'react';

type Props = { isBot: boolean; children: ReactNode };

const IsbotContext = createContext(false);

const useIsBot = () => useContext(IsbotContext) ?? false;

const IsBotProvider = (props: Props) => {
  const { isBot, children } = props;
  return <IsbotContext.Provider value={isBot}>{children}</IsbotContext.Provider>;
};

export { useIsBot, IsBotProvider };
