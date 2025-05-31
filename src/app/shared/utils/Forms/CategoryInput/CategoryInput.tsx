/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { components } from 'react-select';
import { toast } from 'react-toastify';
import { FormFeedback } from 'reactstrap';

import './CategoryInput.scss';

import { IRootState } from '@app/store';
import { verifyUserEmailRequest } from '@reducers/auth/AuthAction';
import { createCategoryRequest, getCategoriesRequest } from '@reducers/category/CategoryAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { getFormData } from '@shared/helpers';
import AddBox from '@shared/icons/AddBox';

import CreateCategory from './CreateCategory';
import CreateSuccess from './CreateSuccess';
import Select from '../Select/Select';

const MenuListFooter = ({
  onClick,
  label,
  verified = false,
  verifyLabel,
  toCreateLabel,
  sendVerification,
}: any) => (
  <div className="category-footer">
    {verified
      ? (
        <Link className="link" to="#" onClick={onClick}>
          <AddBox />
          <span className="mx-2">{label}</span>
        </Link>
      )
      : (
        <div className="unverified">
          <div className="disabled-link">
            <AddBox color="#53565F" />
            <span className="b6 mx-2">{label}</span>
          </div>
          <div className="message">
            <Link className="link1" to="#" onClick={sendVerification}>{verifyLabel}</Link>
            <span className="b5"> {toCreateLabel}</span>
          </div>
        </div>
      )}
  </div>
);

const MenuList = (props: any) => {
  const i18n = LocaleService.getTranslations('createCategory');
  const dispatch = useDispatch<any>();
  const user = useSelector((state: IRootState) => state.Auth.user);
  const {
    MenuListHeader = null,
  } = props.selectProps.components;

  const showCreateCategories = () => {
    const modal: any = document.getElementById('create-category');
    modal.style.display = 'flex';
  };

  const verifyEmail = async () => {
    try {
      await dispatch(verifyUserEmailRequest()).$promise;
      toast.success(i18n.success.verificationEmailSent);
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <components.MenuList {...props}>
      {props.children.length && MenuListHeader}
      {props.children}
      {props.children.length && (
        <MenuListFooter
          label={i18n.label.addCategory}
          onClick={showCreateCategories}
          verified={user?.profile?.verified_at !== null}
          verifyLabel={i18n.label.verify}
          toCreateLabel={i18n.label.toCreate}
          sendVerification={verifyEmail}
        />
      )}
    </components.MenuList>
  );
};

interface CategoryInputProps {
  name?: string;
  onChange: (e: any) => void;
  defaultOption?: any;
  errors?: any;
}

interface SelectedOptionType {
  label: string;
  value: string;
}

const formatErrors = (errors: string[] | undefined | null) => (
  <ul>
    {errors?.map((error: any) => <li key={error}>{error}</li>)}
  </ul>
);

function CategoryInput({
  name,
  onChange,
  defaultOption,
  errors: formErrors,
}: CategoryInputProps) {
  const i18n = LocaleService.getTranslations('createCategory');
  const dispatch = useDispatch<any>();
  const [ options, setOptions ] = useState([]);
  const [ parentCategories, setParentCategories ] = useState<any[]>([]);
  const [ createdCategory, setCreatedCategory ] = useState({});
  const [ showSuccessModal, setShowSuccessModal ] = useState(false);
  const [ errors, setErrors ] = useState<any>({});
  const [ selectedOption, setSelectedOption ] = useState<SelectedOptionType | null>(null);

  const getCategories = async () => {
    const { data } = await dispatch(getCategoriesRequest({ keyword: '' })).$promise;
    // Map Group Options
    const pCategories: any[] = [];
    const groupedOptions = data?.map((option: any) => {
      const subCategories = option?.subCategories?.map((sub: any) => (
        {
          value: sub?.id,
          label: sub?.name,
        }
      ));

      pCategories.push({
        label: option?.name,
        value: option?.id,
      });

      return {
        label: option?.name,
        options: subCategories,
      };
    });
    setParentCategories(pCategories);
    setOptions(groupedOptions);
    setSelectedOption(defaultOption);
  };

  const hideCreateCategories = () => {
    const modal: any = document.getElementById('create-category');
    modal.style.display = 'none';
  };

  const handleSubmit = async (form: any) => {
    try {
      setErrors({});
      const formData = getFormData(form);
      const res = await dispatch(createCategoryRequest(formData)).$promise;
      setCreatedCategory(res?.data);
      await getCategories();
      hideCreateCategories();
      setShowSuccessModal(true);
      setSelectedOption({
        label: res?.data?.name,
        value: res?.data?.id,
      });
      onChange({
        label: res?.data?.name,
        value: res?.data?.id,
      });
    } catch (error: any) {
      const { response } = error;
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs);
        handleError(error);
        return;
      }

      handleError(error);
    }
  };

  useEffect(() => {
    getCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Select
        name={name}
        classNamePrefix="react-select"
        label={i18n.label.category}
        placeholder={i18n.label.category}
        value={selectedOption}
        required
        onChange={(e: any) => {
          setSelectedOption(e);
          onChange(e);
        }}
        components={{
          MenuList,
        }}
        options={options}
      />
      <FormFeedback className={classNames({
        'd-block': !!formErrors,
      })}
      >
        {formatErrors(formErrors)}
      </FormFeedback>
      <CreateCategory
        parentCategories={parentCategories}
        handleClose={hideCreateCategories}
        handleSubmit={handleSubmit}
        errors={errors}
      />
      {showSuccessModal && (
        <CreateSuccess
          handleClose={() => setShowSuccessModal(false)}
          createdCategory={createdCategory}
        />
      )}
    </React.Fragment>
  );
}

export default CategoryInput;
