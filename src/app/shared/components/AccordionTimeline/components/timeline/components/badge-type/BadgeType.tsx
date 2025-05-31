// BadgeType.tsx
import React from 'react';
import './BadgeType.scss';

export interface BadgeTypeProps {
  label?: string;
  icon?: React.ReactElement;
  fill?: 'primary' | 'success' | 'danger';
}

const backgroundColors = {
  primary: 'rgba(var(--bs-primary-rgb), 0.1)',
  success: 'rgba(var(--bs-success-rgb), 0.1)',
  danger: 'rgba(var(--bs-danger-rgb), 0.1)',
};

const textColors = {
  primary: 'var(--bs-primary)',
  success: 'var(--bs-success)',
  danger: 'var(--bs-danger)',
};

function BadgeType({ label, icon, fill = 'primary' }: BadgeTypeProps) {
  return (
    <div
      className="badge-container"
      style={{
        background: backgroundColors[fill],
        color: textColors[fill],
      }}
    >
      <div className="badge-type">
        {icon
          && React.cloneElement(icon, {
            style: { fill: textColors[fill] },
          })}
        <span className="badge1">{label}</span>
      </div>
    </div>
  );
}

export default BadgeType;
