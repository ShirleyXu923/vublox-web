import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown,
} from 'reactstrap';

import AppContext from '@app/AppContext';
import ChineseImg from '@assets/img/locales/Round Flags_Chinese Simplified (ZH-CN).png';
import EnglishImg from '@assets/img/locales/Round Flags_English (US).png';
import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';
import {
  EnglishUSIcon,
  ChineseIcon,
  HongKongIcon,
} from '@shared/icons';

function LanguageDropdown() {
  const [ i18n, setI18n ] = useState(useTranslation('navbar.language'));
  const [ languages, setLanguages ] = useState([
    {
      IconComponent: ChineseIcon, label: i18n.label['zh-CN'], code: 'zh-CN', active: false, img: ChineseImg,
    },
    {
      IconComponent: HongKongIcon, label: i18n.label['zh-HK'], code: 'zh-HK', active: false, img: ChineseImg,
    },
    {
      IconComponent: EnglishUSIcon, label: i18n.label.en, code: 'en', active: true, img: EnglishImg,
    },
  ]);
  const { locale, setLocale } = useContext(AppContext);
  const [ currentLanguage, setLanguage ] = useState(languages[0]);

  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  const reloadTranslations = (lang: any) => {
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
      const reloadLanguage = reloadLanguages.find(l => l.code === lang.code);
      const language = reloadLanguage || reloadLanguages[0];
      setLanguage(language);
    }, 0);
  };

  const init = () => {
    const selectedLanguage = languages.find(lang => lang.code === locale);
    const lang = selectedLanguage || languages[0];
    setLocale(lang.code);
    setLanguage(lang);
    reloadTranslations(lang);
  };

  const changeLanguage = (e: any, lang: any) => {
    setLocale(lang.code);
    setLanguage(lang);
    reloadTranslations(lang);
  };

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  return (
    <div className="d-flex align-items-center">
      <small className="text-muted">
        {i18n.label.language}
      </small>
      <UncontrolledDropdown className="account-dropdown">
        <DropdownToggle
          caret
          size="sm"
          className={classNames('btn-dropdown py-2 d-flex align-items-center', {
            'ms-3': !isSmScreen,
            'ms-2': isSmScreen,
          })}
        >
          <div className="d-flex align-items-center">
            {currentLanguage.IconComponent && (
              <currentLanguage.IconComponent width="30" height="30" className="me-3" />
            )}
            <div className="flex-fill">
              {currentLanguage.label}
            </div>
          </div>
        </DropdownToggle>
        <DropdownMenu end>
          {languages.map((language: any) => (
            <DropdownItem
              className={classNames({
                'd-flex align-items-center': true,
              })}
              key={language.code}
              onClick={(e) => changeLanguage(e, language)}
            >
              <Input type="radio" className="mt-0 me-3" checked={language.code === locale} />
              {language.IconComponent && (
                <language.IconComponent width="30" height="30" className="me-3" />
              )}
              <div className="flex-fill">
                {language.label}
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

export default LanguageDropdown;
