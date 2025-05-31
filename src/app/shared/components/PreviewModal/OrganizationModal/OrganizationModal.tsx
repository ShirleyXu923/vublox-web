import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTracking } from 'react-tracking';
import {
  Modal, ModalBody, ModalHeader,
} from 'reactstrap';

import OrganizationContent from '@components/client/organizations/pages/organization-page/components/organization-content/OrganizationContent';
import PreviewTimeline from '@shared/components/AccordionTimeline/components/timeline/PreviewTimeline';
import TimelineMapPreview from '@shared/components/TimelineMap/TimelineMapPreview';
import { FullScreenIcon } from '@shared/icons';

import './OrganizationModal.scss';

function OrganizationModal({ item, show, toggle }: {
  item?: any;
  show: boolean;
  toggle: () => void;
}) {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (show && item) {
      trackEvent({
        page_type: 'Organization',
        page_id: item?.id,
        type: 'view',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ show, item ]);

  return item ? (
    <Modal
      isOpen={show}
      toggle={toggle}
      size="lg"
      className="organization-modal"
      scrollable
    >
      <ModalHeader toggle={toggle} className="justify-content-end">
        <Link
          to={`/organizations/${item.id}`}
          className="btn btn-link btn-sm"
          target="_blank"
        >
          <FullScreenIcon />
        </Link>
      </ModalHeader>
      <ModalBody className="organization-page">
        <OrganizationContent
          id={item.id}
          defaultItem={item}
          TimelineMapComponent={TimelineMapPreview}
          TimelineComponent={PreviewTimeline}
        />
      </ModalBody>
    </Modal>
  ) : null;
}

export default OrganizationModal;
