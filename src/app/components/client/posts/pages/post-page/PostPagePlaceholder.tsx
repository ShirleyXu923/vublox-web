import React from 'react';
import ContentLoader from 'react-content-loader';
// import './ProfilePagePlaceholder.scss';
import { useMediaQuery } from 'react-responsive';

import CustomTimeLineResponsiveLoader from '@shared/components/AccordionTimeline/components/custom-timeline-responsive-loader/CustomTimeLineResponsiveLoader';

function PostPagePlaceholder() {
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  return (
    <div className={`profile-page-wrapper profile-placeholder mx-5 ${isSmScreen ? 'px-4' : 'px-5'}`}>
      {/* Logo and Information section */}
      <ContentLoader
        width="100%"
        height={isSmScreen ? '200' : '400'}
        className="content-loader custom-loader mt-4 rounded"
      >
        <rect width="100%" height={isSmScreen ? '200' : '400'} />
      </ContentLoader>
      <div className="logo-info-container mx-2 mt-5">
        {/* Circle avatar for images profile picture */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Circle avatar for profile picture */}
          <ContentLoader
            width={isSmScreen ? '80' : '140'}
            height={isSmScreen ? '80' : '140'}
            className="content-loader content-loader-circle"
            viewBox={`0 0 ${isSmScreen ? '80 80' : '140 140'}`}
          >
            <rect rx={100} ry={100} width={isSmScreen ? 80 : 140} height={isSmScreen ? 80 : 140} />
          </ContentLoader>

          {isSmScreen && (
          // Additional content loader if screen is small
            <div>
              <ContentLoader
                width="100%"
                height="40" // Increased the height of the ContentLoader
                className="content-loader mb-2"
                style={{ marginLeft: '1rem' }}
              >
                <rect rx={6} ry={12} width="75%" height="40" /> {/* Increased height to 40 */}
              </ContentLoader>
              <ContentLoader
                width="100%"
                height="20"
                className="content-loader"
                style={{ marginLeft: '1rem' }}
              >
                <rect rx={6} ry={6} width="75%" height="20" />
              </ContentLoader>
            </div>

          )}
        </div>
        {/* This section should be on the name, bio, buttons */}
        {isSmScreen ? (
          <div className="d-flex flex-column mt-0">

            <ContentLoader
              width="100%"
              height="25"
              className="content-loader custom-loader mt-4 rounded"
            >
              <rect width="100%" height="25" />
            </ContentLoader>
          </div>
        ) : (
          <div className="d-flex flex-column">
            <ContentLoader
              width="170"
              height="25"
              className="content-loader custom-loader mt-3 rounded"
            >
              <rect rx={6} ry={6} width="170" height="25" />
            </ContentLoader>

            <ContentLoader
              width="70%"
              height="25"
              className="content-loader custom-loader mt-3 rounded"
            >
              <rect rx={6} ry={6} width="70%" height="25" />
            </ContentLoader>

            <div className="d-flex gap-3 mt-3">
              <ContentLoader
                width="100%"
                height="36"
                className="content-loader custom-loader rounded"
              >
                <rect rx={6} ry={6} width="100%" height="36" />
              </ContentLoader>
              <ContentLoader
                width="100%"
                height="36"
                className="content-loader custom-loader rounded"
              >
                <rect rx={6} ry={6} width="100%" height="36" />
              </ContentLoader>

              <ContentLoader
                width="100%"
                height="36"
                className="content-loader custom-loader rounded"
              >
                <rect rx={6} ry={6} width="100%" height="36" />
              </ContentLoader>
            </div>
          </div>
        )}

      </div>
      {isSmScreen && (
        <div className="d-flex gap-3 mt-3 mx-2">
          <div>
            <ContentLoader
              width="100%"
              height="28"
              className="content-loader custom-loader rounded"
            >
              <rect rx={6} ry={6} width="100%" height="28" />
            </ContentLoader>
          </div>
          <div>
            <ContentLoader
              width="100%"
              height="28"
              className="content-loader custom-loader rounded"
            >
              <rect rx={6} ry={6} width="100%" height="28" />
            </ContentLoader>
          </div>
        </div>
      )}

      <div className="timeline-section-wrapper mt-3">
        {/* This section should be the event filters */}
        {isSmScreen ? (
          <div className="d-flex gap-3 mt-3 mx-2">
            <ContentLoader
              width="180"
              height="36"
              className="content-loader custom-loader rounded"
            >
              <rect rx={6} ry={6} width="180" height="36" />
            </ContentLoader>
            <ContentLoader
              width="180"
              height="36"
              className="content-loader custom-loader rounded"
            >
              <rect rx={6} ry={6} width="180" height="36" />
            </ContentLoader>
            <ContentLoader
              width="180"
              height="36"
              className="content-loader custom-loader rounded"
            >
              <rect rx={6} ry={6} width="180" height="36" />
            </ContentLoader>
          </div>
        ) : (
          <div className={`event-filter mt-3 ${isSmScreen ? 'mx-2' : ''}`}>
            <div className="loader">
              <ContentLoader
                width="100%" // Reduced width for better fitting
                height="32"
                className="content-loader custom-loader rounded"
              >
                <rect width="100%" height="32" />
              </ContentLoader>
            </div>
            <div className="loader">
              <ContentLoader
                width="100%" // Reduced width for better fitting
                height="32"
                className="content-loader custom-loader rounded"
              >
                <rect width="100%" height="32" />
              </ContentLoader>
            </div>
            <div className="loader">
              <ContentLoader
                width="100%" // Reduced width for better fitting
                height="32"
                className="content-loader custom-loader rounded"
              >
                <rect width="100%" height="32" />
              </ContentLoader>
            </div>
            <div className="loader">
              <ContentLoader
                width="100%" // Reduced width for better fitting
                height="32"
                className="content-loader custom-loader rounded"
              >
                <rect width="100%" height="32" />
              </ContentLoader>
            </div>
          </div>
        )}

        {isSmScreen ? (
          <div className="mx-2"><CustomTimeLineResponsiveLoader /></div>)
          : (
            <> <CustomTimeLineResponsiveLoader />
            </>
          )}

      </div>

    </div>
  );
}

export default PostPagePlaceholder;
