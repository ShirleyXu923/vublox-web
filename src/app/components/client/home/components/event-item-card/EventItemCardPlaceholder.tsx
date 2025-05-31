import ContentLoader from 'react-content-loader';
import { useMediaQuery } from 'react-responsive';

import './EventItemCard.scss';

const posts = Array(6).fill(null);

function EventItemCardPlaceholder() {
  const isSmScreen = useMediaQuery({ query: '(max-width: 575px)' });
  return (
    <div className="event-item-card mb-3">
      <div className="details">
        <div className="flex-fill">
          <ContentLoader
            width="150"
            height="24"
            viewBox="0 0 150 24"
            className="content-loader"
          >
            <rect width="150" height="24" />
          </ContentLoader>
          <div>
            <ContentLoader
              width="250"
              height="16"
              viewBox="0 0 250 16"
              className="content-loader"
            >
              <rect width="250" height="16" />
            </ContentLoader>
          </div>
          <div>
            <ContentLoader
              width="200"
              height="16"
              viewBox="0 0 200 16"
              className="content-loader"
            >
              <rect width="200" height="16" />
            </ContentLoader>
          </div>
        </div>
      </div>

      <hr className="mt-2 mb-1" />

      <div
        className={`post-slider  ${isSmScreen ? 'p-2 pt-1' : ''}`}
        style={{ gap: '20px', marginLeft: isSmScreen ? '4px' : '0px', padding: !isSmScreen ? '14px 20px' : '' }}
      >
        {posts.map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
          <div className="post-card" key={i}>
            <ContentLoader
              width={isSmScreen ? '200' : '342'}
              height={isSmScreen ? '145' : '215'}
              viewBox={`0 0 ${isSmScreen ? '200' : '342'} ${isSmScreen ? '145' : '215'}`}
              className="content-loader"
              style={{ width: '100%' }}
              preserveAspectRatio="none"
            >
              <rect rx={10} ry={10} width={isSmScreen ? '200' : '342'} height={isSmScreen ? '145' : '215'} />
            </ContentLoader>
            <div className="content">
              <ContentLoader
                width="144"
                height="16"
                viewBox="0 0 200 16"
                className="content-loader"
              >
                <rect width="200" height="16" />
              </ContentLoader>
              <ContentLoader
                width="200"
                height="14"
                viewBox="0 0 250 14"
                className="content-loader"
              >
                <rect width="250" height="14" />
              </ContentLoader>

              <div className="organization">
                <ContentLoader
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  className="content-loader"
                >
                  <rect rx={13} ry={13} width="26" height="26" />
                </ContentLoader>

                <div>
                  <ContentLoader
                    width="150"
                    height="16"
                    viewBox="0 0 200 16"
                    className="content-loader"
                  >
                    <rect width="200" height="16" />
                  </ContentLoader><br />
                  <ContentLoader
                    width="120"
                    height="14"
                    viewBox="0 0 150 14"
                    className="content-loader"
                  >
                    <rect width="150" height="14" />
                  </ContentLoader>
                </div>
              </div>
              <div className="social">
                <ContentLoader
                  width="60"
                  height="16"
                  viewBox="0 0 60 16"
                  className="content-loader"
                >
                  <rect width="200" height="16" />
                </ContentLoader>
                <div className="flex-fill" />

                <ContentLoader
                  width="60"
                  height="16"
                  viewBox="0 0 60 16"
                  className="content-loader"
                >
                  <rect width="60" height="16" />
                </ContentLoader><br />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default EventItemCardPlaceholder;
