import React from 'react';
// import PropTypes from 'prop-types';
// import classnames from 'classnames';

import packageJson from '@root/package.json';

import './VersionDisplayStyle.scss';

function VersionDisplay({
  ...rest
}) {
  return (
    <span {...rest}>
      v
      {packageJson.version}
    </span>
  );
}

VersionDisplay.propTypes = {

};

VersionDisplay.defaultProps = {

};

export default VersionDisplay;
