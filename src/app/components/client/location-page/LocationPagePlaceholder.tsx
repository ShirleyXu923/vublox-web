import React from 'react';
import ContentLoader from 'react-content-loader';

import CustomTimeLineResponsiveLoader from '@shared/components/AccordionTimeline/components/custom-timeline-responsive-loader/CustomTimeLineResponsiveLoader';

function LocationPagePlaceholder() {
  return (
    <div className="mt-4">
      {/* Logo and Information section */}
      <div className="mt-4 d-flex gap-3">
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

      <CustomTimeLineResponsiveLoader />
    </div>
  );
}

export default LocationPagePlaceholder;
