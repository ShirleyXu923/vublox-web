import React from 'react';
import ContentLoader from 'react-content-loader';
import { Card, CardBody } from 'reactstrap';

import './ItemCard.scss';

function ItemCardPlaceholder() {
  return (
    <Card className="item-card overflow-hidden">
      <ContentLoader
        width="500"
        height="185"
        viewBox="0 0 500 185"
        className="content-loader"
        style={{ width: '100%' }}
        preserveAspectRatio="none"
      >
        <rect width="500" height="185" />
      </ContentLoader>
      <CardBody>
        <ContentLoader
          width="150"
          height="20"
          viewBox="0 0 150 20"
          className="content-loader mb-1"
        >
          <rect width="150" height="20" />
        </ContentLoader>
        <ContentLoader
          width="200"
          height="18"
          viewBox="0 0 200 18"
          className="content-loader mb-2"
        >
          <rect width="200" height="18" />
        </ContentLoader>

        <div className="d-flex align-items-center">
          <ContentLoader
            width="26"
            height="26"
            viewBox="0 0 26 26"
            className="content-loader"
          >
            <rect rx={13} ry={13} width="26" height="26" />
          </ContentLoader>

          <div className="flex-fill ms-2">
            <ContentLoader
              width="200"
              height="16"
              viewBox="0 0 200 16"
              className="content-loader"
            >
              <rect width="200" height="16" />
            </ContentLoader><br />
            <ContentLoader
              width="150"
              height="14"
              viewBox="0 0 150 14"
              className="content-loader"
            >
              <rect width="150" height="14" />
            </ContentLoader>
          </div>
        </div>

        <div className="social mt-3">
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
      </CardBody>
    </Card>
  );
}

export default ItemCardPlaceholder;
