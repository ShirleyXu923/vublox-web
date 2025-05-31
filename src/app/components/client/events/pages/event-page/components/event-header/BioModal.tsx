import React from 'react';
import { NavLink } from 'react-router-dom';

import LocaleService from '@services/LocaleService';
import {
  CloseIcon,
  TagIcon,
} from '@shared/icons';

interface BioModalProps {
  onClose?: () => void;
  description?: string;
  tags?: string[];
  coCreators?: any[];
}

function BioModal({
  onClose, description, tags, coCreators,
}: BioModalProps) {
  const i18n = LocaleService.getTranslations('eventPage');
  return (
    <div className="bio-modal">
      <div className="header">
        <div className="s1">{i18n.label.info}</div>
        <div className="close-btn" onClick={onClose}>
          <CloseIcon />
        </div>
      </div>
      <div className="body">
        <p className="b3 text-body">{description}</p>
      </div>
      <div className="caption3 text-uppercase">{i18n.label.coCreators}</div>
      <div className="tags">
        {coCreators?.length === 0 && (
          <div className="caption1">-</div>
        )}
        {coCreators?.map?.((coCreator) => (
          <div className="tag" key={coCreator?.creator?.id}>
            <NavLink to={coCreator?.creator?.link} className="text-body">
              <span className="caption1">{coCreator?.creator?.name}</span>
            </NavLink>
          </div>
        ))}
      </div>
      <div className="caption3 text-uppercase">{i18n.label.tags}</div>
      <div className="tags">
        {tags?.length === 0 && (
          <div className="caption1">-</div>
        )}
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
