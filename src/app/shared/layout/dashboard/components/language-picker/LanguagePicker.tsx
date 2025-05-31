/* eslint-disable max-len */
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import {
  DropdownItem,
} from 'reactstrap';

import AppContext from '@app/AppContext';
import ChineseImg from '@assets/img/locales/Round Flags_Chinese Simplified (ZH-CN).png';
// import ArabicImg from '@assets/img/locales/Round Flags_Arabic (AR).png';
import EnglishImg from '@assets/img/locales/Round Flags_English (US).png';
import LocaleService from '@services/LocaleService';
// import FilipinoImg from '@assets/img/locales/Round Flags_Filipino (FIL).png';
// import FrenchImg from '@assets/img/locales/Round Flags_French (FR).png';
// import GermanImg from '@assets/img/locales/Round Flags_German (DE).png';
// import RussianImg from '@assets/img/locales/Round Flags_Russian (RU).png';
// import TurkishImg from '@assets/img/locales/Round Flags_Turkish (TR).png';
import useTranslation from '@shared/hooks/useTranslation';
import {
  EnglishUSIcon,
  // FrenchIcon,
  // ItalianIcon,
  // JapaneseIcon,
  // KoreanIcon,
  // TurkishIcon,
  // RussianIcon,
  // GermanIcon,
  // FilipinoIcon,
  ChineseIcon,
  HongKongIcon,
  BackIcon,
  RadioSelectedIcon,
  RadioIcon,
  // ArabicIcon,
  // ArrowRightIcon,
} from '@shared/icons';

import './LanguagePicker.scss';

export default function LanguagePicker({
  toggle,
}: {
  toggle: () => void
}) {
  const [ i18n, setI18n ] = useState(useTranslation('navbar.language'));
  const [ languages, setLanguages ] = useState([
    // { IconComponent: ArabicIcon, label: i18n.label.ar, code: 'ar', active: false, img: ArabicImg },
    {
      IconComponent: ChineseIcon, label: i18n.label['zh-CN'], code: 'zh-CN', active: false, img: ChineseImg,
    },
    {
      IconComponent: HongKongIcon, label: i18n.label['zh-HK'], code: 'zh-HK', active: false, img: ChineseImg,
    },
    {
      IconComponent: EnglishUSIcon, label: i18n.label.en, code: 'en', active: true, img: EnglishImg,
    },
    // { IconComponent: FilipinoIcon, label: i18n.label.fil, code: 'fil', active: false, img: FilipinoImg },
    // {
    //   IconComponent: FrenchIcon, label: i18n.label.fr, code: 'fr', active: false, img: FrenchImg,
    // },
    // { IconComponent: GermanIcon, label: i18n.label.de, code: 'de', active: false, img: GermanImg },
    // {
    //   IconComponent: RussianIcon, label: i18n.label.ru, code: 'ru', active: false, img: RussianImg,
    // },
    // {
    //   IconComponent: TurkishIcon, label: i18n.label.tr, code: 'tr', active: false, img: TurkishImg,
    // },
    // { IconComponent: ItalianIcon, label: i18n.label.it, code: 'it', active: false },
    // { IconComponent: JapaneseIcon, label: i18n.label.jp, code: 'ja', active: false },
    // { IconComponent: KoreanIcon, label: i18n.label.kr, code: 'ko', active: false },
  ]);
  const { locale, setLocale } = useContext(AppContext);

  const reloadTranslations = () => {
    setTimeout(() => {
      const newI18n = LocaleService.getTranslations('navbar.language');
      setI18n(newI18n);

      const reloadLanguages = [
        {
          IconComponent: ChineseIcon, label: newI18n.label['zh-CN'], code: 'zh-CN', active: false, img: ChineseImg,
        },
        {
          IconComponent: HongKongIcon, label: newI18n.label['zh-HK'], code: 'zh-HK', active: false, img: ChineseImg,
        },
        {
          IconComponent: EnglishUSIcon, label: newI18n.label.en, code: 'en', active: true, img: EnglishImg,
        },
      ];
      setLanguages(reloadLanguages);
    }, 0);
  };

  const init = () => {
    const selectedLanguage = languages.find(lang => lang.code === locale);
    const lang = selectedLanguage || languages[0];
    setLocale(lang.code);
  };

  const changeLanguage = (e: any, lang: any) => {
    setLocale(lang.code);
    reloadTranslations();
  };

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  return (

    <>
      <DropdownItem onClick={toggle} toggle={false}>
        <BackIcon className="ms-n1" fill="var(--bs-body-color)" />
        {i18n.label.language}
      </DropdownItem>
      <DropdownItem divider />
      {languages.map((language) => (
        <DropdownItem
          className={classNames({
            'd-flex align-items-center px-3 py-1': true,
          })}
          key={language.code}
          onClick={(e) => changeLanguage(e, language)}
        >
          <div className="me-1">
            {language.code === locale
              ? <RadioSelectedIcon /> : <RadioIcon />}
          </div>
          {language.IconComponent && (
            <language.IconComponent width="30" height="30" className="me-2" />
          )}
          <div className="flex-fill">
            {language.label}
          </div>
        </DropdownItem>
      ))}
    </>
  );
}
