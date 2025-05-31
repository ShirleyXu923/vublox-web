import React from 'react';
import ContentLoader from 'react-content-loader';

function InterestsSelectionPlaceholder() {
  const width = Math.floor(Math.random() * (220 - 100 + 1) + 100);
  return (
    <ContentLoader
      width={width}
      height={47}
      className="content-loader"
    >
      <rect rx="25" ry="25" width={width} height="47" />
    </ContentLoader>
  );
}

export default InterestsSelectionPlaceholder;
