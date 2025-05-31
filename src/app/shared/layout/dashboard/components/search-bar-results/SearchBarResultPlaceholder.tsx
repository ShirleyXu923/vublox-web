import * as React from 'react';
import ContentLoader from 'react-content-loader';

function ImagePlaceholder() {
  return (
    <ContentLoader
      width="35"
      height="35"
      viewBox="0 0 35 35"
      preserveAspectRatio="none"
      className="content-loader"
    >
      <rect width="35" height="35" rx={8} ry={8} />
    </ContentLoader>
  );
}

function NamePlaceholder() {
  return (
    <ContentLoader
      width="100%"
      height="17"
      viewBox="0 0 200 17"
      preserveAspectRatio="none"
      className="content-loader"
      aria-label="Loading name"
      role="img"
    >
      <rect width="100%" height="17" />
    </ContentLoader>
  );
}

function DescriptionPlaceholder() {
  return (
    <ContentLoader
      width="300"
      height="17"
      viewBox="0 0 300 17"
      style={{ width: '100%' }}
      preserveAspectRatio="none"
      className="content-loader"
    >
      <rect width="300" height="17" />
    </ContentLoader>
  );
}

export {
  ImagePlaceholder,
  NamePlaceholder,
  DescriptionPlaceholder,
};
