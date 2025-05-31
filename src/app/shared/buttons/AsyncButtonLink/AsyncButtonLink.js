import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'reactstrap';

import './AsyncButtonLink.scss';
/**
 * Button that display loading after click and revert the text after
 * completed running the function
 */
class AsyncButtonLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  async onClick(e) {
    e.preventDefault();

    const { onClick } = this.props;
    this.enableLoading();

    try {
      await onClick(e);
      this.disableLoading();
    } catch (error) {
      this.disableLoading();
    }
  }

  enableLoading = () => this.setState({ isLoading: true });

  disableLoading = () => this.setState({ isLoading: false });

  render() {
    const { isLoading } = this.state;
    const {
      children, btnRef, disabled,
      className, ...rest
    } = this.props;

    return (
      <Button
      // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        color="link"
        className={classNames('btn-multiple-state', className, { 'show-spinner': isLoading })}
        // if loading is defined override disable
        disabled={isLoading || disabled}
        ref={btnRef}
        onClick={(e) => this.onClick(e)}
      >
        <span className="spinner d-inline-block spinner-link">
          <span className="bounce1" />
          <span className="bounce2" />
          <span className="bounce3" />
        </span>
        {children}
      </Button>
    );
  }
}

AsyncButtonLink.defaultProps = {
  disabled: false,
  className: '',
  title: '',
  btnRef: null,
};

AsyncButtonLink.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  btnRef: PropTypes.any,
};

export default AsyncButtonLink;
