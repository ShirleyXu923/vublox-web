import React from 'react';
import ContentLoader from 'react-content-loader';

function ViewAllPagePlaceholder() {
  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <ContentLoader
          width="220"
          height="25"
          className="content-loader mx-auto"
        >
          <rect rx={6} ry={6} width="220" height="25" />
        </ContentLoader>
        <div className="col-lg-8 col-md-8 col-sm-6">
          <ContentLoader
            width="100%"
            height="25"
            className="content-loader mt-3 mx-auto"
          >
            <rect rx={6} ry={6} width="100%" height="25" />
          </ContentLoader>
        </div>
        <ContentLoader
          width="300"
          height="25"
          className="content-loader mt-3 mx-auto"
        >
          <rect rx={6} ry={6} width="300" height="25" />
        </ContentLoader>
      </div>
    </div>
  );
}

export default ViewAllPagePlaceholder;
