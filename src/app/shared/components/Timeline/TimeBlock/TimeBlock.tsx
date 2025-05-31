import './TimeBlock.scss';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { createOrganizationTimeblockRequest, deleteOrganizationTimelineRequest, getTimelineByOrganizationRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import AddBioTimeBlockModal from '@shared/components/Modal/AddBioTimeBlockModal';
import AddCoverPhotoTimeBlockModal from '@shared/components/Modal/AddCoverPhotoTImeBlockModal';
import AddLocationTimeBlockModal from '@shared/components/Modal/AddLocationTimeBlockModal';
import AddLogoTimeBlockModal from '@shared/components/Modal/AddLogoTimeBlockModal';
import AddNameTimeBlockModal from '@shared/components/Modal/AddNameTimeBlockModal';
import { DeleteModal } from '@shared/components/Modal/delete-modal';
import { dateToCalendar, getFormData } from '@shared/helpers';
import PersonalCard from '@shared/icons/PersonalCard';

import { AddTimeblock } from './add-timeblock';
import Bio from './bio/Bio';
import CoverPhoto from './cover-photo/CoverPhoto';
import Location from './location/Location';
import Logo from './logo/Logo';
import Title from './title/Title';

function TimeBlock({
  timeBlock,
  isLast,
  selectedTimeblock,
  onSelectTimeblock,
}: any) {
  const i18n = LocaleService.getTranslations('createOrganization');
  const dispatch = useDispatch<any>();
  const params = useParams();
  const [ showConfirmDeleteModal, setShowConfirmDeleteModal ] = useState(false);
  const [ errors, setErrors ] = useState<any>({});
  const [ showAddBioModal, setShowAddBioModal ] = useState(false);
  const [ showAddCoverPhotoModal, setShowAddCoverPhotoModal ] = useState(false);
  const [ showAddLocationModal, setShowAddLocationModal ] = useState(false);
  const [ showAddLogoModal, setShowAddLogoModal ] = useState(false);
  const [ showAddNameModal, setShowAddNameModal ] = useState(false);

  const getTitle = () => {
    let component = null;

    switch (timeBlock.timeblock_type) {
      case 'Name':
        component = <Title name={timeBlock?.name} verifiedAt={timeBlock?.verified_at} />;
        break;
      case 'Bio':
        component = <Bio bio={timeBlock?.bio} verifiedAt={timeBlock?.verified_at} />;
        break;
      case 'Location':
        component = <Location location={timeBlock?.location} verifiedAt={timeBlock?.verified_at} />;
        break;
      case 'Logo':
        component = <Logo logo={timeBlock?.logo} verifiedAt={timeBlock?.verified_at} />;
        break;
      case 'CoverPhoto':
        component = (
          <CoverPhoto
            coverPhoto={timeBlock?.cover_image}
            verifiedAt={timeBlock?.verified_at}
          />
        );
        break;
      default:
        component = <Title />;
        break;
    }

    return component;
  };

  const closeModal = () => {
    setShowAddBioModal(false);
    setShowAddCoverPhotoModal(false);
    setShowAddLocationModal(false);
    setShowAddLogoModal(false);
    setShowAddNameModal(false);
  };

  const handleModalSubmit = async (form: any) => {
    try {
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
      toast.success(i18n.success.updatedTimeblock);
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
    }
  };

  const generateModal = () => {
    const type = timeBlock?.timeblock_type;

    switch (type) {
      case 'Name':
        setShowAddNameModal(!showAddNameModal);
        break;
      case 'Bio':
        setShowAddBioModal(!showAddBioModal);
        break;
      case 'Logo':
        setShowAddLogoModal(!showAddLogoModal);
        break;
      case 'CoverPhoto':
        setShowAddCoverPhotoModal(!showAddCoverPhotoModal);
        break;
      case 'Location':
        setShowAddLocationModal(!showAddLocationModal);
        break;
      default:
        break;
    }
  };

  const deleteTimeblock = async () => {
    try {
      await dispatch(deleteOrganizationTimelineRequest(timeBlock?.id)).$promise;
      toast.success(i18n.success.deletedTimeBlock);
      dispatch(getTimelineByOrganizationRequest(params.id));
    } catch (error: any) {
      handleError(error);
    }
  };

  const editTimeblock = () => {
    // Update modal to be display and then display it
    generateModal();
  };

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedTimeblock, timeBlock ]);

  return (
    <div className="timeblock-wrapper">
      <div className={`line ${isLast ? 'last-line' : ''}`} />
      <div style={{ width: '100%', marginLeft: '32px' }}>
        <div className={`timeblock-container ${selectedTimeblock === timeBlock?.id ? 'active' : ''}`} onClick={() => onSelectTimeblock(timeBlock?.id)}>
          <div className="timestamp b6">{dateToCalendar(timeBlock?.started_at)} - {timeBlock?.ended_at !== null ? dateToCalendar(timeBlock?.ended_at) : i18n.label.present}</div>
          {getTitle()}
          <div className="actions">
            <div className="badges">
              <PersonalCard />
              <span>{timeBlock?.timeblock_type ?? i18n.label.name}</span>
            </div>
            {selectedTimeblock === timeBlock?.id && (
              <div className="controls">
                <button
                  type="button"
                  className="text-danger a1"
                  onClick={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
                >
                  {i18n.button.delete}
                </button>
                <button type="button" className="text-primary a1" onClick={editTimeblock}>{i18n.button.edit}</button>
              </div>
            )}
          </div>
        </div>
        {selectedTimeblock === timeBlock?.id && (
          <div className="mt-3">
            <AddTimeblock />
          </div>
        )}
      </div>
      {/* <!-- Confirm Delete Modal --> */}
      <DeleteModal
        title={i18n.label.confirmDeleteTitle}
        description={i18n.label.confirmDeleteDescription}
        confirmButtonText={i18n.button.delete}
        cancelButtonText={i18n.button.cancel}
        onConfirm={deleteTimeblock}
        isOpen={showConfirmDeleteModal}
        toggle={() => setShowConfirmDeleteModal(!showConfirmDeleteModal)}
      />
      {/* <!-- Confirm Delete Modal --> */}

      {/* <!-- Add Name Modal --> */}
      <AddNameTimeBlockModal
        errors={errors}
        onSubmit={handleModalSubmit}
        organizationId={params.id}
        currentData={timeBlock}
        title={i18n.label.editNameTimeblock}
        isOpen={showAddNameModal}
        toggle={() => setShowAddNameModal(!showAddNameModal)}
      />
      {/* <!-- Add Name Modal --> */}

      {/* <!-- Add Bio Modal --> */}
      <AddBioTimeBlockModal
        errors={errors}
        onSubmit={handleModalSubmit}
        organizationId={params.id}
        currentData={timeBlock}
        title={i18n.label.editBioTimeBlock}
        isOpen={showAddBioModal}
        toggle={() => setShowAddBioModal(!showAddBioModal)}
      />
      {/* <!-- Add Bio Modal --> */}

      {/* <!-- Add Logo Modal --> */}
      <AddLogoTimeBlockModal
        errors={errors}
        organizationId={params.id}
        onSubmit={handleModalSubmit}
        currentData={timeBlock}
        title={i18n.label.editLogoTimeBlock}
        isOpen={showAddLogoModal}
        toggle={() => setShowAddLogoModal(!showAddLogoModal)}
      />
      {/* <!-- Add Logo Modal --> */}

      {/* <!-- Add Cover Photo Modal --> */}
      <AddCoverPhotoTimeBlockModal
        errors={errors}
        organizationId={params.id}
        onSubmit={handleModalSubmit}
        currentData={timeBlock}
        title={i18n.label.editCoverPhotoTimeBlock}
        isOpen={showAddCoverPhotoModal}
        toggle={() => setShowAddCoverPhotoModal(!showAddCoverPhotoModal)}
      />
      {/* <!-- Add Cover Photo Modal --> */}

      {/* <!-- Add Location Modal --> */}
      <AddLocationTimeBlockModal
        errors={errors}
        organizationId={params.id}
        onSubmit={handleModalSubmit}
        currentData={timeBlock}
        title={i18n.label.editLocationTimeBlock}
        isOpen={showAddLocationModal}
        toggle={() => setShowAddLocationModal(!showAddLocationModal)}
      />
      {/* <!-- Add Location Modal --> */}
    </div>
  );
}

export default TimeBlock;
