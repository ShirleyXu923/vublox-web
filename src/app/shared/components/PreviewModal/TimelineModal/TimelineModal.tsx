import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTracking } from 'react-tracking';
import {
  Modal, ModalBody, ModalHeader,
} from 'reactstrap';

import TimelineContent from '@components/client/timelines/pages/timeline-page/components/timeline-content/TimelineContent';
import PreviewTimeline from '@shared/components/AccordionTimeline/components/timeline/PreviewTimeline';
import TimelineMapPreview from '@shared/components/TimelineMap/TimelineMapPreview';
import { FullScreenIcon } from '@shared/icons';

import './TimelineModal.scss';

function TimelineModal({ item, show, toggle }: {
  item?: any;
  show: boolean;
  toggle: () => void;
}) {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (show && item) {
      trackEvent({
        page_type: 'Timeline',
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
      className="timeline-modal"
      scrollable
    >
      <ModalHeader toggle={toggle} className="justify-content-end">
        <Link
          to={`/timelines/${item.id}`}
          className="btn btn-link btn-sm"
          target="_blank"
        >
          <FullScreenIcon />
        </Link>
      </ModalHeader>
      <ModalBody className="timeline-page">
        <TimelineContent
          id={item.id}
          preview
          defaultItem={item}
          TimelineMapComponent={TimelineMapPreview}
          TimelineComponent={PreviewTimeline}
        />
      </ModalBody>
    </Modal>
  ) : null;
}

export default TimelineModal;
