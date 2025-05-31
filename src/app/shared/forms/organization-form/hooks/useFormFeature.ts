import { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { handleError } from '@services/ErrorHandler';
import { SubmitType } from '@shared/forms/types';
import { getFormData } from '@shared/helpers';

export interface FormType {
  name: string;
  started_at: Date;
  ended_at: Date | null;
  contact: {
    website: string;
    email: string;
    is_email_hidden: boolean;
  };
  url: {
    facebook: string;
    instagram: string;
    tiktok: string;
    x: string;
    youtube: string;
  };
  category?: {
    id: string;
    name: string;
  } | null;
  category_id: string;
  privacy_option: string;
  tags: any[];
  noEndDate?: boolean;
}

interface InputType {
  target: {
    name: string;
    value: any;
  }
}

const formDedefault: FormType = {
  name: '',
  started_at: new Date(),
  ended_at: null,
  contact: {
    website: '',
    email: '',
    is_email_hidden: true,
  },
  url: {
    facebook: '',
    instagram: '',
    tiktok: '',
    x: '',
    youtube: '',
  },
  category: null,
  category_id: '',
  privacy_option: 'public',
  tags: [],
  noEndDate: true,
};

function useFormFeature(submit: SubmitType, defaultValue?: any) {
  const dispatch = useDispatch<any>();
  const [ form, setForm ] = useState<FormType>(defaultValue || formDedefault);
  const [ loading, setLoading ] = useState(false);
  const [ errors, setErrors ] = useState();

  const getPrivacyOption = () => {
    let privacy = 'public';

    if (form.privacy_option) {
      privacy = form.privacy_option;
    }

    return privacy;
  };

  const onInputChange = (e: InputType) => {
    const { name, value = null } = e.target;
    const copyForm = form;
    _.set(copyForm, name, value);
    setForm({
      ...copyForm,
    });
  };

  const onFormSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...form,
      contact: {
        ...form.contact,
        is_email_hidden: _.get(form, 'contact.is_email_hidden') ? '1' : '0',
      },
    };

    const formData = getFormData(data);

    const { request, params } = submit;
    dispatch(request(...params, formData)).$promise
      .then((res: AxiosResponse) => {
        submit.after(res?.data);
        setLoading(false);
      })
      .catch((error: any) => {
        handleError(error);
        const errorData = error?.response?.data;
        setLoading(false);

        if (errorData?.statusCode === 422) {
          setErrors(errorData?.errors);
        }
      });
  };

  return {
    form,
    errors,
    onInputChange,
    onFormSubmit,
    loading,
    getPrivacyOption,
  };
}

export default useFormFeature;
