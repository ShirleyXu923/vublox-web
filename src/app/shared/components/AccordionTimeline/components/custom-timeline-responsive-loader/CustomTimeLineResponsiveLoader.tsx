import React from 'react';
import ContentLoader from 'react-content-loader';

function CustomTimeLineResponsiveLoader() {
  return (
    <div className="mt-4">
      <ContentLoader
        width="100%"
        height="52"
        className="content-loader custom-loader mt-4 rounded"
      >
        <rect width="100%" height="52" />
      </ContentLoader>
      <ContentLoader
        width="100%"
        height="174"
        className="content-loader custom-loader mt-4 rounded"
      >
        <rect width="100%" height="174" />
      </ContentLoader>
      <ContentLoader
        width="100%"
        height="52"
        className="content-loader custom-loader mt-4 rounded"
      >
        <rect width="100%" height="52" />
      </ContentLoader>
      <ContentLoader
        width="100%"
        height="174"
        className="content-loader custom-loader mt-4 rounded"
      >
        <rect width="100%" height="174" />
      </ContentLoader>
      <ContentLoader
        width="100%"
        height="52"
        className="content-loader custom-loader mt-4 rounded"
      >
        <rect width="100%" height="52" />
      </ContentLoader>
      <ContentLoader
        width="100%"
        height="174"
        className="content-loader custom-loader mt-4 rounded"
      >
        <rect width="100%" height="174" />
      </ContentLoader>
    </div>
  );
}

export default CustomTimeLineResponsiveLoader;
