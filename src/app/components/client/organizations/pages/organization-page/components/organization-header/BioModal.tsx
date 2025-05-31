/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Link } from 'react-router-dom';

import LocaleService from '@services/LocaleService';
import {
  CloseIcon,
  EmailIcon,
  TagIcon,
} from '@shared/icons';
import Facebook from '@shared/icons/Facebook';
import InstagramIcon from '@shared/icons/InstagramIcon';
import TiktokIcon from '@shared/icons/TiktokIcon';
import TwitterXIcon from '@shared/icons/TwitterXIcon';
import WebIcon from '@shared/icons/WebIcon';
import YoutubeIcon from '@shared/icons/YoutubeIcon';

interface Contact {
  email: string;
  website: string;
  is_email_hidden: boolean;
}

interface BioModalProps {
  onClose?: () => void;
  description?: string;
  tags?: string[];
  contact: Contact;
  url: any;
}

function BioModal({
  onClose,
  description,
  tags,
  contact,
  url,
}: BioModalProps) {
  const i18n = LocaleService.getTranslations('organizationPage');

  const getLink = (key: string, value: string) => {
    let element = null;
    switch (key) {
      case 'facebook':
        element = (
          <div className="link">
            <Facebook />
            <Link to={`https://www.facebook.com/${value}`} target="_blank">{`https://www.facebook.com/${value}`}</Link>
          </div>
        );
        break;
      case 'instagram':
        element = (
          <div className="link">
            <InstagramIcon />
            <Link to={`https://www.instagram.com/${value}`} target="_blank">{`https://www.instagram.com/${value}`}</Link>
          </div>
        );
        break;
      case 'tiktok':
        element = (
          <div className="link">
            <TiktokIcon />
            <Link to={`https://www.tiktok.com/${value}`} target="_blank">{`https://www.tiktok.com/${value}`}</Link>
          </div>
        );
        break;
      case 'x':
        element = (
          <div className="link">
            <TwitterXIcon />
            <Link to={`https://www.x.com/${value}`} target="_blank">{`https://www.x.com/${value}`}</Link>
          </div>
        );
        break;
      case 'youtube':
        element = (
          <div className="link">
            <YoutubeIcon />
            <Link to={`https://www.youtube.com/${value}`} target="_blank">{`https://www.youtube.com/${value}`}</Link>
          </div>
        );
        break;
      default:
        break;
    }

    return element;
  };

  return (
    <div className="bio-modal">
      <div className="header">
        <div className="s1">{i18n.label.bio}</div>
        <div className="close-btn" onClick={onClose}>
          <CloseIcon />
        </div>
      </div>
      <div className="body">
        <p className="b3 text-body">{description}</p>
      </div>
      <div className="links">
        {contact?.website && (
          <div className="link">
            <WebIcon />
            <Link to={contact?.website} target="_blank">{contact?.website}</Link>
          </div>
        )}
        {(!contact?.is_email_hidden && contact?.email) && (
          <div className="link">
            <EmailIcon />
            <Link to={`mailto:${contact?.email}`}>{contact?.email}</Link>
          </div>
        )}
        {url && (
          <React.Fragment>
            {Object.keys(url)?.map((key: string) => getLink(key, url[key]))}
          </React.Fragment>
        )}
      </div>
      <div className="tags">
        {tags?.map((tag) => (
          <div className="tag" key={tag}>
            <TagIcon />
            <span className="caption1">{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BioModal;
