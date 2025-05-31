import React from 'react';
import ContentLoader from 'react-content-loader';

// Timeline Card
function TimelineHeaderSection() {
  return (
    <ContentLoader
      width={900}
      height={80}
      className="content-loader"
      style={{ width: '100%' }}
      preserveAspectRatio="none"
      viewBox="0 0 900 80"
    >
      <rect x="0" y="15" rx="5" ry="5" width="900" height="50" />
    </ContentLoader>
  );
}

// Inner Child
function TimelineChildSection() {
  return (
    <ContentLoader
      width={900}
      height={220}
      className="content-loader"
      style={{ width: '100%' }}
      preserveAspectRatio="none"
      viewBox="0 0 900 220"
    >
      <rect x="70" y="15" rx="5" ry="5" width="900" height="200" />
    </ContentLoader>
  );
}

function TimelineLoader() {
  return (
    <div>
      <TimelineHeaderSection />
      <TimelineChildSection />
      <TimelineChildSection />
      <TimelineHeaderSection />
      <TimelineChildSection />
      <TimelineChildSection />
    </div>
  );
}

export default TimelineLoader;
