import React from 'react';

import './CreateSuccess.scss';
import LocaleService from '@services/LocaleService';
import { CloseIcon } from '@shared/icons';

interface CreateSuccessProps {
  createdCategory: any;
  handleClose: () => void;
}

function CreateSuccess({ createdCategory, handleClose }: CreateSuccessProps) {
  const i18n = LocaleService.getTranslations('createCategory');

  return (
    <div className="category-create-success">
      <div className="modal-card">
        <div className="header">
          <div className="s1">{i18n.label.newCategoryCreated}</div>
          <div className="close" onClick={handleClose}>
            <CloseIcon />
          </div>
        </div>
        <div className="body">
          <span className="b1">{i18n.success.createdCategory} <span className="b2">{createdCategory?.name}</span>, {i18n.success.underParent} <span className="b2">{createdCategory?.parent?.name}</span>.</span>
        </div>
      </div>
    </div>
  );
}

export default CreateSuccess;
