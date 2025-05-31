import React from 'react';
import ContentLoader from 'react-content-loader';

function EventStatsPlaceholder() {
  return (
    <div className="mt-5">
      {Array.from({ length: 6 }, (_, key) => (
        <div className="stats" key={key}>
          <div className="stats-item mb-5">
            <div className="stats-value">
              <ContentLoader
                width="40"
                height="15"
                className="content-loader"
              >
                <rect width="40" height="15" />
              </ContentLoader>
            </div>

            <ContentLoader
              width="100%"
              height="8"
              className="content-loader"
            >
              <rect rx={4} ry={4} width="100%" height="8" />
            </ContentLoader>

            <div className="stats-value">
              <ContentLoader
                width="40"
                height="15"
                className="content-loader"
              >
                <rect width="40" height="15" />
              </ContentLoader>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventStatsPlaceholder;
