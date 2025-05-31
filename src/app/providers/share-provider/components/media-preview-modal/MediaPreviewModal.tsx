// import mime from 'mime';
import React, { MouseEvent, useEffect, useState } from 'react';

import './MediaPreviewModal.scss';

export const MediaPreviewModal = {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  toggle: (value: boolean) => {},
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  setData: (data: any) => {},
};

function MediaPreviewModalRoot() {
  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [ data, setData ] = useState<any>({});

  useEffect(() => {
    MediaPreviewModal.toggle = setIsFullScreen;
    MediaPreviewModal.setData = setData;
  }, []);

  const isMediaVideo = data.media_type?.startsWith('video');

  return (
    <div className="full-screen-container w-100 h-100">
      {isFullScreen && (
        <div
          className="full-screen-backdrop"
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          {isMediaVideo ? (
            <video
              controls
              autoPlay
              className="full-screen-media"
              controlsList="nodownload"
              onClick={(e: MouseEvent<HTMLVideoElement>) => e.stopPropagation()}
              preload="metadata"
            >
              <source src={`${data.media_url?.lg}`} />
            </video>
          ) : (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <img
              src={data.media_url?.lg}
              alt="Full Screen"
              className="full-screen-media"
              onClick={(e: MouseEvent<HTMLImageElement>) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}

export const useMediaPreviewModal = () => MediaPreviewModal;

export default MediaPreviewModalRoot;
