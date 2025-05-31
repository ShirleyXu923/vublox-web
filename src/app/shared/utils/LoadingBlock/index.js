import PropTypes from 'prop-types';
import React from 'react';
import './style.scss';

function LoadingBlock({ enabled }) {
  if (enabled) {
    return (
      <div className="loading-backdrop">
        <div className="loading" />
      </div>
    );
  }

  return null;
}

LoadingBlock.defaultProps = {
  enabled: false,
};

LoadingBlock.propTypes = {
  enabled: PropTypes.bool,
};

export default LoadingBlock;
