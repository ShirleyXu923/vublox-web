import classNames from 'classnames';
import moment from 'moment';
import React, { useState } from 'react';
import {
  Container,
} from 'reactstrap';

import app from '@config/app';
import LocaleService from '@services/LocaleService';
import BackButton from '@shared/buttons/BackButton';
import useTranslation from '@shared/hooks/useTranslation';

import './PrivacyPolicyPage.scss';

function PrivacyPolicyPage() {
  const i18n = useTranslation('privacyPolicy');
  const [ effectiveDate ] = useState(moment('08-24-2024', 'MM-DD-YYYY').format('DD MMMM YYYY'));

  const formatDescription = (description = '') => (description.includes('{email}')
    ? LocaleService.parseTranslation(description, {
      email: (
        <a href={`mailto:${app.contactEmail}`}>{app.contactEmail}</a>
      ),
    }) : description);

  const renderSectionContent = (section: any) => (
    <>
      <div>
        <span style={{ whiteSpace: 'pre-line' }}>
          {section.description}
        </span>
      </div>

      {section.items && (
        <ul>
          {section.items?.map((sectionItem: any) => (
            <li key={sectionItem.title}>
              <span className={classNames({ 'fw-bold': sectionItem.description })}>
                {formatDescription(sectionItem.title)}&nbsp;
              </span>
              {sectionItem.description && (
                <span>
                  {formatDescription(sectionItem.description)}
                </span>
              )}

              {renderSectionContent({ items: sectionItem.items })}
            </li>
          ))}
        </ul>
      )}

      {formatDescription(section.footer)}
    </>
  );

  const renderSection = (section: any, index: number, sub = false) => (
    <div className={classNames({ section: !sub })} key={section.title}>
      {section.title && (
        <div className={classNames('fw-bold mb-1', { 'text-primary': !sub, 'text-uppercase': !sub })}>
          {index + 1}.&nbsp;
          {section.title}
        </div>
      )}

      {renderSectionContent(section)}

      {section.sections?.map?.((s: any, i: number) => renderSection(s, i, true))}

    </div>
  );

  return (
    <Container fluid className="privacy-policy-page">
      <Container className="px-0 px-md-5 py-4 pt-5 mt-5">
        <BackButton />

        <h1 className="text-center">
          {i18n.title}
        </h1>

        <p className="text-muted">
          {LocaleService.parseTranslation(i18n.label.effectiveDate, { date: effectiveDate })}
        </p>

        {i18n.sections?.map((s: any, i: number) => renderSection(s, i))}

        <div className="section">
          <div className="text-primary fw-bold mb-1">
            {i18n.faq.title}
          </div>

          {i18n.faq.sections?.map((s: any, i: number) => renderSection(s, i, true))}
        </div>
      </Container>
    </Container>
  );
}

export default PrivacyPolicyPage;
