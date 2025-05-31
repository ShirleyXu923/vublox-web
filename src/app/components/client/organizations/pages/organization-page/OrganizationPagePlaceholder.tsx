import React from 'react';
import ContentLoader from 'react-content-loader';

function OrganizationPagePlaceholder() {
  return (
    <div className="mt-4">
      {/* Logo and Information section */}
      <div className="mt-4 d-flex gap-3">
        <ContentLoader
          width="140"
          height="140"
          className="content-loader content-loader-circle"
        >
          <rect rx={6} ry={6} width="140" height="140" />
        </ContentLoader>

        <div className="d-flex flex-column">
          <ContentLoader
            width="200"
            height="25"
            className="content-loader mt-3"
          >
            <rect rx={6} ry={6} width="200" height="25" />
          </ContentLoader>

          <ContentLoader
            width="600"
            height="25"
            className="content-loader mt-3"
          >
            <rect rx={6} ry={6} width="600" height="25" />
          </ContentLoader>

          <div className="d-flex gap-3 mt-3">
            <ContentLoader
              width="180"
              height="36"
              className="content-loader"
            >
              <rect rx={6} ry={6} width="180" height="36" />
            </ContentLoader>
            <ContentLoader
              width="180"
              height="36"
              className="content-loader"
            >
              <rect rx={6} ry={6} width="180" height="36" />
            </ContentLoader>
            <ContentLoader
              width="180"
              height="36"
              className="content-loader"
            >
              <rect rx={6} ry={6} width="180" height="36" />
            </ContentLoader>
            <ContentLoader
              width="180"
              height="36"
              className="content-loader"
            >
              <rect rx={6} ry={6} width="180" height="36" />
            </ContentLoader>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mt-5">
        <div className="d-flex gap-2">
          <ContentLoader
            width="145"
            height="22"
            className="content-loader"
          >
            <rect rx={6} ry={6} width="145" height="22" />
          </ContentLoader>
          <ContentLoader
            width="145"
            height="22"
            className="content-loader"
          >
            <rect rx={6} ry={6} width="145" height="22" />
          </ContentLoader>
        </div>
        <div className="d-flex gap-3 mt-3">
          <ContentLoader
            width="220"
            height="32"
            className="content-loader"
          >
            <rect rx={6} ry={6} width="220" height="32" />
          </ContentLoader>
          <ContentLoader
            width="220"
            height="32"
            className="content-loader"
          >
            <rect rx={6} ry={6} width="220" height="32" />
          </ContentLoader>
          <ContentLoader
            width="220"
            height="32"
            className="content-loader"
          >
            <rect rx={6} ry={6} width="220" height="32" />
          </ContentLoader>
          <ContentLoader
            width="220"
            height="32"
            className="content-loader"
          >
            <rect rx={6} ry={6} width="220" height="32" />
          </ContentLoader>
        </div>
        <div className="mt-4" style={{ marginLeft: '20px' }}>
          <ContentLoader
            width="930"
            height="52"
            className="content-loader mt-4"
            style={{ borderRadius: '12px' }}
          >
            <rect rx={6} ry={6} width="930" height="52" />
          </ContentLoader>
          <ContentLoader
            width="930"
            height="174"
            className="content-loader mt-4"
            style={{ borderRadius: '12px' }}
          >
            <rect rx={6} ry={6} width="930" height="174" />
          </ContentLoader>
          <ContentLoader
            width="930"
            height="52"
            className="content-loader mt-4"
            style={{ borderRadius: '12px' }}
          >
            <rect rx={6} ry={6} width="930" height="52" />
          </ContentLoader>
          <ContentLoader
            width="930"
            height="174"
            className="content-loader mt-4"
            style={{ borderRadius: '12px' }}
          >
            <rect rx={6} ry={6} width="930" height="174" />
          </ContentLoader>
        </div>
      </div>
    </div>
  );
}

export default OrganizationPagePlaceholder;
