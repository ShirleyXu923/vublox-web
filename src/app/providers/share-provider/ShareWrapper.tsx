import React from 'react';

import MediaPreviewModalRoot from './components/media-preview-modal/MediaPreviewModal';
import ShareLinkModalRoot from './components/share-link-modal/ShareLinkModal';

interface Props {
  children: JSX.Element;
}

function ShareWrapper({ children }: Props): JSX.Element {
  return (
    <>
      {children}
      <ShareLinkModalRoot />
      <MediaPreviewModalRoot />
    </>
  );
}

export { ShareWrapper };
export default ShareWrapper;
