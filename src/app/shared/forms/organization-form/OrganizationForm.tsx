/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import './OrganizationForm.scss';
import _ from 'lodash';
import React from 'react';
import { Col, FormText, Row } from 'reactstrap';

import { Button } from '@shared/buttons/Button';
import { SwitchButton } from '@shared/buttons/SwitchButton';
import useTranslation from '@shared/hooks/useTranslation';
import FacebookInput from '@shared/icons/FacebookInput';
import InstagramInputIcon from '@shared/icons/InstagramInputIcon';
import TiktokInputIcon from '@shared/icons/TiktokInputIcon';
import XInputIcon from '@shared/icons/XInputIcon';
import YoutubeInputIcon from '@shared/icons/YoutubeInputIcon';
import Info from '@shared/icons/info';
import Alert from '@shared/utils/Alert/Alert';
import { ADBCDateInput } from '@shared/utils/Forms/ADBCDateInput';
import CategoryInput from '@shared/utils/Forms/CategoryInput/CategoryInput';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';
import Input from '@shared/utils/Forms/Input/Input';
import TagsInput from '@shared/utils/Forms/TagsInput/TagsInput';

import SocialInput from './components/social-input/SocialInput';
import useFormConfig from './hooks/useFormConfig';
import useFormFeature, { FormType } from './hooks/useFormFeature';
import useValidate from '../hooks/useValidate';
import { SubmitType } from '../types';

interface OrganizationFormProps {
  submit: SubmitType;
  defaultValue?: FormType;
}

interface SocialInputType {
  name: string;
  icon: React.ReactElement;
}

