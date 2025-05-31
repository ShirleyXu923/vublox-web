import _ from 'lodash';
import moment from 'moment';
import pluralize from 'pluralize';
import LocalizedStrings from 'react-localization';
import 'moment/locale/en-gb';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-hk';

import availableLocales from '@locale/available-locales';

type Paths<T> = T extends object ? { [K in keyof T]:
  `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`
}[keyof T] : never;

type Translation<T, V extends keyof T | Paths<T> | string> = V extends keyof T ?
  T[V] extends string ? string :
    T[V] extends any[] ? T[V] : {
      [K in keyof T[V]]: Translation<T[V], K>
    } : V extends `${infer Key}.${infer SubKey}` ?
    Key extends keyof T ? Translation<T[Key], SubKey>
      : string : string;

export type TranslationKey = Paths<typeof availableLocales.en>;

const fallbackLocale = 'en-gb';
const locale = new LocalizedStrings(availableLocales);

const parseTranslation = (text: string, ...values: any[]) => locale.formatString(text, ...values);

const getTranslations = <T extends Paths<typeof availableLocales.en>>
  (key: T) => _.get(locale, key) as unknown as Translation<typeof availableLocales.en, T>;

const getPluralizedTranslation = (
  word: string,
  count: number,
  inclusive = true,
) => pluralize(word, count, inclusive);

const setLanguage = (language: string) => {
  const languageCode = language === fallbackLocale ? fallbackLocale : language.substring(0, 2);
  let momentLocale = moment.locales().find(e => e.startsWith(languageCode));
  momentLocale = momentLocale === 'en' ? fallbackLocale : momentLocale;
  moment.locale(momentLocale || fallbackLocale);
  locale.setLanguage(language);
};

const getLanguage = () => locale.getLanguage();

export default {
  getTranslations,
  parseTranslation,
  getPluralizedTranslation,
  setLanguage,
  getLanguage,
};
