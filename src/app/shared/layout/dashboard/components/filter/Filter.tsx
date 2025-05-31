import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { FilterIcon } from '@shared/icons';

function Filter() {
  const i18n = useTranslation('navbar');
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  return isSmScreen ? (
    <Button
      color="link"
      size="sm"
    >
      <FilterIcon />
    </Button>
  ) : (
    <Button
      size="sm"
      className="btn-filter fw-normal"
    >
      {i18n.label.filters}
      <FilterIcon className="ms-1" />
    </Button>
  );
}

export default Filter;
