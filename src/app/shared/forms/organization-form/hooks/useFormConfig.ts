import { FieldType } from '@shared/forms/types';
import useTranslation from '@shared/hooks/useTranslation';

interface FormField {
  name: FieldType;
  started_at: FieldType;
  ended_at: FieldType;
  contact: {
    website: FieldType;
    email: FieldType;
  };
  url: {
    facebook: FieldType;
    instagram: FieldType;
    tiktok: FieldType;
    x: FieldType;
    youtube: FieldType;
  };
  category_id: FieldType;
  privacy_option: FieldType;
  tags: FieldType;
}

function useFormConfig() {
  const i18n = useTranslation('createOrganization');

  return {
    name: {
      id: 'name',
      label: i18n.label.organizationName,
      max: 50,
      required: true,
      feedback: i18n.label.whenOrganizationUsed,
    },
    started_at: {
      id: 'started_at',
      label: i18n.label.startDate,
      required: true,
    },
    ended_at: {
      id: 'ended_at',
      label: i18n.label.endDate,
      required: false,
    },
    contact: {
      website: {
        id: 'contact.website',
        label: i18n.label.website,
        max: 50,
      },
      email: {
        id: 'contact.email',
        label: i18n.label.email,
        max: 200,
      },
      is_email_hidden: {
        id: 'contact.is_email_hidden',
        label: i18n.label.privateEmail,
      },
    },
    url: {
      facebook: {
        id: 'url.facebook',
        label: i18n.label.facebook,
        max: 100,
        prefix: 'https://www.facebook.com/',
      },
      instagram: {
        id: 'url.instagram',
        label: i18n.label.instagram,
        max: 100,
        prefix: 'https://www.instagram.com/',
      },
      tiktok: {
        id: 'url.tiktok',
        label: i18n.label.tiktok,
        max: 100,
        prefix: 'https://www.tiktok.com/',
      },
      x: {
        id: 'url.x',
        label: i18n.label.x,
        max: 100,
        prefix: 'https://www.x.com/',
      },
      youtube: {
        id: 'url.youtube',
        label: i18n.label.youtube,
        max: 100,
        prefix: 'https://www.youtube.com/',
      },
    },
    category_id: {
      id: 'category_id',
      required: true,
    },
    privacy_option: {
      id: 'privacy_option',
      label: i18n.label.privacy,
      required: true,
      options: [
        { label: i18n.label.public, value: 'public' },
        { label: i18n.label.private, value: 'private' },
        { label: i18n.label.inviteOnly, value: 'invite_only' },
      ],
      default: { label: i18n.label.public, value: 'public' },
    },
    tags: {
      id: 'tags',
      label: i18n.label.tags,
      required: false,
      max: 5,
    },
  } as FormField;
}

export default useFormConfig;
