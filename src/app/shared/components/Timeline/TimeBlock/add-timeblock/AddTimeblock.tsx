import './AddTimeblock.scss';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import { createOrganizationTimeblockRequest, getTimelineByOrganizationRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import AddBioTimeBlockModal from '@shared/components/Modal/AddBioTimeBlockModal';
import AddCoverPhotoTimeBlockModal from '@shared/components/Modal/AddCoverPhotoTImeBlockModal';
import AddLocationTimeBlockModal from '@shared/components/Modal/AddLocationTimeBlockModal';
import AddLogoTimeBlockModal from '@shared/components/Modal/AddLogoTimeBlockModal';
import AddNameTimeBlockModal from '@shared/components/Modal/AddNameTimeBlockModal';
import { getFormData } from '@shared/helpers';
import Add from '@shared/icons/Add';
import Bio from '@shared/icons/Bio';
import CoverPhoto from '@shared/icons/CoverPhoto';
import Location from '@shared/icons/Location';
import Name from '@shared/icons/Name';

function AddTimeblock() {
  const i18n = LocaleService.getTranslations('organizations');
  const dispatch = useDispatch<any>();
  const params = useParams();
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ errors, setErrors ] = useState<any>({});
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [ showAddBioModal, setShowAddBioModal ] = useState(false);
  const [ showAddCoverPhotoModal, setShowAddCoverPhotoModal ] = useState(false);
  const [ showAddLocationModal, setShowAddLocationModal ] = useState(false);
  const [ showAddLogoModal, setShowAddLogoModal ] = useState(false);
  const [ showAddNameModal, setShowAddNameModal ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const closeModal = () => {
    setShowAddBioModal(false);
    setShowAddCoverPhotoModal(false);
    setShowAddLocationModal(false);
    setShowAddLogoModal(false);
    setShowAddNameModal(false);
  };

  const handleModalSubmit = async (form: any) => {
    try {
      setLoading(true);
      const formData = getFormData({
        ...form,
      });

      if (form?.started_at instanceof Date) {
        formData.set('started_at', (form?.started_at as Date).toISOString());
      }

      if (form?.ended_at instanceof Date) {
        formData.set('ended_at', (form?.ended_at as Date).toISOString());
      }

      // Remove key value in request if it is not needed
      Object.keys(form).map((key: string) => {
        if (!form[key]) {
          formData.delete(key);
        }

        return key;
      });

      setErrors({});
      await dispatch(createOrganizationTimeblockRequest(formData)).$promise;
      toast.success(i18n.timeblocks.success.updated);
      dispatch(getTimelineByOrganizationRequest(params.id));
      closeModal();
    } catch (error: any) {
      const { response } = error;
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs);
        handleError(error);
        return;
      }
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dropdown className="dropdown-custom" isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle
          data-toggle="dropdown"
          tag="span"
          className="dropdown"
        >
          <div className="dropdown-button">
            <Add />
            {i18n.timeblocks.label.addTimeblock}
          </div>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => setShowAddBioModal(!showAddBioModal)}>
            <Bio />
            <span>{i18n.timeblocks.label.bio}</span>
          </DropdownItem>
          <DropdownItem onClick={() => setShowAddCoverPhotoModal(!showAddCoverPhotoModal)}>
            <CoverPhoto />
            <span>{i18n.timeblocks.label.coverPhoto}</span>
          </DropdownItem>
          <DropdownItem onClick={() => setShowAddLocationModal(!showAddLocationModal)}>
            <Location />
            <span>{i18n.timeblocks.label.location}</span>
          </DropdownItem>
          <DropdownItem onClick={() => setShowAddLogoModal(!showAddLogoModal)}>
            <CoverPhoto />
            <span>{i18n.timeblocks.label.logo}</span>
          </DropdownItem>
          <DropdownItem onClick={() => setShowAddNameModal(!showAddNameModal)}>
            <Name />
            <span>{i18n.timeblocks.label.name}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {/* <!-- Add Bio Modal --> */}
      <AddBioTimeBlockModal
        loading={loading}
        errors={errors}
        onSubmit={handleModalSubmit}
        organizationId={params.id}
        isOpen={showAddBioModal}
        toggle={() => setShowAddBioModal(!showAddBioModal)}
      />
      {/* <!-- Add Bio Modal --> */}

      {/* <!-- Add Cover Photo Modal --> */}
      <AddCoverPhotoTimeBlockModal
        loading={loading}
        errors={errors}
        organizationId={params.id}
        onSubmit={handleModalSubmit}
        isOpen={showAddCoverPhotoModal}
        toggle={() => setShowAddCoverPhotoModal(!showAddCoverPhotoModal)}
      />
      {/* <!-- Add Cover Photo Modal --> */}

      {/* <!-- Add Location Modal --> */}
      <AddLocationTimeBlockModal
        loading={loading}
        errors={errors}
        organizationId={params.id}
        onSubmit={handleModalSubmit}
        isOpen={showAddLocationModal}
        toggle={() => setShowAddLocationModal(!showAddLocationModal)}
      />
      {/* <!-- Add Location Modal --> */}

      {/* <!-- Add Logo Modal --> */}
      <AddLogoTimeBlockModal
        loading={loading}
        errors={errors}
        organizationId={params.id}
        onSubmit={handleModalSubmit}
        isOpen={showAddLogoModal}
        toggle={() => setShowAddLogoModal(!showAddLogoModal)}
      />
      {/* <!-- Add Logo Modal --> */}

      {/* <!-- Add Name Modal --> */}
      <AddNameTimeBlockModal
        loading={loading}
        errors={errors}
        onSubmit={handleModalSubmit}
        organizationId={params.id}
        isOpen={showAddNameModal}
        toggle={() => setShowAddNameModal(!showAddNameModal)}
      />
      {/* <!-- Add Name Modal --> */}
    </div>
  );
}

export default AddTimeblock;
