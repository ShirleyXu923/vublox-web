import React from 'react';
import ContentLoader from 'react-content-loader';
import './TimelineLoader.scss';

// Inner Child
function TimelineChildSection() {
  return (
    <div className="card-wrapper">
      <div className="d-flex gap-2">
        <div className="mx-3 mt-3">
          <ContentLoader
            width={120}
            height={80}
            className="content-loader"
            style={{ borderRadius: '18px' }}
          >
            <rect width="120" height="80" />
          </ContentLoader>
        </div>

        <div className="mt-3">
          <ContentLoader
            width={700}
            height={20}
            className="content-loader"
          >
            <rect width="400" height="20" />
          </ContentLoader>

          <ContentLoader
            width={500}
            height={10}
            className="content-loader mt-2"
          >
            <rect width="500" height="10" />
          </ContentLoader>

          <ContentLoader
            width={500}
            height={10}
            className="content-loader mt-4"
          >
            <rect width="20" height="10" />
          </ContentLoader>
        </div>
      </div>
    </div>
  );
}

function TimelineLoader() {
  return (
    <div>
      <div>
        <div className="my-4">
          <TimelineChildSection />
        </div>
        <div className="my-4" style={{ marginLeft: '24px' }}>
          <TimelineChildSection />
        </div>
        <div className="my-4" style={{ marginLeft: '24px' }}>
          <TimelineChildSection />
        </div>
        <div className="my-4" style={{ marginLeft: '24px' }}>
          <TimelineChildSection />
        </div>
      </div>
    </div>
  );
}

export default TimelineLoader;
