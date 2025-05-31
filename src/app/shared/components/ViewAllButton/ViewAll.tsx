import React from 'react';
import { NavLink } from 'react-router-dom';

import useTranslation from '@shared/hooks/useTranslation';
import { ArrowRightIcon } from '@shared/icons';

import './ViewAll.scss';

interface ViewAllProps {
  navigateTo: string;
}

function ViewAll({
  navigateTo,
}: ViewAllProps) {
  const i18n = useTranslation('home');

  return (
    <NavLink to={navigateTo}>
      <div className="view-all">
        {i18n.button.viewAll} <ArrowRightIcon className="ms-2" />
      </div>
    </NavLink>
  );
}

export default ViewAll;
