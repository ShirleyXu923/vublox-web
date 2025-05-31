import './OrganizationForm.scss';

import React, { useEffect, useState } from 'react';
import {
  Col,
  FormText,
  Row,
} from 'reactstrap';

import formConfig from '@config/form';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import SwitchButton from '@shared/buttons/SwitchButton/SwitchButton';
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
import Select from '@shared/utils/Forms/Select/Select';
import TagsInput from '@shared/utils/Forms/TagsInput/TagsInput';

interface IContact {
  email: string;
  website: string;
  is_email_hidden: boolean;
}

interface IUrl {
  facebook: string;
  instagram: string;
  tiktok: string;
  x: string;
  youtube: string;
}

interface IForm {
  name?: string;
  started_at?: Date | null;
  ended_at?: Date | null;
  category_id?: string | null;
  privacy_option?: string | null;
  tags: any[];
  has_ended_at?: boolean;
  contact: IContact;
  url: IUrl;
  category?: any;
}

interface OrganizationFormProps {
  form: IForm;
  handleInputChange: (evt: any) => void;
  onSubmit: (evt: any) => void;
  errors: any;
  submitLabel?: string;
  loading?: boolean;
}

function OrganizationForm({
  form,
  handleInputChange,
  onSubmit,
  errors,
  loading,
  submitLabel,
}: OrganizationFormProps) {
  const i18n = LocaleService.getTranslations('createOrganization');
  const [ hasEndDate, setHasEndDate ] = useState(true);

  const getSubmitDisabled = () => {
    let isDisabled = true;
    if (
      form?.name !== '' && form?.category_id !== null && form?.started_at !== null && form?.category_id !== null
    ) {
      isDisabled = false;
    } else {
      isDisabled = true;
    }

    return isDisabled;
  };

  const handleChangeEndDate = () => {
    setHasEndDate(!hasEndDate);
    handleInputChange({
      target: {
        name: 'has_ended_at',
        value: hasEndDate,
      },
    });

    if (hasEndDate) {
      handleInputChange({
        target: {
          name: 'ended_at',
          value: null,
        },
      });
    }
  };

  const handleTagsInputChange = (name: string, value: any[]) => {
    const evt = {
      target: {
        name,
        value: value.map((v: any) => v.value),
      },
    };

    handleInputChange(evt);
  };

  const handleDeepChange = (key: string, value: any) => {
    const [ parent, child ] = key.split('.');
    const copy: any = { ...form };
    let newObject = copy[parent];
    newObject = {
      ...newObject,
      [child]: value,
    };

    handleInputChange({
      target: {
        name: parent,
        value: newObject,
      },
    });
  };

  useEffect(() => {
    if (!form?.ended_at) {
      setHasEndDate(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="organization-form">
      {/* <!-- Organization Form -->> */}
      <form onSubmit={onSubmit}>
        <p className="form-title">{i18n.label.organizationNameCaps}</p>
        <Alert
          label={i18n.label.organizationFormAlert}
          icon={<Info />}
        />

        {/* Organization Name */}
        <Row>
          <Col md={12}>
            <Input
              name="name"
              maxLength={formConfig.organization.fields.name.max}
              onChange={handleInputChange}
              value={form?.name}
              placeholder={i18n.label.organizationName}
              label={i18n.label.organizationName}
              required
              errors={errors.name}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.name?.length ?? 0}/${formConfig.organization.fields.name.max}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
        </Row>
        <Row>
          <p>{i18n.label.whenOrganizationUsed}</p>
        </Row>
        <Row>
          <Col md={12}>
            <ADBCDateInput
              label={i18n.label.startDate}
              required
              selected={form?.started_at}
              onChange={(e: any) => {
                handleInputChange({
                  target: {
                    name: 'started_at',
                    value: e?.date?.toISOString(),
                  },
                });
              }}
              errors={errors?.started_at}
            />
          </Col>
          <Col className={`${!hasEndDate ? 'input-to-disable' : ''}`} md={12}>
            <ADBCDateInput
              label={i18n.label.endDate}
              required
              selected={form?.ended_at}
              disabled={!hasEndDate}
              onChange={(e: any) => {
                handleInputChange({
                  target: {
                    name: 'ended_at',
                    value: e?.date?.toISOString(),
                  },
                });
              }}
              errors={errors?.started_at}
            />
            <Checkbox
              checked={!hasEndDate}
              onChange={handleChangeEndDate}
              label={i18n.label.noEndDate}
            />
          </Col>
        </Row>
        {/* Contact Details */}
        <Row>
          <Col md={12}>
            <p className="form-title">{i18n.label.contactDetails}</p>
          </Col>
          <Col md={6}>
            <Input
              name="website"
              maxLength={formConfig.organization.fields.contact_website.max}
              placeholder={i18n.label.website}
              label={i18n.label.website}
              value={form?.contact?.website}
              error={errors.contact}
              onChange={(e: any) => handleDeepChange('contact.website', e.target.value)}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.contact?.website?.length ?? 0}/${formConfig.organization.fields.contact_website.max}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
          <Col md={6}>
            <Input
              name="email"
              maxLength={formConfig.organization.fields.contact_email.max}
              placeholder={i18n.label.email}
              label={i18n.label.email}
              type="email"
              value={form?.contact?.email}
              error={errors.contact}
              onChange={(e: any) => handleDeepChange('contact.email', e.target.value)}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.contact?.email?.length ?? 0}/${formConfig.organization.fields.contact_email.max}`}
                  </small>
                </FormText>
              )}
            />
            <div className="info-warning">
              <SwitchButton
                activeLabel={i18n.label.show}
                offLabel={i18n.label.hide}
                isActive={form?.contact?.is_email_hidden}
                onChange={(e: any) => {
                  let newObject = form.contact;
                  newObject = {
                    ...newObject,
                    is_email_hidden: e.target.value,
                  };
                  handleInputChange({
                    target: {
                      name: 'contact',
                      value: newObject,
                    },
                  });
                }}
              />
              <div className="b3">{i18n.label.privateEmail}</div>
            </div>
          </Col>
        </Row>

        {/* Social Media */}
        <Row>
          <Col md={12}>
            <p className="form-title">{i18n.label.socialMedia}</p>
          </Col>
          <Col md={12}>
            <Input
              className="custom-form"
              name="facebook"
              leftIcon={(
                <div className="prefix-container">
                  <span className="label caption3">{i18n.label.facebook}</span>
                  <div className="prefix">
                    <FacebookInput />
                    <span className="b5">https://www.facebook.com/</span>
                  </div>
                </div>
              )}
              value={form?.url?.facebook}
              onChange={(e: any) => handleDeepChange('url.facebook', e.target.value)}
              maxLength={formConfig.organization.fields.contact_url.max}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.url?.facebook?.length ?? 0}/${formConfig.organization.fields.contact_url.max}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
          <Col md={12}>
            <Input
              className="custom-form"
              name="instagram"
              leftIcon={(
                <div className="prefix-container">
                  <span className="label caption3">{i18n.label.instagram}</span>
                  <div className="prefix">
                    <InstagramInputIcon />
                    <span className="b5">https://www.instagram.com/</span>
                  </div>
                </div>
              )}
              value={form?.url?.instagram}
              onChange={(e: any) => handleDeepChange('url.instagram', e.target.value)}
              maxLength={formConfig.organization.fields.contact_url.max}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.url?.instagram?.length ?? 0}/${formConfig.organization.fields.contact_url.max}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
          <Col md={12}>
            <Input
              className="custom-form"
              name="tiktok"
              leftIcon={(
                <div className="prefix-container">
                  <span className="label caption3">{i18n.label.tiktok}</span>
                  <div className="prefix">
                    <TiktokInputIcon />
                    <span className="b5">https://www.tiktok.com/</span>
                  </div>
                </div>
              )}
              value={form?.url?.tiktok}
              onChange={(e: any) => handleDeepChange('url.tiktok', e.target.value)}
              maxLength={formConfig.organization.fields.contact_url.max}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.url?.tiktok?.length ?? 0}/${formConfig.organization.fields.contact_url.max}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
          <Col md={12}>
            <Input
              name="x"
              className="custom-form"
              leftIcon={(
                <div className="prefix-container">
                  <span className="label caption3">{i18n.label.x}</span>
                  <div className="prefix">
                    <XInputIcon />
                    <span className="b5">https://www.x.com/</span>
                  </div>
                </div>
              )}
              value={form?.url?.x}
              onChange={(e: any) => handleDeepChange('url.x', e.target.value)}
              maxLength={formConfig.organization.fields.contact_url.max}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.url?.x?.length ?? 0}/${formConfig.organization.fields.contact_url.max}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
          <Col md={12}>
            <Input
              className="custom-form"
              name="youtube"
              leftIcon={(
                <div className="prefix-container">
                  <span className="label caption3">{i18n.label.youtube}</span>
                  <div className="prefix">
                    <YoutubeInputIcon />
                    <span className="b5">https://www.youtube.com/</span>
                  </div>
                </div>
              )}
              value={form?.url?.youtube}
              onChange={(e: any) => handleDeepChange('url.youtube', e.target.value)}
              maxLength={formConfig.organization.fields.contact_url.max}
              rightIcon={(
                <FormText>
                  <small className="text-muted">
                    {`${form?.url?.youtube?.length ?? 0}/${formConfig.organization.fields.contact_url.max}`}
                  </small>
                </FormText>
              )}
            />
          </Col>
        </Row>

        {/* Settings */}
        <Row>
          <Col md={12}>
            <p className="form-title">{i18n.label.settingsCaps}</p>
          </Col>
          <Col md={12}>
            <CategoryInput
              defaultOption={form?.category ? {
                label: form?.category?.name,
                value: form?.category?.id,
              } : null}
              onChange={(e) => handleInputChange({ target: { name: 'category_id', value: e.value } } as any)}
            />

            <Select
              errors={errors.privacy_option}
              name="privacy_option"
              className="mt-4"
              label={i18n.label.privacy}
              placeholder={i18n.label.privacy}
              required
              options={[
                { label: i18n.label.public, value: 'public' },
                { label: i18n.label.private, value: 'private' },
                { label: i18n.label.inviteOnly, value: 'invite_only' },
              ]}
              defaultValue={{ label: i18n.label.public, value: 'public' }}
              onChange={(v) => {
                handleInputChange({
                  target: {
                    name: 'privacy_option',
                    value: v?.value,
                  },
                });
              }}
            />
            <TagsInput
              defaultValue={form?.tags}
              errors={errors.tags}
              maxLength={formConfig.organization.fields.tags.max}
              className="mt-4"
              required
              label={i18n.label.tags}
              placeholder={i18n.label.tags}
              value={form?.tags}
              onChange={(newValue: any) => { handleTagsInputChange('tags', newValue); }}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md={12}>
            <Button
              loading={loading}
              isForm
              onClick={onSubmit}
              disabled={getSubmitDisabled()}
              color={getSubmitDisabled() ? 'secondary' : 'primary'}
              label={submitLabel ?? i18n.button.createOrganization}
            />
          </Col>
        </Row>
      </form>
      {/* <!-- Organization Form -->> */}
    </div>
  );
}

export default OrganizationForm;
