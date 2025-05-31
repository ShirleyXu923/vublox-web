import React, { useEffect, useState } from 'react';
import '../modal.scss';
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
import Input from '@shared/utils/Forms/Input/Input';

interface ModalProps {
  title?: string;
  organizationId?: string;
  onSubmit: (form: any) => void;
  errors?: any;
  currentData?: any;
  isOpen?: boolean;
  toggle: () => void;
  loading?: boolean;
}

function AddNameTimeBlockModal({
  title,
  organizationId,
  onSubmit,
  errors,
  currentData,
  isOpen,
  toggle,
  loading,
}: ModalProps) {
  const i18n = LocaleService.getTranslations('createOrganization');
  const [ hasEndDate, setHasEndDate ] = useState(false);
  const [ form, setForm ] = useState({
    name: '',
    started_at: new Date(),
    ended_at: null,
    organization_id: organizationId,
    timeblock_type: 'Name',
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

  useEffect(() => {
  }, [ errors ]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader toggle={toggle}>
        <h2>{title ?? i18n.label.addNameTimeBlock}</h2>
      </ModalHeader>
      <ModalBody>
        <div>
          <Row>
            <Col md={12}>
              <Input
                name="name"
                maxLength={formConfig.organization.fields.name.max}
                placeholder={i18n.label.organizationName}
                label={i18n.label.organizationName}
                onChange={handleInputChange}
                value={form?.name}
                required
                rightIcon={(
                  <FormText>
                    <small className="text-muted">
                      {`${form?.name ? form?.name.length : 0}/${formConfig.organization.fields.name.max}`}
                    </small>
                  </FormText>
                )}
                errors={errors?.name}
              />
            </Col>
          </Row>
          <Row>
            <p>{i18n.label.whenOrganizationUsed}</p>
          </Row>
          <Row>
            <Col md={12}>
              <ADBCDateInput
                errors={errors?.started_at}
                selected={form?.started_at}
                required
                label={i18n.label.startDate}
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
                selected={form?.ended_at}
                required
                disabled={!hasEndDate}
                label={i18n.label.endDate}
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
                label={i18n.label.noEndDate}
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

export default AddNameTimeBlockModal;
