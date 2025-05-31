import React, { useState } from 'react';

import LocaleService from '@services/LocaleService';

const defaultValue = {
  locale: 'en',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  setLocale: (code: string) => {},
};

const AppContext = React.createContext(defaultValue);

interface IAppProvider {
  children: React.ReactNode
}

function AppProvider({ children }: IAppProvider) {
  const [ locale, setLocaleCode ] = useState(localStorage.getItem('LOCALE') || LocaleService.getLanguage());

  const setLocale = (code: string) => {
    LocaleService.setLanguage(code);
    setLocaleCode(LocaleService.getLanguage());
    localStorage.setItem('LOCALE', code);
  };

  return (
    <AppContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ locale, setLocale }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider };

export default AppContext;
