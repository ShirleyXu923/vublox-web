import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTracking } from 'react-tracking';
import {
  Modal, ModalBody, ModalHeader,
} from 'reactstrap';

import PostContent from '@components/client/posts/pages/post-page/components/content/PostContent';
import { FullScreenIcon } from '@shared/icons';

import './PostModal.scss';

function PostModal({ item, show, toggle }: {
  item?: any;
  show: boolean;
  toggle: () => void;
}) {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (show && item) {
      trackEvent({
        page_type: 'Post',
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
      className="post-modal"
      scrollable
    >
      <ModalHeader toggle={toggle} className="justify-content-end">
        <Link
          to={`/posts/${item.id}`}
          className="btn btn-link btn-sm"
          target="_blank"
        >
          <FullScreenIcon />
        </Link>
      </ModalHeader>
      <ModalBody className="post-page">
        <PostContent id={item.id} preview defaultPost={item} />
      </ModalBody>
    </Modal>
  ) : null;
}

export default PostModal;
