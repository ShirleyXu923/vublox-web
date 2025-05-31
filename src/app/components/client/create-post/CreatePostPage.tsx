import { captureEvent, captureException } from '@sentry/react';
import { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from 'axios';
import classNames from 'classnames';
import exifr from 'exifr';
import { startCase } from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import React, {
  ChangeEvent, ClipboardEvent, CompositionEvent, useEffect, useRef, useState,
} from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import ContentEditable from 'react-contenteditable';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  Link, useLocation, useNavigate, useSearchParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Alert,
  Button,
  Col, Container, FormGroup, FormText, Label, Row, Spinner, TabContent, TabPane,
} from 'reactstrap';
import tzLookup from 'tz-lookup';

import { IRootState } from '@app/store';
import {
  dontShowAdultTooltipDispatch,
  // getMediaMetatagsRequest,
  getMetatagsRequest,
  getUsersAndOrganizationsRequest,
} from '@reducers/app/AppAction';
import { getEventRequest } from '@reducers/event/EventAction';
import { getLocationRequest } from '@reducers/location/LocationAction';
import { getOrganizationRequest } from '@reducers/organization/OrganizationAction';
import { getTimelineRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { analyzeFile } from '@services/MediaInfoService';
import { postRequest } from '@services/RequestService';
import AccountSwitcher from '@shared/components/AccountSwitcher/AccountSwitcher';
import NavigationWarningModal from '@shared/components/Modal/navigation-warning-modal/NavigationWarningModal';
import StepProgress from '@shared/components/StepProgress/StepProgress';
import TimezonePicker from '@shared/components/TimezonePicker/TimezonePicker';
import WebcamCapture from '@shared/components/WebcamCapture/WebcamCapture';
import {
  getFormData, isValidDate, serverDateTimeFormat,
} from '@shared/helpers';
import useMapKit from '@shared/hooks/useMapKit';
import useNavigationWarning from '@shared/hooks/useNavigationWarning';
import useTranslation from '@shared/hooks/useTranslation';
import {
  CameraIcon, CloseIcon, InfoIcon, LinkSquareIcon, UploadIcon,
} from '@shared/icons';
import FileUploader, { FileUploaderRef } from '@shared/utils/FileUploader/FileUploader';
import { ADBCDateInput } from '@shared/utils/Forms/ADBCDateInput';
import { ADBCDateInputRef } from '@shared/utils/Forms/ADBCDateInput/ADBCDateInput';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';
import Input from '@shared/utils/Forms/Input/Input';
import Select from '@shared/utils/Forms/Select/Select';
import TagsInput from '@shared/utils/Forms/TagsInput/TagsInput';
import PostableDropdown from '@shared/utils/postable-dropdown/PostableDropdown';

import { DeclineModal } from './components/decline-modal';
import EmbedLinkModal from './components/embed-link-modal/EmbedLinkModal';
import EnableLocation from './components/enable-location/EnableLocation';
import LinkPreview from './components/link-preview/LinkPreview';
import LocationPicker from './components/location-picker/LocationPicker';

import './CreatePostPage.scss';

declare global {
  interface Window {
    MediaInfo: any;
  }
}

function CreatePostPage() {
  const i18n = useTranslation('createPost');
  const showAdultTooltip = useSelector(({ App }) => App.showAdultTooltip);
  const [ declineModal, setDeclineModal ] = useState(false);
  const toggleDeclineModal = () => {
    setDeclineModal(!declineModal);
  };
  const i18nCreatePost = LocaleService.getTranslations('createPost');
  const [ searchParams ] = useSearchParams();
  const account = useSelector((state: IRootState) => state.Auth.account) as any;
  const [ timezone ] = useState(moment.tz.guess());
  const [ step, setStep ] = useState(0);
  const [ data, setData ] = useState({
    title: '',
    media: null,
    media_type: '',
    media_preview: '',
    location: null,
    ownerable_id: account.id,
    ownerable_type: account?.type === 'user' ? 'Client' : 'Organization',
    posted_at: new Date(),
    timezone: { label: `(GMT${moment.tz(timezone).format('Z')}) ${timezone}`, value: timezone },
    type: null,
  });
  const [ html, setHtml ] = useState('');
  const [ errors, setErrors ] = useState<any>({});
  const [ date, setDate ] = useState(new Date());
  const [ time, setTime ] = useState(new Date());
  const [ showEmbedLink, setShowEmbedLink ] = useState(false);
  const [ showWebcam, setShowWebcam ] = useState(false);
  const [ metadata, setMetadata ] = useState<any>();
  const [ postable, setPostable ] = useState<any>();
  const [ mentions, setMentions ] = useState([]);
  const [ tags, setTags ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ progress, setProgress ] = useState(0);
  const [ showEnableLocation, setShowEnableLocation ] = useState(false);
  const [ refLocation, setRefLocation ] = useState<any>();
  const dispatch = useDispatch<any>();
  const uploader = useRef<FileUploaderRef>(null);
  const description = useRef('');
  const dateInput = useRef<ADBCDateInputRef>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isSmallScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const navigate = useNavigate();
  useMapKit();
  const titleInputRef = useRef();
  const { hash } = useLocation();
  const [ isAdultContent, setIsAdultContent ] = useState(false);
  const [ isTypeDisabled, setIsTypeDisabled ] = useState(false);
  const [ isProcessingMetadata, setIsProcessingMetadata ] = useState(false);
  const [ formModified, setFormModified ] = useState(false);
  const [ previousType, setPreviousType ] = useState<string | null>(null);
  const {
    showWarningModal,
    closeWarningModal,
    handleContinueNavigation,
  } = useNavigationWarning({
    isActive: isProcessingMetadata || formModified,
    onContinueNavigation: () => {
      if (isProcessingMetadata) {
        setIsProcessingMetadata(false);
      }
      setFormModified(false);
    },
  });

  const markFormAsModified = () => {
    setFormModified(true);
  };

  const profile = account?.profile;

  const handleAdultContentChange = () => {
    if (!profile) {
      toast.error(i18n.label.noAvailableProfile);
      return;
    }

    // if (!isUserAdult(account)) {
    //   toast.error(i18n.label.userNotAdult);
    //   return;
    // }

    setIsAdultContent(!isAdultContent);
  };

  const suitableFor18PlusAlert = LocaleService.parseTranslation(
    i18nCreatePost.label.suitableFor18PlusAlert,
    {
      termsLink: (
        <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
          {
            i18nCreatePost.label.termsAndCondition
          }
        </Link>
      ),
    },
  );

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    markFormAsModified();
    setData((s: any) => ({
      ...s,
      [target.name]: target.value,
    }));

    if (target.name === 'type') {
      setPreviousType(target.value);
    }
  };

  const handleFileAdded = (key: string, res: File[]) => {
    markFormAsModified();
    res.forEach((file: File) => {
      if (file.type.startsWith('video')) {
        const video = document.createElement('video');
        // eslint-disable-next-line func-names
        video.onloadedmetadata = function () {
          const minutes = video.duration / 60;
          window.URL.revokeObjectURL(video.src);

          if (minutes > 1) {
            toast.error('Video duration exceeded 1 minute');
            setData((s: any) => ({
              ...s,
              [key]: res[0],
              [`${key}_preview`]: null,
              [`${key}_type`]: null,
            }));
          }
        };

        video.src = URL.createObjectURL(file);
      }
    });

    if (isSmallScreen) {
      setShowEnableLocation(true);
    }

    setErrors((s: any) => ({ ...s, media: undefined }));
    setData((s: any) => ({
      ...s,
      [key]: res[0],
      [`${key}_preview`]: URL.createObjectURL(res[0]),
      [`${key}_type`]: res[0].type,
    }));
  };

  const handlePostableChange = (p: any) => {
    if (!p) {
      setPostable(undefined);
      return;
    }
    markFormAsModified();

    const postableTags = p?.tags?.map?.((t: string) => ({ label: t, value: t, disabled: true }))
     || [];
    setTags(postableTags);

    const postableMentions = p?.coCreators?.map?.((c: any) => ({
      label: c?.creator?.name,
      value: c?.creator?.id,
      type: c?.type,
      is_follower: false,
      disabled: true,
    })) || [];
    setMentions(postableMentions);

    const loc = p.type !== 'location' && p.type !== 'custom_location' ? p.location : p;

    if (loc) {
      setData((s: any) => ({
        ...s,
        location: {
          id: loc.id,
          name: loc.name,
          address: loc.address,
          latitude: +loc.latitude,
          longitude: +loc.longitude,
          country_code: loc.country_code,
          verified: false,
        },
      }));
    }

    setPostable({
      ...p,
      tags: postableTags,
      maxTags: postableTags.length + 5,
      mentions: postableMentions,
      maxMentions: postableMentions.length + 5,
    });
  };

  const removeMedia = () => {
    const currentTz = moment.tz.guess() || 'Etc/GMT';

    setData((prev: any) => ({
      ...prev,
      media: null,
      media_preview: null,
      location: null,
      posted_at: null,
      timezone: {
        label: `(GMT${moment.tz(currentTz).format('Z')}) ${currentTz}`,
        value: currentTz,
      },
    }));

    setPostable(null);
    setMetadata(null);
  };

  const handleCreatorChange = (creator: any) => {
    setData((s: any) => ({
      ...s,
      ownerable_id: creator.id,
      ownerable_type: creator.type,
    }));
  };

  const getMetadata = async (link: string) => {
    if (!link) return;
    try {
      const { data: meta } = await dispatch(getMetatagsRequest({ url: link })).$promise;
      setMetadata(meta);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return;
      }
      handleError(err);
    }
  };

  const setDateTimeInForm = (dateObj: Date, timezoneData: string = moment.tz.guess()) => {
    if (isValidDate(dateObj)) {
      setDate(dateObj);
      setTime(new Date(dateObj));

      setData(s => ({
        ...s,
        timezone: {
          label: `(GMT${moment.tz(timezoneData).format('Z')}) ${timezoneData}`,
          value: timezoneData,
        },
      }));
      dateInput.current?.setTimePeriod('AD');
    }
  };

  const setLocationInForm = (locationData: any) => {
    if (!locationData) return null;

    const c = new mapkit.Coordinate(locationData.latitude, locationData.longitude);
    const geocoder = new mapkit.Geocoder();

    return new Promise<string | undefined>((resolve) => {
      geocoder.reverseLookup(c, (err, mapLocation) => {
        if (err) {
          return;
        }

        const { results } = mapLocation;
        const loc = results[0];

        if (!loc) {
          return;
        }

        const l = {
          type: 'location',
          name: loc.name || loc.formattedAddress,
          address: loc.formattedAddress,
          latitude: loc.coordinate.latitude,
          longitude: loc.coordinate.longitude,
          country_code: loc.countryCode,
        };

        const locationTimezone = tzLookup(l.latitude, l.longitude);

        if (locationTimezone && data.timezone?.value !== locationTimezone) {
          setData((s: any) => ({
            ...s,
            timezone: {
              label: `(GMT${moment.tz(locationTimezone).format('Z')}) ${locationTimezone}`,
              value: locationTimezone,
            },
          }));
        }

        // If a postable already exists, merge in the new location data
        if (postable) {
          setPostable({ ...postable, location: l });
        } else {
          setPostable(l);
        }

        setData((s: any) => ({ ...s, location: l }));
        setRefLocation(l);

        resolve(locationTimezone);
      });
    });
  };

  const extractImageMetadata = async (file: File) => {
    const metadataFromFile = await exifr.parse(file, {
      gps: true,
      exif: true,
      tiff: true,
      xmp: true,
      iptc: true,
    });
    let locationTimezone;

    if (metadataFromFile?.latitude && metadataFromFile?.longitude) {
      locationTimezone = await setLocationInForm({
        latitude: metadataFromFile.latitude,
        longitude: metadataFromFile.longitude,
        determineTimezone: true,
      });
    }

    // Process date information
    if (metadataFromFile?.DateTimeOriginal
      || metadataFromFile?.CreateDate || metadataFromFile?.ModifyDate) {
      const dateValue = metadataFromFile.DateTimeOriginal
        || metadataFromFile.CreateDate || metadataFromFile.ModifyDate;

      let localTimezone = moment.tz.guess();

      if (metadataFromFile.OffsetTimeOriginal) {
        const offset = metadataFromFile.OffsetTimeOriginal;
        const matchingZones = moment.tz.names().filter(
          tz => moment.tz(dateValue, tz).format('Z') === offset,
        );

        if (matchingZones.length > 0) {
          const userTz = moment.tz.guess();
          localTimezone = matchingZones.includes(userTz) ? userTz : matchingZones[0];
        }
      }

      const metaDate = moment(dateValue);
      const d = new Date();
      d.setFullYear(metaDate.year());
      d.setDate(metaDate.date());
      d.setMonth(metaDate.month());
      d.setHours(metaDate.hours());
      d.setMinutes(metaDate.minutes());
      d.setSeconds(metaDate.seconds());

      setDateTimeInForm(d, locationTimezone || localTimezone);
    }

    captureEvent({
      message: 'Image metadata extracted',
      level: 'info',
      extra: metadataFromFile,
    });
  };

  const parseDateFromMetadata = (dateValue: string) => {
    let metaDate = dateValue;
    let zoneOffset = '';

    if (dateValue.includes('UTC')) {
      metaDate = dateValue.replace('UTC ', '+00:00');
      zoneOffset = '+00:00';
    } else if (dateValue.includes('+') || dateValue.includes('-')) {
      const matches = dateValue.match(/([+-])(\d{2}):?(\d{2})$/);
      if (matches) {
        zoneOffset = `${matches[1]}${matches[2]}:${matches[3]}`;
      }
    }

    const localTz = moment.tz.guess();
    let zone = localTz;

    if (zoneOffset) {
      const matchingZones = moment.tz.names().filter(
        tz => moment.tz(metaDate, tz).format('Z') === zoneOffset,
      );

      if (matchingZones.length > 0) {
        zone = matchingZones.includes(localTz) ? localTz : matchingZones[0];
      } else {
        zone = zoneOffset === '+00:00' ? 'UTC' : localTz;
      }
    }

    return { metaDate, zone };
  };

  const extractVideoMetadata = async (file: File) => {
    if (!file) return;

    setIsProcessingMetadata(true);
    const startTime = Date.now();
    const MIN_PROCESSING_TIME = 2000;

    let result: any;
    try {
      result = await analyzeFile(file);
      let locationTimezone;

      const tracks = result.media?.track || [];
      const generalTrack = tracks.find((track: any) => track['@type'] === 'General');

      const dateValue = (generalTrack.Recorded_Date as string)
              || (generalTrack?.Encoded_Date as string)
              || (generalTrack?.Tagged_Date as string)
              || (generalTrack?.File_Modified_Date as string)
              || new Date(file.lastModified).toISOString();

      // First, check if the ISO6709 location string is available in the metadata
      if (generalTrack?.extra?.com_apple_quicktime_location_ISO6709) {
        // Retrieve the ISO6709 location string from the metadata
        const isoLocation = generalTrack.extra.com_apple_quicktime_location_ISO6709;

        // The ISO6709 string is typically in the format: +latitude+longitude+altitude/
        // Use a regular expression to extract the latitude and longitude values
        const matches = isoLocation.match(/^([+-]\d+\.?\d*)([+-]\d+\.?\d*)/);

        if (matches) {
          // Parse the extracted latitude and longitude strings into floating point numbers
          const latitude = parseFloat(matches[1]);
          const longitude = parseFloat(matches[2]);

          // Pass the extracted coordinates to setLocationInForm and enable timezone detection
          locationTimezone = await setLocationInForm({
            latitude,
            longitude,
            determineTimezone: true,
          });
        }
      } else if (generalTrack?.Geolatitude && generalTrack?.Geolongitude) {
        // Fall back to using the Geolatitude and Geolongitude fields provided in the metadata
        // Parse the string values into floating point numbers and call setLocationInForm
        locationTimezone = await setLocationInForm({
          latitude: parseFloat(generalTrack.Geolatitude as string),
          longitude: parseFloat(generalTrack.Geolongitude as string),
          determineTimezone: true,
        });
      } else if (generalTrack?.Recorded_Location) {
        const matches = generalTrack?.Recorded_Location.match(/^([+-]\d+\.?\d*)([+-]\d+\.?\d*)/);

        if (matches) {
          // Parse the extracted latitude and longitude strings into floating point numbers
          const latitude = parseFloat(matches[1]);
          const longitude = parseFloat(matches[2]);

          // Pass the extracted coordinates to setLocationInForm and enable timezone detection
          locationTimezone = await setLocationInForm({
            latitude,
            longitude,
            determineTimezone: true,
          });
        }
      }

      if (dateValue) {
        const { metaDate, zone } = parseDateFromMetadata(dateValue);

        const tzd = moment.tz(metaDate, zone);

        if (locationTimezone) {
          tzd.tz(locationTimezone);
        }

        const d = new Date();
        d.setFullYear(tzd.year());
        d.setDate(tzd.date());
        d.setMonth(tzd.month());
        d.setHours(tzd.hours());
        d.setMinutes(tzd.minutes());
        d.setSeconds(tzd.seconds());

        setDateTimeInForm(d, locationTimezone || zone);
      }

      captureEvent({
        message: 'Video metadata extracted',
        level: 'info',
        extra: result,
      });
    } catch (err) {
      // Fallback to using file.lastModified
      const d = new Date(file.lastModified);
      const localTz = moment.tz.guess();
      setDateTimeInForm(d, localTz);
      captureException(err, scope => {
        scope.setExtra('metadata', result);
        return scope;
      });
    } finally {
      const processingTime = Date.now() - startTime;
      const remainingDelay = Math.max(0, MIN_PROCESSING_TIME - processingTime);
      if (remainingDelay > 0) {
        setTimeout(() => {
          setIsProcessingMetadata(false);
        }, remainingDelay);
      } else {
        setIsProcessingMetadata(false);
      }
    }
  };

  const getMediaMetadata = async (file: File) => {
    if (!file) return;

    setIsProcessingMetadata(true);

    const startTime = Date.now();

    const MIN_PROCESSING_TIME = 2000;

    try {
    // Check if the file is an image
      const isImage = file.type.startsWith('image/');

      if (isImage) {
        await extractImageMetadata(file);
      } else {
        await extractVideoMetadata(file);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      const d = new Date(file.lastModified);
      const localTz = moment.tz.guess();
      setDateTimeInForm(d, localTz);
    } finally {
      const processingTime = Date.now() - startTime;
      const remainingDelay = Math.max(0, MIN_PROCESSING_TIME - processingTime);
      if (remainingDelay > 0) {
        // eslint-disable-next-line no-promise-executor-return
        await new Promise(resolve => setTimeout(resolve, remainingDelay));
      }
      setIsProcessingMetadata(false);
    }
  };

  const setHtmlDescription = (value: string, skipMetadata = false) => {
    markFormAsModified();
    const urlRegex = /((?<!("))https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|](?!(")))/ig;
    const urlRegexToLink = /((?<!("|>))https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|](?!("|>)))/ig;
    if (!metadata) {
      if (!skipMetadata) {
        getMetadata(value.match(urlRegex)?.[0] as string);
      }
    }
    const newValue = value.replace(urlRegexToLink, (url) => `<a href="${url}">${url}</a>`).slice(0, 1000);
    description.current = newValue;
    setHtml(newValue);
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const value = e.clipboardData.getData('Text');
    if (value) {
      if (!metadata) {
        const urlRegex = /((?<!("))https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|](?!(")))/ig;
        getMetadata(value.match(urlRegex)?.[0] as string);
      }
      const urlRegexToLink = /((?<!("|>))https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|](?!("|>)))/ig;
      const newValue = `${description.current}${value}`.replace(urlRegexToLink, (url) => `<a href="${url}">${url}</a>`).slice(0, 1000);
      description.current = newValue;
      setHtml(newValue);
    }
  };

  const onBeforeInput = (e: CompositionEvent<HTMLDivElement>) => {
    if (description.current.length === 1000) {
      e.preventDefault();
    }
  };

  const handleEmbedLink = (value: any) => {
    setMetadata(value);
  };

  const loadMentions = (inputValue: string, callback: (options: object[]) => void) => {
    dispatch(getUsersAndOrganizationsRequest({ keyword: inputValue }))
      .$promise.then((res: AxiosResponse) => {
        callback(res.data.map((d: any) => ({
          label: d.name || d.display_name,
          key: d.id,
          value: d.id,
          is_follower: d.is_follower,
          type: d.name ? 'Organization' : 'Client',
        })));
      });
  };

  const handleSetMentions = (m: any) => {
    const nonFollowerCount = m.filter((me: any) => !me.is_follower).length;
    if (nonFollowerCount > 10) return;
    markFormAsModified();
    setMentions(m);
  };

  const submitFormRequestSubmit = async (formData: FormData) => {
    const axiosConfig: AxiosRequestConfig = {
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (event.event.lengthComputable && event.progress) {
          const progressEvent = Math.round(event.progress * 100);

          setProgress(progressEvent);
        }
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const request = postRequest('posts', formData, axiosConfig);
    return new Promise((resolve, reject) => {
      setLoading(true);
      request.$promise
        .then((response: any) => {
          setLoading(false);
          resolve(response);
        })
        .catch((error: any) => {
          setLoading(false);
          const errorData = error?.response?.data;

          if (errorData?.statusCode === 422) {
            const err = errorData?.errors;
            setErrors(err);

            if (err.media || err.title || err.description || err.timezone || err.posted_at) {
              setStep(0);
            }
          }
          reject(error);
        });
    });
  };

  const handleSubmit = async () => {
    setErrors({});
    try {
      setLoading(true);
      const embeddedMedia = metadata ? {
        media_url: metadata['og:type']?.startsWith('video')
          ? metadata['og:video:url'] || metadata.url
          : metadata['og:image'],
        media_type: metadata['og:type'],
        preview_url: metadata['og:image'],
      } : null;
      const formData = getFormData({
        ...data,
        is_adult: isAdultContent,
        description: description.current,
        postable_id: postable.id,
        postable_type: startCase(postable.type),
        postable_data: postable.type === 'location' ? {
          name: postable.name,
          address: postable.address,
          latitude: postable.latitude,
          longitude: postable.longitude,
          country_code: postable.country_code,
        } : undefined,
        tags: tags.map((t: any) => t.value),
        mentions: mentions.map((t: any) => ({
          id: t.value,
          type: t.type,
        })),
        embedded_media: embeddedMedia,
        timezone: data.timezone.value,
      });

      const res: any = await submitFormRequestSubmit(formData);

      if (res?.status === 201) {
        toast.success(i18n.success.createPost);
        setFormModified(false);
        setLoading(false);
        setTimeout(() => {
          navigate(res ? `/posts/${res?.data?.id}` : '/');
        }, 300);
      }
    } catch (err: any) {
      const { response } = err;
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs);
        handleError(err);
        return;
      }

      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data.media) return;
    getMediaMetadata(data.media);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data.media ]);

  useEffect(() => {
    setData((s: any) => ({
      ...s,
      posted_at: date && time && data.timezone?.value
        ? serverDateTimeFormat(date, time, data.timezone.value) : null,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ date, time, data.timezone?.value ]);

  useEffect(() => {
    if (profile?.birth_date && data.posted_at) {
      if (moment(profile.birth_date).isAfter(moment(data.posted_at))) {
        setIsTypeDisabled(true);
        setData((s: any) => ({
          ...s,
          type: 'historical',
        }));
      } else {
        setIsTypeDisabled(false);
        setData((s: any) => ({
          ...s,
          type: previousType,
        }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ profile?.birth_date, data.posted_at ]);

  const setPostableDataFromRequest = (postableData: any, type: string) => {
    let postableTags = [];

    if (postableData?.tags) {
      postableTags = postableData?.tags
        ?.map?.((t: any) => ({ label: t, value: t, disabled: true })) || [];

      setTags(postableTags);
    }

    const postableLocation = {
      ...postableData?.location,
      latitude: parseFloat(postableData?.location?.latitude || '0'),
      longitude: parseFloat(postableData?.location?.longitude || '0'),
    };

    // Set time and timezone to the postable timezones
    if (postableData.timezone && data.timezone?.value !== postableData.timezone) {
      setData((s: any) => ({
        ...s,
        timezone: {
          label: `(GMT${moment.tz(postableData.timezone).format('Z')}) ${postableData.timezone}`,
          value: postableData.timezone,
        },
      }));
      const tzDate = moment.tz(new Date(), postableData.timezone);
      const d = new Date();
      d.setFullYear(tzDate.year());
      d.setFullYear(tzDate.year());
      d.setMonth(tzDate.month());
      d.setDate(tzDate.date());
      d.setHours(tzDate.hours());
      d.setMinutes(tzDate.minutes());
      d.setSeconds(tzDate.seconds());

      setDate(d);
      setTime(new Date(d));
    }

    setData((s: any) => ({
      ...s,
      location: postableLocation,
    }));

    setPostable({
      ...postableData,
      location: postableLocation,
      type,
      tags: postableTags,
    });
  };

  const loadTimeline = async (id: string) => {
    const result = await dispatch(getTimelineRequest(id, {})).$promise;

    const postableData = result?.data?.timeline;

    postableData.tags = postableData.tags.map((t: any) => t.name);

    setPostableDataFromRequest(postableData, 'timeline');
  };

  const loadOrganization = async (id: string) => {
    const result = await dispatch(getOrganizationRequest(id || '')).$promise;

    const postableData = result?.data;

    setPostableDataFromRequest(postableData, 'organization');
  };

  const loadEvent = async (id: string) => {
    const result = await dispatch(getEventRequest(id)).$promise;

    const postableData = result?.data;

    setPostableDataFromRequest(postableData, 'event');
  };

  const loadLocation = async (id: string) => {
    const result = await dispatch(getLocationRequest(id)).$promise;

    const postableData = result?.data;

    postableData.location = postableData;

    setPostableDataFromRequest(postableData, 'location');
  };

  const setDefaultLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const c = new mapkit.Coordinate(pos.coords.latitude, pos.coords.longitude);
      setRefLocation(pos.coords);

      const geocoder = new mapkit.Geocoder();
      geocoder.reverseLookup(c, (err, location: mapkit.GeocoderResponse) => {
        if (!err) {
          const { results } = location;
          const loc = results[0];

          if (!loc) return;

          const l = {
            type: 'location',
            name: loc.name || loc?.formattedAddress,
            address: loc.formattedAddress,
            latitude: loc?.coordinate?.latitude,
            longitude: loc?.coordinate?.longitude,
            country_code: loc.countryCode,
            verified: true,
          };

          setData((s: any) => ({ ...s, location: l }));
          if (!isSmallScreen) return;
          setShowEnableLocation(false);
        }
      });
    });
  };

  const loadPostable = async () => {
    const postableId = searchParams.get('postable_id');
    const postableType = searchParams.get('postable_type');

    if (postableId && postableType) {
      if (postableType === 'Timeline') {
        await loadTimeline(postableId);
      }

      if (postableType === 'Organization') {
        await loadOrganization(postableId);
      }

      if (postableType === 'Event') {
        await loadEvent(postableId);
      }

      if (postableType === 'Location') {
        await loadLocation(postableId);
      }
    }
  };

  const validatePostContent = () => {
    const isDescriptionEmpty = !description.current || [ '', '<br>', '<br/>', '<br><br>', '<p></p>' ].includes(description.current.trim());
    if (isDescriptionEmpty && !metadata && !data.media_preview) {
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    const isValid = validatePostContent();
    if (!isValid) {
      setErrors({ postContent: i18n.label.postWithoutContent });
    } else {
      setErrors({});
      window.location.hash = 'step-2';
      setStep(1); // Proceed if validation passes
    }
  };

  const hideAdultTooltip = async () => {
    try {
      await dispatch(dontShowAdultTooltipDispatch(false));
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeclineModal = async () => {
    await hideAdultTooltip();
    toggleDeclineModal();
  };

  useEffect(() => {
    setErrors({}); // Clear errors on any changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ description.current, metadata, data.media_preview ]);

  useEffect(() => {
    // Update postable
    const onMount = async () => {
      await loadPostable();
      setDefaultLocation();
    };

    document.getElementById('content-description')
      ?.setAttribute('contenteditable', 'plaintext-only');

    onMount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step === 1 && isSmallScreen) {
      window.scrollTo(0, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ step ]);

  useEffect(() => {
    const st = hash.split('?');
    const h = st[0].split('-');
    const s = h[1];
    setStep(+s - 1);
  }, [ hash ]);

  return (
    <Container className="main-container create-post-page">
      {loading && (
        <div className="progress-loader-wrapper">
          <div className="postpage-progress-loader">
            <CircularProgressbar className={progress < 100 ? '' : 'loading-100'} value={progress} maxValue={100} text={progress < 100 ? `${progress}%` : `${i18n.label.transcoding}...`} />
            <div className="b1 mt-2 text-center">Uploading...</div>
          </div>
        </div>
      )}
      <Container>
        <Row className="justify-content-center">
          <Col md={11}>
            <h2 className="text-center">{i18n.title}</h2>

            <StepProgress
              steps={2}
              currentStep={step}
              onChange={(s: any) => {
                navigate(s - step);
              }}
            />

            <TabContent activeTab={step}>
              <TabPane tabId={0}>
                <div className="post-form-group p-2 mb-4">
                  <AccountSwitcher onChange={handleCreatorChange} />

                  <Input
                    ref={titleInputRef}
                    name="title"
                    label={data.title ? i18n.label.title : i18n.label.enterPostTitle}
                    placeholder={data.title ? i18n.label.title : i18n.label.enterPostTitle}
                    required
                    formGroupProps={{ noMargin: true, className: 'mb-1' }}
                    rightIcon={(
                      <FormText>
                        <small className="text-muted text-placeholder" style={{ fontSize: '12px' }}>
                          {`${data.title.length}/100`}
                        </small>
                      </FormText>
                    )}
                    onChange={handleInputChange}
                    maxLength={100}
                    errors={errors.title}
                  />
                  <FormGroup floating className="editor">
                    <ContentEditable
                      id="content-description"
                      html={description.current}
                      onChange={e => setHtmlDescription(e.target.value)}
                      className="form-control"
                      onPaste={onPaste}
                      onBeforeInput={onBeforeInput}
                    />
                    <Label>
                      {validatePostContent()
                        ? i18n.label.description : i18n.label.describeWhatYourPostIsAbout}
                    </Label>
                    <FormText>
                      <small className="text-muted text-placeholder" style={{ fontSize: '12px' }}>
                        {`${numeral(html.length).format('0,0')}/1,000`}
                      </small>
                    </FormText>
                  </FormGroup>

                  <LinkPreview
                    metadata={metadata}
                    onRemove={() => setMetadata(null)}
                  />

                  {data.media_preview && (
                    <div className="media-container w-100 p-3 position-relative">
                      {data.media_type.startsWith('video') ? (
                        <video
                          ref={videoRef}
                          controls
                          src={data.media_preview}
                          className="media"
                          preload="metadata"
                          onLoadedMetadata={() => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = 0.001;
                            }
                          }}
                        />
                      ) : (
                        <img src={data.media_preview} className="media" alt="Media" />
                      )}
                      <Button
                        color="danger"
                        className="btn-delete"
                        onClick={removeMedia}
                      >
                        <CloseIcon width="16" fill="var(--bs-body-color)" />
                      </Button>
                    </div>
                  )}

                  {errors.media && (
                    <div className="px-3 pb-2 text-danger">
                      {errors.media}
                    </div>
                  )}
                  {errors.postContent && (
                    <div className="px-3 pb-2 text-danger">
                      {errors.postContent}
                    </div>
                  )}

                  {(!metadata && !data.media_preview) && (
                    <div className="d-flex gap-2 media-buttons">
                      <Button
                        color="link"
                        className="btn-upload d-flex align-items-center p-2"
                        onClick={() => uploader.current?.open()}
                      >
                        <>
                          <UploadIcon className="me-2" />
                          {i18n.button.upload}
                        </>
                      </Button>
                      <Button
                        color="link"
                        className="btn-upload btn-capture d-flex align-items-center p-2"
                        onClick={() => setShowWebcam(true)}
                      >
                        <>
                          <CameraIcon className="me-2" width="19" height="19" />
                          {i18n.button.capture}
                        </>
                      </Button>
                      <Button
                        color="link"
                        className="btn-upload d-flex align-items-center p-2"
                        onClick={() => setShowEmbedLink(true)}
                      >
                        <>
                          <LinkSquareIcon className="me-2" width="19" height="19" />
                          {i18n.button.embedLink}
                        </>
                      </Button>
                    </div>
                  )}

                  <FileUploader
                    ref={uploader}
                    onDrop={(ac) => handleFileAdded('media', ac)}
                    onTypeError={(error: string) => {
                      setErrors({
                        ...errors,
                        media: [ error ],
                      });
                    }}
                    accept={{
                      'video/quicktime': [ '.mov' ],
                      'video/mp4': [ '.mp4' ],
                      'video/webm': [ '.weba' ],
                      'video/ogg': [ '.oga' ],
                      'image/*': [ '.jpeg', '.jpg', '.png', '.heic' ],
                    }}
                    acceptedTypes={{
                      'video/quicktime': [ '.mov' ],
                      'video/mp4': [ '.mp4' ],
                      'video/webm': [ '.weba' ],
                      'video/ogg': [ '.oga' ],
                      'image/heic': [ '.heic' ],
                      'image/png': [ '.png' ],
                      'image/jpeg': [ '.jpg', '.jpeg' ],
                    }}
                    maxSize={2e8}
                  />

                </div>

                {/* Tooltip and 18+ Checkbox */}
                {showAdultTooltip && (
                  <Alert
                    color="highlight"
                    role="alert"
                    className="position-relative"
                  >
                    <div className="d-flex gap-2 mb-1">
                      <InfoIcon fill="var(--bs-primary)" height={20} width={20} className="flex-shrink-0" />
                      <div className="b5 text-dark lh-sm">{suitableFor18PlusAlert}</div>
                      <div
                        className="dropdown-button ms-auto position-relative"
                        onClick={toggleDeclineModal}
                        style={{ cursor: 'pointer' }}
                        title={i18n.label.dontShowAgain}
                      >
                        <CloseIcon width="16" height="16" fill="var(--bs-primary)" />
                      </div>
                    </div>
                  </Alert>
                )}
                <FormGroup className="mt-0">
                  <Label check>
                    <Checkbox
                      checked={isAdultContent}
                      onChange={handleAdultContentChange}
                    />
                    {i18n.label.suitableFor18Plus}
                  </Label>
                </FormGroup>

                <Row>
                  <FormGroup noMargin className="col-md-12 mt-3">
                    <Label>
                      {i18n.label.postType}
                      <span className="text-danger">*</span>
                    </Label>

                    <Row className="gx-3">
                      <Col xs={6}>
                        <input
                          id="active-type"
                          type="radio"
                          name="type"
                          value="active"
                          checked={data.type === 'active'}
                          onChange={handleInputChange}
                          className="btn-check"
                          disabled={isTypeDisabled}
                        />
                        <Label
                          htmlFor="active-type"
                          className={classNames(
                            'btn form-check-label w-100 text-start historical-label',
                            {
                              'btn-primary': data.type === 'active',
                              'btn-secondary fw-normal text-body': data.type !== 'active',
                            })}
                        >
                          {i18n.label.active}
                        </Label>
                      </Col>
                      <Col xs={6}>
                        <input
                          id="historical-type"
                          type="radio"
                          name="type"
                          value="historical"
                          checked={data.type === 'historical'}
                          onChange={handleInputChange}
                          className="btn-check"
                          disabled={isTypeDisabled}
                        />
                        <Label
                          htmlFor="historical-type"
                          className={classNames(
                            'btn form-check-label w-100 text-start historical-label',
                            {
                              'btn-primary': data.type === 'historical',
                              'btn-secondary fw-normal text-body': data.type !== 'historical',
                            })}
                        >
                          {i18n.label.historical}
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                </Row>

                <Button
                  color="primary"
                  block
                  disabled={!data.title || !data.type || isProcessingMetadata}
                  className={`mt-5 submit-and-next-button-mobile ${isProcessingMetadata ? 'processing' : ''}`}
                  onClick={handleNextStep}
                >
                  {isProcessingMetadata ? (
                    <>
                      {i18n.button.processingMetadata}
                      <Spinner size="sm" className="ms-2" />
                    </>
                  ) : (
                    i18n.button.next
                  )}
                </Button>
              </TabPane>

              {/* Step 2 */}
              <TabPane tabId={1}>
                <Alert color="highlight" className="d-inline-block mt-2 position-relative">
                  <div className="d-flex align-items-center caption1">
                    <InfoIcon
                      fill="var(--bs-primary)"
                      className="me-2"
                    />
                    {i18n.label.postDescription}
                  </div>
                </Alert>
                <div className="b3 mt-4 mb-1">
                  {i18n.label.capturedDescription}
                </div>
                <Row>
                  <FormGroup noMargin className="col-md-12">
                    <ADBCDateInput
                      ref={dateInput}
                      onChange={(e: any) => setDate(e.date)}
                      label={i18n.label.date}
                      required
                      maxDate={new Date()}
                      selected={date}
                      errors={errors.posted_at}
                    />
                  </FormGroup>
                  <FormGroup noMargin className="col-md-12">
                    <DatePickerInput
                      label={i18n.label.time}
                      type="time"
                      selected={time}
                      onChange={setTime}
                      clearIcon={null}
                      errors={errors.posted_at}
                    />
                  </FormGroup>
                  <FormGroup noMargin className="col-md-12">
                    <TimezonePicker
                      onChange={(v: any) => {
                        handleInputChange({ target: { name: 'timezone', value: v } } as any);
                      }}
                      value={data.timezone}
                    />
                  </FormGroup>
                </Row>

                <Label className="b3 mt-4">
                  {i18n.label.postableDescription}
                </Label>

                <PostableDropdown
                  onSelect={handlePostableChange}
                  value={postable}
                  location={data.location || refLocation}
                />

                {postable && (
                  <div key={postable.id} className="mt-5">
                    <LocationPicker
                      code={(data.location || postable.location || postable).country_code}
                      latitude={(data.location || postable.location || postable).latitude || 0}
                      longitude={(data.location || postable.location || postable).longitude || 0}
                      handleInputChange={handleInputChange}
                      defaultVerified={!!(data.location as any)?.verified}
                    />

                    <Select
                      async
                      label={i18n.label.mentions}
                      placeholder={i18n.placeholder.mentions}
                      onChange={(v: any) => handleSetMentions(v)}
                      isClearable={false}
                      isMulti
                      cacheOptions
                      defaultOptions
                      loadOptions={loadMentions}
                      defaultValue={postable.mentions}
                      backspaceRemovesValue={false}
                      value={mentions}
                    />

                    <Alert color="highlight" className="d-inline-block mt-2">
                      <div className="d-flex align-items-center caption1">
                        <InfoIcon
                          fill="var(--bs-primary)"
                          className="me-2"
                        />
                        {i18n.label.tagsDescription}
                      </div>
                    </Alert>
                    <TagsInput
                      label={i18n.label.tags}
                      placeholder={i18n.placeholder.tags}
                      onChange={(v: any) => setTags(v)}
                      isClearable={false}
                      defaultValue={postable.tags}
                      maxLength={postable.maxTags}
                      backspaceRemovesValue={false}
                      components={{ IndicatorsContainer: () => null }}
                    />
                  </div>
                )}
                <Button
                  color="primary"
                  block
                  disabled={!postable
                    || !(data.location as any)?.name || loading || !date || !time}
                  className="mt-5 submit-and-next-button-mobile"
                  onClick={handleSubmit}
                >
                  {i18n.button.createPost}
                  {loading && <Spinner size="sm" className="ms-2" />}
                </Button>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>

      <EmbedLinkModal
        show={showEmbedLink}
        toggle={() => setShowEmbedLink(false)}
        onSave={handleEmbedLink}
      />

      <DeclineModal
        modal={declineModal}
        toggle={toggleDeclineModal}
        confirm={() => handleDeclineModal()}
      />

      <WebcamCapture
        show={showWebcam}
        toggle={() => setShowWebcam(false)}
        onSuccess={files => handleFileAdded('media', files)}
      />

      <NavigationWarningModal
        isOpen={showWarningModal}
        toggle={closeWarningModal}
        onContinue={handleContinueNavigation}
        message={i18n.label.processingMetadataWarning}
      />

      {isSmallScreen && (
        <EnableLocation
          show={showEnableLocation}
          toggle={() => setShowEnableLocation(false)}
          getCurrentLocation={setDefaultLocation}
        />
      )}
    </Container>
  );
}

export default CreatePostPage;