function OrganizationForm({ submit, defaultValue }: OrganizationFormProps) {
  const i18n = useTranslation('createOrganization');
  const formConfig = useFormConfig();
  const {
    name,
    started_at,
    ended_at,
    contact,
    url,
    category_id,
    tags,
  } = formConfig;
  const {
    form,
    errors,
    onInputChange,
    onFormSubmit,
    loading,
  } = useFormFeature(submit, defaultValue);
  const socialInputs = [
    {
      name: 'facebook',
      icon: <FacebookInput />,
    },
    {
      name: 'instagram',
      icon: <InstagramInputIcon />,
    },
    {
      name: 'tiktok',
      icon: <TiktokInputIcon />,
    },
    {
      name: 'x',
      icon: <XInputIcon />,
    },
    {
      name: 'youtube',
      icon: <YoutubeInputIcon />,
    },
  ];

  return (
    <div className="organization-form">
      <form onSubmit={onFormSubmit}>
        <Row>
          <Col md={12}>
            <p className="form-title title-name">{i18n.label.organizationNameCaps}</p>
            <Alert
              label={i18n.label.organizationFormAlert}
              icon={<Info />}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Input
              errors={_.get(errors, 'name')}
              name={name.id}
              maxLength={name.max}
              onChange={onInputChange}
              value={form.name}
              placeholder={name.label}
              label={name.label}
              required={name.required}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.name?.length ?? 0}/${name.max}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="b3 mt-3">{name.feedback}</div>
            <ADBCDateInput
              errors={_.get(errors, 'started_at')}
              name={started_at.id}
              label={started_at.label}
              required={started_at.required}
              selected={form?.started_at}
              onChange={(e: any) => {
                onInputChange({
                  target: {
                    name: started_at.id,
                    value: e?.date,
                  },
                });
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <ADBCDateInput
              errors={_.get(errors, 'ended_at')}
              label={ended_at.label}
              required
              disabled={form.noEndDate}
              selected={form?.ended_at}
              onChange={(e: any) => {
                onInputChange({
                  target: {
                    name: ended_at.id,
                    value: e?.date,
                  },
                });
              }}
            />
            <Checkbox
              checked={form.noEndDate}
              onChange={() => {
                if (!form.noEndDate) {
                  onInputChange({
                    target: {
                      name: 'ended_at',
                      value: null,
                    },
                  });
                }

                onInputChange({
                  target: {
                    name: 'noEndDate',
                    value: !form.noEndDate,
                  },
                });
              }}
              label={i18n.label.noEndDate}
            />
          </Col>
        </Row>
        {/*
            Contact details section in the form
        */}
        <Row>
          <Col md={12}>
            <p className="form-title">{i18n.label.contactDetails}</p>
          </Col>
          <Col md={6}>
            <Input
              errors={_.get(errors, 'contact.website')}
              name={_.get(contact, 'website.id')}
              maxLength={_.get(contact, 'website.max')}
              placeholder={_.get(contact, 'website.label')}
              label={_.get(contact, 'website.label')}
              value={form?.contact?.website}
              onChange={onInputChange}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${_.get(form, 'contact.website')?.length || 0}/${_.get(contact, 'website.max')}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
          <Col md={6}>
            <Input
              errors={_.get(errors, 'contact.email')}
              name={_.get(contact, 'email.id')}
              maxLength={_.get(contact, 'email.max')}
              placeholder={_.get(contact, 'email.label')}
              label={_.get(contact, 'email.label')}
              value={form?.contact?.email}
              onChange={onInputChange}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${_.get(form, 'contact.email')?.length || 0}/${_.get(contact, 'email.max')}`}
                  </small>
                </FormText>
              )}
            />
            <div className="info-warning">
              <SwitchButton
                name={_.get(contact, 'is_email_hidden.id')}
                activeLabel={i18n.label.show}
                offLabel={i18n.label.hide}
                isActive={_.get(form, 'contact.is_email_hidden')}
                onChange={onInputChange}
              />
              <div className="b3">{_.get(contact, 'is_email_hidden.label')}</div>
            </div>
          </Col>
        </Row>

        {/*
          Social Media section in the form
        */}
        <Row>
          <Col md={12}>
            <p className="form-title">{i18n.label.socialMedia}</p>
          </Col>
          {socialInputs.map((social: SocialInputType) => (
            <SocialInput
              key={social.name}
              name={social.name}
              icon={social.icon}
              form={form}
              url={url}
              onInputChange={onInputChange}
            />
          ))}
        </Row>
        {/*
          Settings section in the form
        */}
        <Row>
          <Col md={12}>
            <p className="form-title">{i18n.label.settingsCaps}</p>
          </Col>
          <Col md={12} className="category__input">
            <CategoryInput
              errors={_.get(errors, 'category_id')}
              name={_.get(category_id, 'id')}
              defaultOption={defaultValue?.category}
              onChange={(e: any) => {
                onInputChange({
                  target: {
                    value: e.value,
                    name: _.get(category_id, 'id'),
                  },
                });
              }}
            />
          </Col>
          <Col md={12} className="tag-col">
            <TagsInput
              defaultValue={_.get(form, 'default_tags')}
              errors={_.get(errors, 'tags')}
              maxLength={_.get(tags, 'max')}
              className="mt-4"
              required={_.get(tags, 'required')}
              label={_.get(tags, 'label')}
              placeholder={_.get(tags, 'label')}
              value={_.get(form, 'tags')}
              onChange={(e: any) => {
                onInputChange({
                  target: {
                    name: 'tags',
                    value: e.map((v: any) => v.value),
                  },
                });
              }}
              components={{ IndicatorsContainer: () => null }}
              isClearable
            />
          </Col>
        </Row>
        <Row className="mt-3 ">
          <Col md={12} className="organization-submit-and-next-button-mobile">
            <Button
              loading={loading}
              onClick={onFormSubmit}
              disabled={!useValidate(form, formConfig, [ 'name', 'started_at', 'category_id', 'privacy_option', 'tags' ])}
              type="submit"
              isForm
              label={submit.label || i18n.button.createOrganization}
            />
          </Col>
        </Row>
      </form>
    </div>
  );
}

export default OrganizationForm;
