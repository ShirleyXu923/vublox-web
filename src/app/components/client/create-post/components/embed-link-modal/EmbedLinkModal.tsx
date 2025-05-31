import { debounce } from 'lodash';
import React, {
  ChangeEvent, useCallback, useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Modal, ModalBody, ModalHeader,
  Spinner,
} from 'reactstrap';

import { getMetatagsRequest } from '@reducers/app/AppAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import Input from '@shared/utils/Forms/Input/Input';

import LinkPreview from '../link-preview/LinkPreview';

interface EmbedLinkModalProps {
  show: boolean;
  toggle: () => void;
  onSave: (metadata: any) => void;
}

function EmbedLinkModal({ show, toggle, onSave }: EmbedLinkModalProps) {
  const i18n = useTranslation('createPost.embedLink');
  const [ url, setUrl ] = useState('');
  const [ metadata, setMetadata ] = useState<any>();
  const [ loading, setLoading ] = useState(false);
  const dispatch = useDispatch<any>();

  const getMetadata = async (value: string) => {
    try {
      const { data } = await dispatch(getMetatagsRequest({ url: value })).$promise;
      setMetadata(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce((query) => {
    getMetadata(query);
  }, 2000), []);

  const handleSetUrl = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setUrl(target.value);

    if (!target.value) return;
    setLoading(true);
    handleSearch(target.value);
  };

  const handleSave = () => {
    onSave(metadata);
    toggle();
  };

  useEffect(() => {
    if (!show) {
      setUrl('');
      setMetadata(null);
    }
  }, [ show ]);

  return (
    <Modal centered size="md" isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle} className="px-4">
        <h2>{i18n.title}</h2>
      </ModalHeader>
      <ModalBody className="px-4 pb-4 pt-2">
        <Input
          name="url"
          label={i18n.label.url}
          placeholder={i18n.label.url}
          required
          formGroupProps={{
            className: 'mb-4',
          }}
          onChange={handleSetUrl}
          value={url}
          rightIcon={loading && (
            <Spinner size="sm" />
          )}
        />

        <LinkPreview
          metadata={metadata}
        />

        <Button
          color="primary"
          block
          disabled={!metadata}
          className="mt-4"
          onClick={handleSave}
        >
          {i18n.button.save}
        </Button>
      </ModalBody>
    </Modal>
  );
}

export default EmbedLinkModal;
