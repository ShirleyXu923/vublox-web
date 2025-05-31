import classNames from 'classnames';
import React from 'react';

import './Alert.scss';

interface AlertProps {
  label?: string | React.ReactNode; // Accepts both string and React.ReactNode
  icon?: React.ReactNode;
  hasMaxWidth?: boolean;
  className?: string;
}

function Alert({
  label, icon, hasMaxWidth, className,
}: AlertProps) {
  return (
    <div className={classNames('alert-notif flex my-4', className)}>
      {icon}
      <span className={`b5 ${hasMaxWidth ? 'max-width' : ''}`}>
        {label}
      </span>
    </div>
  );
}

export default Alert;
