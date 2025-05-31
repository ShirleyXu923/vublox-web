import React from 'react';
import ContentLoader from 'react-content-loader';
import './ProfilePagePlaceholder.scss';
import { useMediaQuery } from 'react-responsive';

import CustomTimeLineResponsiveLoader from '@shared/components/AccordionTimeline/components/custom-timeline-responsive-loader/CustomTimeLineResponsiveLoader';

function ProfilePagePlaceholder() {
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  return (
    <div className="profile-page-wrapper profile-placeholder">
      {/* Logo and Information section */}
      <div className="logo-info-container mx-2">
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
              width="350"
              height="25"
              className="content-loader custom-loader mt-3 rounded"
            >
              <rect rx={6} ry={6} width="350" height="25" />
            </ContentLoader>

            <div className="d-flex mt-3 gap-1">
              <div style={{ flex: '0 0 40%' }}>
                <ContentLoader
                  height="36"
                  className="content-loader custom-loader rounded w-100"
                >
                  <rect rx={6} ry={6} width="100%" height="36" />
                </ContentLoader>
              </div>

              <div style={{ flex: '0 0 40%' }}>
                <ContentLoader
                  height="36"
                  className="content-loader custom-loader rounded"
                >
                  <rect rx={6} ry={6} width="100%" height="36" />
                </ContentLoader>
              </div>

              <div style={{ flex: '0 0 20%' }}>
                <ContentLoader
                  height="36"
                  className="content-loader custom-loader rounded"
                >
                  <rect rx={6} ry={6} width="75%" height="36" />
                </ContentLoader>
              </div>
            </div>

          </div>
        ) : (
          <div className="d-flex flex-column">
            <ContentLoader
              width="200"
              height="25"
              className="content-loader custom-loader mt-3 rounded"
            >
              <rect rx={6} ry={6} width="200" height="25" />
            </ContentLoader>

            <ContentLoader
              width="600"
              height="25"
              className="content-loader custom-loader mt-3 rounded"
            >
              <rect rx={6} ry={6} width="600" height="25" />
            </ContentLoader>

            <div className="d-flex gap-3 mt-3">
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
          </div>
        )}

      </div>
      {isSmScreen && (
        <div className="d-flex gap-3 mt-3 mx-2">
          <div style={{ flex: '0 0 auto' }}>
            <ContentLoader
              width="100"
              height="28"
              className="content-loader custom-loader rounded"
            >
              <rect rx={6} ry={6} width="100" height="28" />
            </ContentLoader>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <ContentLoader
              width="100"
              height="28"
              className="content-loader custom-loader rounded"
            >
              <rect rx={6} ry={6} width="100" height="28" />
            </ContentLoader>
          </div>
        </div>
      )}

      <div className="timeline-section-wrapper mt-5">
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
                width="90%" // Reduced width for better fitting
                height="32"
                className="content-loader custom-loader rounded"
              >
                <rect width="100%" height="32" />
              </ContentLoader>
            </div>
            <div className="loader">
              <ContentLoader
                width="90%" // Reduced width for better fitting
                height="32"
                className="content-loader custom-loader rounded"
              >
                <rect width="100%" height="32" />
              </ContentLoader>
            </div>
            <div className="loader">
              <ContentLoader
                width="90%" // Reduced width for better fitting
                height="32"
                className="content-loader custom-loader rounded"
              >
                <rect width="100%" height="32" />
              </ContentLoader>
            </div>
            <div className="loader loader-full">
              <ContentLoader
                width="90%" // Reduced width for better fitting
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

export default ProfilePagePlaceholder;
