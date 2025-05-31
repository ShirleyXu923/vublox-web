import React, {
  ChangeEvent, FormEvent, useEffect, useRef, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import {
  Button, Form,
  Row, Col,
  Spinner,
  FormText,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getUserDetailsRequest, updateSettingsRequest } from '@reducers/auth/AuthAction';
import LocaleService from '@services/LocaleService';
import { getFormData } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import {
  CameraIcon, MessageIcon,
  UserIcon, EmailIcon,
  GoogleIcon,
  XIcon,
  FacebookIcon,
  InfoIcon,
} from '@shared/icons';
import UsernameIcon from '@shared/icons/UsernameIcon';
import FileUploader, { FileUploaderRef } from '@shared/utils/FileUploader/FileUploader';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';
import Input from '@shared/utils/Forms/Input/Input';
import './AccountTab.scss';
import Select from '@shared/utils/Forms/Select/Select';
import { LocationInput } from '@shared/utils/Forms/location-input';

import DeleteAccountModal from '../delete-account-modal/DeleteAccountModal';
import DisconnectEmailModal from '../disconnect-email-modal/DisconnectEmailModal';

function AccountTab() {
  const i18n = useTranslation('settings.account');
  const isSmScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const account: any = useSelector((state: IRootState) => state.Auth.user);
  const { settings = {} } = account as { settings: any };
  const [ locations, setLocations ] = useState<any>({});

  const handleSetLocations = (event: any) => {
    const locationData = event.target.value;
    setLocations((s: any) => ({ ...s, ...locationData }));
  };

  const [ data, setData ] = useState({
    id: account.id,
    first_name: account.first_name || '',
    last_name: account.last_name || '',
    email: account.email || '',
    bio: account.bio || '',
    image: null,
    image_preview: account.image?.md || null,
    timeline_privacy: settings['account.privacy'],
    username: account?.profile?.username || '',
    birth_date: account?.profile?.birth_date ? new Date(account.profile.birth_date) : null,
    place_of_birth: account?.profile?.place_of_birth || '',
  });
  const [ errors, setErrors ] = useState<any>({});
  const [ isLoading, setIsLoading ] = useState(false);
  const [ showDeleteAccount, setShowDeleteAccount ] = useState(false);
  const [ showDisconnectEmail, setShowDisconnectEmail ] = useState(false);
  const profilePictureUploader = useRef<FileUploaderRef>(null);
  const dispatch = useDispatch<any>();

  const updateData = () => {
    setData({
      id: account.id,
      first_name: account.first_name || '',
      last_name: account.last_name || '',
      bio: account?.profile?.bio || '',
      image: null,
      image_preview: account.image?.md || null,
      email: account.email || '',
      timeline_privacy: settings['account.privacy'],
      username: account?.profile?.username,
      birth_date: account?.profile?.birth_date ? new Date(account.profile.birth_date) : null,
      place_of_birth: account?.profile?.place_of_birth,
    });
    const defaultLocation = account?.profile?.placeOfBirth;
    if (defaultLocation) {
      setLocations({
        name: defaultLocation.name || '',
        address: defaultLocation.address || '',
        country_code: defaultLocation.country_code || '',
        latitude: defaultLocation.latitude || 0,
        longitude: defaultLocation.longitude || 0,
      });
    } else {
    // Handle case where no location exists
      setLocations(null);
    }
  };

  const getSocialIcon = () => {
    if (account.external_type === 'google') {
      return <GoogleIcon width="18" />;
    }
    if (account.external_type === 'twitter') {
      return <XIcon width="18" />;
    }
    if (account.external_type === 'facebook') {
      return <FacebookIcon width="18" />;
    }

    return <EmailIcon />;
  };

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((s) => ({
      ...s,
      [target.name]: target.value,
    }));
  };
  const handleDateChange = (date: Date | null) => {
    setData((s) => ({
      ...s,
      birth_date: date,
    }));
  };

  const handleFileAdded = (key: string, res: File[]) => {
    setErrors((e: any) => ({
      ...e,
      [key]: [],
    }));
    setData((s: any) => ({
      ...s,
      [key]: res[0],
      image_preview: URL.createObjectURL(res[0]),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    const combinedData = {
      ...data,
      location: locations?.latitude && locations?.longitude ? {
        latitude: locations.latitude,
        longitude: locations.longitude,
        name: locations.name || account.profile?.placeOfBirth?.name,
        address: locations.address || account.profile?.placeOfBirth?.address,
        country_code: locations.country_code || account.profile?.placeOfBirth?.country_code,
      } : undefined, // Don't include 'location' if it's incomplete
    };

    try {
      await dispatch(updateSettingsRequest(getFormData(combinedData))).$promise;
      toast.success(i18n.success.submit);
      await dispatch(getUserDetailsRequest()).$promise;
    } catch (err: any) {
      const { response = {} } = err;
      const { errors: errs } = response?.data as any;
      if (response?.status === 422) {
        setErrors(errs);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ account ]);

  return (
    <div className="account-tab">
      <Form onSubmit={handleSubmit}>
        <div className="profile-image" onClick={() => profilePictureUploader.current?.open()}>
          <FileUploader
            ref={profilePictureUploader}
            onDrop={(ac) => handleFileAdded('image', ac)}
            onTypeError={(error: string) => {
              setErrors({
                ...errors,
                image: [ error ],
              });
            }}
            accept={{
              'image/*': [ '.jpeg', '.jpg', '.png' ],
            }}
            acceptedTypes={{
              'image/png': [ '.png' ],
              'image/jpeg': [ '.jpg', '.jpeg' ],
            }}
            maxSize={1e8}
          />
          {data.image_preview ? (
            <img src={data.image_preview} alt="Profile" />
          ) : (
            <CameraIcon />
          )}
        </div>
        <div className="text-danger text-center">
          {errors.image && errors.image[0]}
        </div>
        <div className="mt-2 text-center small text-muted">{i18n.label.profilePhoto}</div>

        <Row className="my-4">
          <Col className="mb-md-0">
            <Input
              name="first_name"
              label={i18n.label.firstName}
              placeholder={i18n.label.firstName}
              onChange={handleInputChange}
              value={data.first_name}
              errors={errors.first_name}
              leftIcon={<UserIcon />}
            />
          </Col>
          <Col>
            <Input
              name="last_name"
              label={i18n.label.lastName}
              placeholder={i18n.label.lastName}
              onChange={handleInputChange}
              value={data.last_name}
              errors={errors.last_name}
              leftIcon={<UserIcon />}
            />
          </Col>
          <Col md={12} className="mb-3">
            <Input
              name="email"
              label={i18n.label.email}
              placeholder={i18n.label.email}
              onChange={handleInputChange}
              value={data.email}
              errors={errors.email}
              leftIcon={getSocialIcon()}
              rightIcon={account.external_id && (
                <Button
                  color="link"
                  size="sm"
                  className="text-danger p-0 b6"
                  onClick={() => setShowDisconnectEmail(true)}
                >
                  {i18n.button.disconnect}
                </Button>
              )}
              formGroupProps={{ noMargin: true }}
              disabled
            />
            {account.external_id && (
              <FormText className="d-flex align-items-center ms-2">
                <InfoIcon width="15" />&nbsp;
                <small>
                  {LocaleService.parseTranslation(i18n.label.disconnectEmailNote,
                    { social: account.external_type })}
                </small>
              </FormText>
            )}
          </Col>
          <Col md={12}>
            <Input
              name="username"
              label={i18n.label.username}
              onChange={handleInputChange}
              value={data.username}
              errors={errors?.username}
              leftIcon={<UsernameIcon />}
              placeholder={i18n.label.username}
            />
          </Col>
          <Col md={12}>
            <Input
              name="bio"
              label={i18n.label.bio}
              onChange={handleInputChange}
              value={data.bio}
              errors={errors.bio}
              leftIcon={<MessageIcon />}
              customInput={(
                <textarea
                  name="bio"
                  placeholder={i18n.label.bio}
                  className="form-control"
                  onChange={handleInputChange}
                  maxLength={200}
                  style={{ height: '150px' }}
                  value={data.bio}
                />
              )}
            />
          </Col>
          <Col sm={6}>
            <DatePickerInput
              label={i18n.label.dateOfBirth}
              selected={data.birth_date}
              onChange={handleDateChange}
              // required
              errors={errors.birth_date}
              leftIconPosition
              maxDate={new Date()}
              placeholderText={i18n.label.dateOfBirth}

            />
            <Col md={12}>
              <div className="b5 mx-2 mt-n3 mb-3 small text-placeholder date-note">
                {i18n.label.dateInputMessage}
              </div>
            </Col>
          </Col>
          <Col sm={6}>
            <LocationInput
              handleInputChange={handleSetLocations}
              hideMap
              onAccountSettings
              defaultValue={account?.profile?.placeOfBirth}

            />
          </Col>
        </Row>

        <div className={`${isSmScreen ? 'mt-1' : 'mt-5'} mb-3 text-muted text-uppercase`}>
          {i18n.label.settings}
        </div>

        <Row>
          <Col md={12}>
            <Select
              label={i18n.label.timelinePrivacy}
              placeholder={i18n.label.timelinePrivacy}
              options={[
                { label: i18n.label.public, value: 'public' },
                { label: i18n.label.private, value: 'private' },
              ]}
              required
              onChange={(v: any) => {
                handleInputChange({ target: { name: 'timeline_privacy', value: v.value } } as any);
              }}
              defaultValue={settings['account.privacy']
                ? { label: i18n.label[`${settings['account.privacy']}` as 'public' | 'private'], value: settings['account.privacy'] } : undefined}
              errors={errors.timeline_privacy}
            />
          </Col>
        </Row>

        <Button
          color="primary"
          block
          type="submit"
          className="mt-4 action-button"
          disabled={!data.first_name || !data.last_name || !data.email || isLoading}
        >
          {isLoading && <Spinner size="sm" className="me-2" />}
          {i18n.button.saveChanges}
        </Button>
      </Form>

      <DeleteAccountModal show={showDeleteAccount} toggle={() => setShowDeleteAccount(s => !s)} />
      <DisconnectEmailModal
        show={showDisconnectEmail}
        toggle={() => setShowDisconnectEmail(s => !s)}
      />
    </div>
  );
}

export default React.forwardRef(AccountTab);
