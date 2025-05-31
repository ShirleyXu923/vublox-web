import React from 'react';

import Card from './Card';
import { Pin } from '../../../components/pin';

import './Name.scss';

interface NameCardProps {
  id?: string;
  name?: string;
  started_at: Date;
  ended_at: Date;
}

function Name({ ...rest }: NameCardProps) {
  return (
    <div className="organization-name-container">
      <Pin height={500} />

      <Card {...rest} />
    </div>
  );
}

export default Name;
