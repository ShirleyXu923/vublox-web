import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CustomButton from '../CustomButton';

import './AsyncButton.scss';
/**
 * Button that display loading after click and revert the text after
 * completed running the function
 */
class AsyncButton extends Component {
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
      children, btnRef, ...rest
    } = this.props;

    return (
      <CustomButton
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        loading={isLoading}
        onClick={(e) => this.onClick(e)}
        btnRef={btnRef}
      >
        { children }
      </CustomButton>
    );
  }
}

AsyncButton.defaultProps = {
  disabled: false,
  className: '',
  title: '',
  btnRef: null,
};

AsyncButton.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  btnRef: PropTypes.any,
};

export default AsyncButton;
