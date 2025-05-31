import PropTypes from 'prop-types';
import React from 'react';

import LocaleService from '@services/LocaleService';

import CustomButton from './CustomButton';

const i18n = LocaleService.getTranslations('general.button.cancel');

function CancelButton({
  children,
  onClick,
  title,
  className,
  loading,
  disabled,
}) {
  return (
    <CustomButton
      color="secondary"
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

CancelButton.defaultProps = {
  children: null,
  onClick: () => {},
  title: null,
  className: '',
  loading: false,
  disabled: false,
};

CancelButton.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CancelButton;
