import React, { useEffect, useState } from 'react';
import {
  Col,
  FormText,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from 'reactstrap';

import formConfig from '@config/form';
import LocaleService from '@services/LocaleService';
import { Button } from '@shared/buttons/Button';
import { ADBCDateInput } from '@shared/utils/Forms/ADBCDateInput';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';
import '../modal.scss';
import './AddBioTimeBlockModal.scss';
import Input from '@shared/utils/Forms/Input/Input';

interface ModalProps {
  title?: string;
  currentData?: any;
  organizationId?: string;
  onSubmit: (form: any) => void;
  errors?: any;
  isOpen?: boolean;
  toggle: () => void;
  loading?: boolean,
}

function AddBioTimeBlockModal({
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
  const [ form, setForm ] = useState({
    bio: '',
    started_at: new Date(),
    ended_at: null,
    timeblock_type: 'Bio',
    organization_id: organizationId,
  });

  const handleInputChange = (evt: any) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleFormSubmit = () => {
    onSubmit(form);
  };

  const handleChangeEndDate = () => {
    setHasEndDate(!hasEndDate);

    if (!hasEndDate) {
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
        <h2>{title ?? i18n.label.addBioTimeBlock}</h2>
      </ModalHeader>
      <ModalBody>
        <div>
          <Row>
            <Col md={12}>
              <Input
                id="bio"
                name="bio"
                label={i18n.label.bio}
                value={form?.bio}
                maxLength={formConfig.organization.fields.bio.max}
                onChange={handleInputChange}
                required
                errors={errors?.bio}
                type="textarea"
                rows={7}
                style={{ height: '120px', resize: 'none' }}
                rightIcon={(
                  <FormText
                    className="float-text"
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '-24px',
                    }}
                  >
                    <small className="text-muted">
                      {`${form?.bio ? form.bio.length : 0}/${formConfig.organization.fields.bio.max}`}
                    </small>
                  </FormText>
                )}
                rightIconProps={{
                  style: {
                    borderLeft: 'none',
                    position: 'relative',
                  },
                }}
              />
            </Col>
          </Row>
          <Row>
            <p>{i18n.label.whenBioUsed}</p>
          </Row>
          <Row>
            <Col md={12}>
              <ADBCDateInput
                errors={errors?.started_at}
                label={i18n.label.startDate}
                selected={form?.started_at}
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
                disabled={!hasEndDate}
                errors={errors?.ended_at}
                label={i18n.label.endDate}
                selected={form?.ended_at}
                required
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
                label={i18n.label.noEndDateBio}
              />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col md={12}>
              <Button
                color="primary"
                isForm
                loading={loading}
                onClick={handleFormSubmit}
                label={i18n.button.save}
              />
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default AddBioTimeBlockModal;
