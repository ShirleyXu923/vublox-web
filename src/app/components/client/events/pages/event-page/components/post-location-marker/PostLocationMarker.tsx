import React from 'react';

import './PostLocationMarker.scss';
import useThumbnail from '@shared/hooks/useThumbnail';

interface PostLocationMarkerProps {
  item: any;
  showPost?: (item: any) => void
}

function PostLocationMarker({ item, showPost }: PostLocationMarkerProps) {
  const { thumbnail } = useThumbnail(item);
  return (
    <div className="post-location-marker" onClick={() => showPost?.(item)} style={{ cursor: 'pointer' }}>
      <div className="banner-img">
        {item.preview_image_urls ? (
          <img src={item.preview_image_urls?.sm} className="banner" alt="Event" width="100%" height="100%" />
        ) : (
          thumbnail
        )}
      </div>
      <div className="caret" />
    </div>
  );
}

export default PostLocationMarker;
