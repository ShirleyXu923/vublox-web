import React from 'react';
import ContentLoader from 'react-content-loader';

function FollowSelectionPlaceholder() {
  const width = Math.floor(Math.random() * (220 - 100 + 1) + 100);

  return (
    <div className="d-flex align-items-center py-3">
      <ContentLoader
        width={width}
        height={20}
        className="content-loader flex-fill"
      >
        <rect width={width} height="20" />
      </ContentLoader>

      <ContentLoader
        width={120}
        height={30}
        className="content-loader "
      >
        <rect rx={8} ry={8} width="120" height="30" />
      </ContentLoader>

    </div>
  );
}

export default FollowSelectionPlaceholder;
