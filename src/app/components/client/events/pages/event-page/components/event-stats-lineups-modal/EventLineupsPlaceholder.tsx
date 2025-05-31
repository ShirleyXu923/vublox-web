import React from 'react';
import ContentLoader from 'react-content-loader';

function EventLineupsPlaceholder() {
  const renderLineup = (key: number) => (
    <div className="lineup my-3" key={key} style={{ width: '80%', margin: 'auto' }}>
      <ContentLoader
        width="100%"
        height="15"
        className="content-loader"
      >
        <rect width="100%" height="15" />
      </ContentLoader>
    </div>
  );
  return (
    <div>
      <div className="lineups mt-3">
        <div>
          {Array.from({ length: 6 }, (_, key) => renderLineup(key))}
        </div>
        <div>
          {Array.from({ length: 6 }, (_, key) => renderLineup(key))}
        </div>
      </div>

      <div className="lineups mt-4">
        <div>
          {Array.from({ length: 6 }, (_, key) => renderLineup(key))}
        </div>
        <div>
          {Array.from({ length: 6 }, (_, key) => renderLineup(key))}
        </div>
      </div>
    </div>
  );
}

export default EventLineupsPlaceholder;
