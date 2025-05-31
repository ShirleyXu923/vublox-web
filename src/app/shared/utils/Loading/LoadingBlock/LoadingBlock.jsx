/**
 * JBlitz Standard Load Block
 */
import PropTypes from 'prop-types';
import React from 'react';
import { ClipLoader } from 'react-spinners';

import './LoadingBlock.scss';

function LoadingBlock({ show }) {
  return (
    <div className="sweet-loading">
      <ClipLoader
        className="clip-loader"
        sizeUnit="px"
        size={60}
        color="#00ab64"
        loading={show}
      />
    </div>
  );
}

LoadingBlock.defaultProps = {
  show: true,
};

LoadingBlock.propTypes = {
  show: PropTypes.bool,
};

export default LoadingBlock;
