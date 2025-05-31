import { useContext } from 'react';

import AppContext from '@app/AppContext';
import LocaleService, { TranslationKey } from '@services/LocaleService';

export default function useTranslation<T extends TranslationKey>(key: T) {
  const { locale } = useContext(AppContext);
  const translation = LocaleService.getTranslations(key);

  LocaleService.setLanguage(locale);
  return translation;
}
