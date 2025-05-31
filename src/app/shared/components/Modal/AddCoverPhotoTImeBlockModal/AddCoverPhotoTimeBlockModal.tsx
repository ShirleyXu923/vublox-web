import React, { useEffect, useState } from 'react';
import '../modal.scss';
import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import Media from '@shared/icons/Media';
import Dropzone from '@shared/utils/Dropzone/Dropzone';
import { ADBCDateInput } from '@shared/utils/Forms/ADBCDateInput';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';

interface ModalProps {
  title?: string;
  currentData?: any;
  organizationId?: string;
  onSubmit: (form: any) => void;
  errors?: any;
  isOpen?: boolean;
  toggle: () => void;
  loading?: boolean;
}

interface IForm {
  started_at?: Date | string | null;
  ended_at?: Date | string | null;
  cover_photo?: File | null;
  organization_id?: string;
  timeblock_type?: string;
}

function AddCoverPhotoTimeBlockModal({
  title,
  currentData,
  organizationId,
  onSubmit,
  errors,
  isOpen,
  toggle,
  loading,
}: ModalProps) {
  const i18n = LocaleService.getTranslations('createOrganization');
  const [ hasEndDate, setHasEndDate ] = useState(false);
  const [ form, setForm ] = useState<IForm>({
    started_at: new Date(),
    ended_at: null,
    cover_photo: null,
    organization_id: organizationId,
    timeblock_type: 'CoverPhoto',
  });

  const handleSubmission = (evt: any) => {
    evt.preventDefault();
    onSubmit(form);
  };

  const handleInputChange = (evt: any) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleChangeEndDate = () => {
    setHasEndDate(!hasEndDate);

    if (hasEndDate) {
      handleInputChange({
        target: {
          name: 'ended_at',
          value: null,
        },
      });
    }
  };

  useEffect(() => {
    if (currentData) {
      setForm({
        ...currentData,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader toggle={toggle}>
        <h2>{title ?? i18n.label.addCoverPhotoTimeBlock}</h2>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmission}>
          <Row>
            <Col md={12}>
              <Dropzone
                onFileAdded={(e: File[]) => {
                  handleInputChange({
                    target: {
                      name: 'cover_photo',
                      value: e[0],
                    },
                  });
                }}
                icon={<Media />}
                label={i18n.label.uploadCoverPhoto}
                required
                uploadText={i18n.label.coverPhotoRecommendedSize}
                accept={{
                  'image/*': [ '.jpeg', '.jpg', '.png' ],
                }}
                acceptedTypes={{
                  'image/png': [ '.png' ],
                  'image/jpeg': [ '.jpg', '.jpeg' ],
                }}
                maxSize={5e7}
              />
            </Col>
          </Row>
          <Row>
            <p>{i18n.label.whenCoverPhotoUsed}</p>
          </Row>
          <Row>
            <Col md={12}>
              <ADBCDateInput
                errors={errors?.started_at}
                selected={form?.started_at as Date}
                label={i18n.label.startDate}
                required
                onChange={(e: any) => {
                  handleInputChange({
                    target: {
                      name: 'started_at',
                      value: e.date,
                    },
                  });
                }}
              />
            </Col>
            <Col className={`${!hasEndDate ? 'input-to-disable' : ''}`} md={12}>
              <ADBCDateInput
                errors={errors?.ended_at}
                selected={form?.ended_at as Date}
                label={i18n.label.endDate}
                required
                disabled={!hasEndDate}
                onChange={(e: any) => {
                  handleInputChange({
                    target: {
                      name: 'ended_at',
                      value: e.date,
                    },
                  });
                }}
              />
              <Checkbox
                checked={!hasEndDate}
                onChange={handleChangeEndDate}
                label={i18n.label.noEndDateCoverPhoto}
              />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col md={12}>
              <Button
                color="primary"
                isForm
                loading={loading}
                onClick={handleSubmission}
                label={i18n.button.save}
              />
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
}

export default AddCoverPhotoTimeBlockModal;
