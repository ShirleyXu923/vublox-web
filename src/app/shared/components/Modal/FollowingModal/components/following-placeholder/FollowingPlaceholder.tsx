import React from 'react';
import ContentLoader from 'react-content-loader';

function FollowingPlaceholder() {
  return (
    <>
      <div className="item">
        <ContentLoader
          width="35"
          height="35"
          viewBox="0 0 35 35"
          preserveAspectRatio="none"
          className="content-loader"
        >
          <rect width="35" height="35" rx={100} ry={100} />
        </ContentLoader>
        <div className="flex-fill">
          <ContentLoader
            width="200"
            height="17"
            viewBox="0 0 200 17"
            preserveAspectRatio="none"
            className="content-loader"
          >
            <rect width="200" height="17" />
          </ContentLoader>
        </div>
      </div>
      <div className="item">
        <ContentLoader
          width="35"
          height="35"
          viewBox="0 0 35 35"
          preserveAspectRatio="none"
          className="content-loader"
        >
          <rect width="35" height="35" rx={100} ry={100} />
        </ContentLoader>
        <div className="flex-fill">
          <ContentLoader
            width="225"
            height="17"
            viewBox="0 0 225 17"
            preserveAspectRatio="none"
            className="content-loader"
          >
            <rect width="225" height="17" />
          </ContentLoader>
        </div>
      </div>
      <div className="item">
        <ContentLoader
          width="35"
          height="35"
          viewBox="0 0 35 35"
          preserveAspectRatio="none"
          className="content-loader"
        >
          <rect width="35" height="35" rx={100} ry={100} />
        </ContentLoader>
        <div className="flex-fill">
          <ContentLoader
            width="160"
            height="17"
            viewBox="0 0 160 17"
            preserveAspectRatio="none"
            className="content-loader"
          >
            <rect width="160" height="17" />
          </ContentLoader>
        </div>
      </div>
    </>
  );
}

export default FollowingPlaceholder;
