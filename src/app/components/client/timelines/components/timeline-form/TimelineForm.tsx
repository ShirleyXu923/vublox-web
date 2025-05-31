import React, { useEffect, useState } from 'react';
import {
  Col,
  Container,
  FormGroup,
  FormText,
  Label,
  Row,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import AccountSwitcher from '@shared/components/AccountSwitcher/AccountSwitcher';
import TimezonePicker from '@shared/components/TimezonePicker/TimezonePicker';
import { serverDateTimeFormat, utcToTimezoneDate } from '@shared/helpers';
import { CloseIcon } from '@shared/icons';
import Media from '@shared/icons/Media';
import Dropzone from '@shared/utils/Dropzone/Dropzone';
import { ADBCDateInput } from '@shared/utils/Forms/ADBCDateInput';
import CategoryInput from '@shared/utils/Forms/CategoryInput/CategoryInput';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';
import Input from '@shared/utils/Forms/Input/Input';
import './TimelineForm.scss';
import Select from '@shared/utils/Forms/Select/Select';
import TagsInput from '@shared/utils/Forms/TagsInput/TagsInput';

interface IForm {
  cover_image?: any;
  name?: string | null;
  description?: string | null;
  privacy_option?: string | null;
  category_id?: string | null;
  started_at?: Date | null;
  tags: any[]
  category?: any;
  location: any;
  timezone: any;
  timelineable_id?: string;
  timelineable_type?: string;
}

interface TagType {
  label: string;
  value: string;
}

interface LocationType {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface DefaultValueType {
  tags: TagType[] | null;
  location: LocationType | null;
}

interface TimelineFormProps {
  defaultValues?: DefaultValueType;
  onInputChange: (evt: any) => void;
  onSubmit: (evt: any) => void;
  form: IForm;
  errors?: any;
  submitButtonText?: string;
  loading?: boolean;
  hideSubmit?: boolean;
}

function TimelineForm({
  onInputChange,
  form,
  onSubmit,
  errors,
  submitButtonText,
  loading,
  defaultValues,
  hideSubmit,
}: TimelineFormProps) {
  const i18n = LocaleService.getTranslations('createTimeline');
  const [ startDate, setStartDate ] = useState(utcToTimezoneDate(form?.started_at,
    form?.timezone?.value));
  const [ time, setTime ] = useState(
    form?.started_at ? utcToTimezoneDate(form?.started_at, form?.timezone?.value)
      : new Date() as any);
  const isButtonActive = form?.name
    && form?.privacy_option && form?.started_at && form?.category_id;

  const handleTagsInputChange = (name: string, value: any[]) => {
    if (form?.tags?.length >= 5 && value?.length >= 5) {
      return;
    }

    const evt = {
      target: {
        name,
        value: value.map((v: any) => v.value),
      },
    };

    onInputChange(evt);
  };

  const removeDefaultImage = () => {
    onInputChange({
      target: {
        name: 'cover_image',
        value: null,
      },
    });
  };

  const getPrivacyOption = () => {
    let privacy = 'public';

    if (form.privacy_option) {
      privacy = form.privacy_option;
    }

    return privacy;
  };

  useEffect(() => {
    onInputChange({
      target: {
        name: 'started_at',
        value: startDate && time && form.timezone?.value
          ? serverDateTimeFormat(startDate, time, form.timezone.value) : null,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ startDate, time, form.timezone ]);

  return (
    <Container className="timeline-form-container">
      <form className="timeline-form" onSubmit={onSubmit}>

        <AccountSwitcher onChange={(selected: any) => {
          onInputChange({
            target: {
              name: 'ownerable_id',
              value: selected?.id,
            },
          });

          onInputChange({
            target: {
              name: 'ownerable_type',
              value: selected?.type === 'user' ? 'Client' : 'Organization',
            },
          });
        }}
        />

        <p className="form-title">{i18n.label.timelineDetails}</p>
        <Input
          name="name"
          label={form.name ? i18n.label.timelineName : i18n.label.enterTimelineName}
          placeholder={i18n.label.timelineName}
          required
          value={form?.name as string}
          onChange={onInputChange}
          errors={errors?.name}
          rightIcon={(

            <FormText
              className="float-text"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '15px',
              }}
            >
              <small className="text-muted text-placeholder" style={{ fontSize: '12px' }}>
                {`${form?.name ? form?.name?.length : 0}/50`}
              </small>
            </FormText>
          )}
        />

        <FormGroup floating>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder={i18n.label.description}
            style={{ height: '120px' }}
            maxLength={1000}
            onChange={onInputChange}
          />
          <Label for="description">{i18n.label.description}
          </Label>
          <FormText>
            <small className="text-muted text-placeholder" style={{ fontSize: '12px' }}>
              {`${form?.description?.length || 0}/1,000`}
            </small>
          </FormText>
        </FormGroup>

        {form?.cover_image?.md
          ? (
            <div className="cover-image-preview">
              <div className="b5">{i18n.label.uploadCoverPhoto}</div>
              <img className="preview-image" src={form?.cover_image?.md} alt="" />
              <div className="close-button" onClick={removeDefaultImage}>
                <CloseIcon />
              </div>
            </div>
          )
          : (
            <Dropzone
              single
              onFileAdded={(e: File[]) => {
                onInputChange({
                  target: {
                    name: 'cover_image',
                    value: e[0],
                  },
                });
              }}
              icon={<Media />}
              label={i18n.label.uploadCoverPhoto}
              uploadText={i18n.label.uploadText}
              accept={{
                'image/*': [ '.jpeg', '.jpg', '.png' ],
              }}
              acceptedTypes={{
                'image/png': [ '.png' ],
                'image/jpeg': [ '.jpg', '.jpeg' ],
              }}
              maxSize={5e7}
            />
          )}

        <ADBCDateInput
          label={i18n.label.startDate}
          required
          onChange={(e: any) => setStartDate(e.date)}
          selected={startDate}
        />

        <div className="my-2">
          <DatePickerInput
            disabled={!form?.started_at}
            type="time"
            name="started_at"
            label={i18n.label.time}
            selected={time}
            onChange={setTime}
            clearIcon={null}
          />
        </div>

        <TimezonePicker
          onChange={(v: any) => {
            onInputChange({ target: { name: 'timezone', value: v } } as any);
          }}
          value={form.timezone}
        />

        <p className="form-title">{i18n.label.settings}</p>

        <CategoryInput
          defaultOption={form?.category ? {
            label: form?.category?.name,
            value: form?.category?.id,
          } : null}
          onChange={(e: any) => {
            onInputChange({
              target: {
                name: 'category_id',
                value: e.value,
              },
            });
          }}
        />

        <Select
          name="privacy_option"
          className="mt-4"
          label={i18n.label.privacy}
          placeholder={i18n.label.privacy}
          required
          options={[
            { label: i18n.label.public, value: 'public' },
            { label: i18n.label.private, value: 'private' },
          ]}
          defaultValue={{
            label: (i18n.label as any)[getPrivacyOption()],
            value: getPrivacyOption(),
          }}
          onChange={(e: any) => {
            onInputChange({
              target: {
                name: 'privacy_option',
                value: e.value,
              },
            });
          }}
        />
        <TagsInput
          defaultValue={defaultValues?.tags}
          maxLength={5}
          className="mt-4"
          label={i18n.label.tags}
          placeholder={i18n.label.tags}
          onChange={(v: any) => handleTagsInputChange('tags', v)}
          components={{ IndicatorsContainer: () => null }}
          isClearable
        />

        {!hideSubmit && (
          <Row className="mt-5 timeline-submit-and-next-button-mobile">
            <Col md={12}>
              <Button
                loading={loading}
                disabled={!isButtonActive}
                isForm
                color="primary"
                onClick={onSubmit}
                label={submitButtonText || i18n.button.createTimeline}
              />
            </Col>
          </Row>
        )}
      </form>
    </Container>
  );
}

export default TimelineForm;
