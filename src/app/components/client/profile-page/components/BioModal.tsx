import React from 'react';

import LocaleService from '@services/LocaleService';
import { CloseIcon, TagIcon } from '@shared/icons';

interface Tag {
  id: string;
  name: string;
}
interface BioModalProps {
  onClose?: () => void;
  description: string | null;
  tags?: Tag[];
}

function BioModal({ onClose, description, tags }: BioModalProps) {
  const i18n = LocaleService.getTranslations('timelinePage');

  return (
    <div className="bio-modal">
      <div className="header">
        <div className="s1">{i18n.label.info}</div>
        <div className="close-btn" onClick={onClose}>
          <CloseIcon />
        </div>
      </div>
      <div className="body">
        <p className="bio">{description}</p>
      </div>
      <div className="tags">
        {tags?.map((tag) => (
          <div className="tag" key={tag?.id}>
            <TagIcon />
            <span className="caption1">{tag?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BioModal;
