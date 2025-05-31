import React from 'react';

import Card from './Card';
import { Pin } from '../../../components/pin';

import './Bio.scss';

interface BioCardProps {
  id: string;
  bio: string;
  started_at: Date;
  ended_at: Date;
}

function Bio({ ...rest }: BioCardProps) {
  return (
    <div className="organization-bio-container">
      <Pin height={500} />

      <Card {...rest} />
    </div>
  );
}

export default Bio;
