import React from 'react';
import ContentLoader from 'react-content-loader';

function EventPagePlaceholder() {
  return (
    <div className="container mt-5">
      {/* Timeline Section */}
      <div className="row mb-4">
        <ContentLoader
          width="220"
          height="25"
          className="content-loader mx-auto"
        >
          <rect rx={6} ry={6} width="220" height="25" />
        </ContentLoader>
        <div className="col-lg-3 col-md-3 col-sm-6">
          <ContentLoader
            width="100%"
            height="25"
            className="content-loader mt-3 mx-auto"
          >
            <rect rx={6} ry={6} width="100%" height="25" />
          </ContentLoader>
        </div>
        <div className="col-lg-9 col-md-9 col-sm-6">
          <ContentLoader
            width="100%"
            height="25"
            className="content-loader mt-3 mx-auto"
          >
            <rect rx={6} ry={6} width="100%" height="25" />
          </ContentLoader>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="d-flex gap-2 mb-3" />
          <div className="d-flex gap-3 mb-3">
            <ContentLoader
              width="220"
              height="32"
              className="content-loader mx-auto"
              style={{ borderRadius: '6px' }}

            >
              <rect rx={6} ry={6} width="220" height="32" />
            </ContentLoader>
            <ContentLoader
              width="220"
              height="32"
              className="content-loader mx-auto"
              style={{ borderRadius: '6px' }}

            >
              <rect rx={6} ry={6} width="220" height="32" />
            </ContentLoader>
            <ContentLoader
              width="220"
              height="32"
              className="content-loader mx-auto"
              style={{ borderRadius: '6px' }}

            >
              <rect rx={6} ry={6} width="220" height="32" />
            </ContentLoader>
            <ContentLoader
              width="220"
              height="32"
              className="content-loader mx-auto"
              style={{ borderRadius: '6px' }}

            >
              <rect rx={6} ry={6} width="220" height="32" />
            </ContentLoader>
          </div>
          <div className="mb-3">
            <ContentLoader
              width="100%"
              height="52"
              className="content-loader mt-4 mx-auto"
              style={{ borderRadius: '12px' }}
            >
              <rect rx={6} ry={6} width="100%" height="52" />
            </ContentLoader>
            <ContentLoader
              width="100%"
              height="174"
              className="content-loader mt-4 mx-auto"
              style={{ borderRadius: '12px' }}
            >
              <rect rx={6} ry={6} width="100%" height="174" />
            </ContentLoader>
            <ContentLoader
              width="100%"
              height="52"
              className="content-loader mt-4 mx-auto"
              style={{ borderRadius: '12px' }}
            >
              <rect rx={6} ry={6} width="100%" height="52" />
            </ContentLoader>
            <ContentLoader
              width="100%"
              height="174"
              className="content-loader mt-4 mx-auto"
              style={{ borderRadius: '12px' }}
            >
              <rect rx={6} ry={6} width="100%" height="174" />
            </ContentLoader>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPagePlaceholder;
