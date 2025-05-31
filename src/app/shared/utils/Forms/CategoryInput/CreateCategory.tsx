import React, { useState } from 'react';
import { Button } from 'reactstrap';

import './CreateCategory.scss';

import LocaleService from '@services/LocaleService';
import { CloseIcon } from '@shared/icons';

import Input from '../Input/Input';
import Select from '../Select/Select';

interface CreateCategoryProps {
  parentCategories: any[];
  handleClose: () => void;
  handleSubmit: (form: any) => void;
  errors: any;
}

function CreateCategory({
  parentCategories,
  handleClose,
  handleSubmit,
  errors,
}: CreateCategoryProps) {
  const i18n = LocaleService.getTranslations('createCategory');
  const [ form, setForm ] = useState({
    parent_id: '',
    new_category: '',
  });

  return (
    <div id="create-category" style={{ display: 'none' }} className="create-category">
      <div className="create-category-form">
        <div className="header">
          <div className="s1">{i18n.label.addCategory}</div>
          <div className="close" onClick={handleClose}>
            <CloseIcon />
          </div>
        </div>
        <div className="body">
          <Select
            errors={errors?.parent_id}
            required
            onChange={(e: any) => {
              setForm({
                ...form,
                parent_id: e.value,
              });
            }}
            label={i18n.label.parentCategory}
            placeholder={i18n.label.parentCategory}
            options={parentCategories}
          />

          <div className="caption1 message">{i18n.label.message}</div>

          <Input
            errors={errors?.new_category}
            label={i18n.label.newCategory}
            required
            placeholder={i18n.label.newCategory}
            onChange={(e: any) => {
              setForm({
                ...form,
                new_category: e.target.value,
              });
            }}
            value={form?.new_category}
          />
        </div>
        <div className="footer">
          <Button
            color="primary"
            onClick={() => handleSubmit(form)}
            disabled={form?.new_category === '' || form?.parent_id === ''}
          >
            {i18n.button.save}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateCategory;
