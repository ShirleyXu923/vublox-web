/**
 * A standard custom button with loading if loading is true
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

function CustomButton({
  children,
  loading,
  disabled,
  className,
  shadow,
  btnRef,
  ...rest
}) {
  return (
    <Button
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      className={classNames('btn-multiple-state', className, {
        'show-spinner': loading,
        'btn-shadow': shadow,
      })}
      // if loading is defined override disable
      disabled={loading || disabled}
      ref={btnRef}
    >
      <span className="spinner d-inline-block">
        <span className="bounce1" />
        <span className="bounce2" />
        <span className="bounce3" />
      </span>
      <span className="label">
        {children}
      </span>
    </Button>
  );
}

CustomButton.defaultProps = {
  children: null,
  loading: false,
  disabled: false,
  shadow: true,
  className: '',
  btnRef: null,
};

CustomButton.propTypes = {
  children: PropTypes.any,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  shadow: PropTypes.bool,
  className: PropTypes.string,
  btnRef: PropTypes.any,
};

export default CustomButton;
