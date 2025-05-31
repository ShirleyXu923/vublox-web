import React from 'react';

import './ResultCard.scss';
import { withTimeZone } from '@shared/helpers';
import PersonalCard from '@shared/icons/PersonalCard';

interface ResultCardProps {
  title?: string | null;
  description?: string | null;
  location?: string | null;
  date?: any | null;
  label?: string | null
  selected?: boolean;
  onClick?: () => void;
}

function ResultCard({
  title,
  description,
  location,
  date,
  label,
  selected,
  onClick,
}: ResultCardProps) {
  return (
    <div
      className={`result-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="b2">{title}</div>
      <p className="b5">{description}</p>
      <small className="caption1">{location} {withTimeZone(date)}</small>
      <div className="actions">
        <div className="badges">
          <PersonalCard />
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
