import PropTypes from 'prop-types';
import React from 'react';

import LocaleService from '@services/LocaleService';

import CustomButton from './CustomButton';

const i18n = LocaleService.getTranslations('general.button.view');

function ViewButton({
  children,
  onClick,
  title,
  className,
  loading,
  disabled,
}) {
  return (
    <CustomButton
      color="dark"
      size="sm"
      outline
      title={title || i18n.title}
      loading={loading}
      className={className}
      onClick={(event) => onClick(event)}
      disabled={disabled}
    >
      {children || i18n.name}
    </CustomButton>
  );
}

ViewButton.defaultProps = {
  children: null,
  onClick: () => {},
  title: null,
  className: '',
  loading: false,
  disabled: false,
};

ViewButton.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ViewButton;
