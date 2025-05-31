import { NavbarText } from 'reactstrap';

import LocaleService from '@services/LocaleService';
import useTranslation from '@shared/hooks/useTranslation';

function Copyright() {
  const i18n = useTranslation('landing');
  return (
    <NavbarText className="footer-copyright">
      {LocaleService.parseTranslation(i18n.label.copyright, {
        date: new Date().getFullYear(),
      })}
    </NavbarText>
  );
}

export default Copyright;
