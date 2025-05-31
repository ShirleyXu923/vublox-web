import React from 'react';

import { ImageType } from 'types';

import Card from './Card';
import { Pin } from '../../../components/pin';

import './Logo.scss';

interface LogoProps {
  logo?: ImageType;
  started_at: Date;
  ended_at: Date;
}

function Logo({ ...rest }: LogoProps) {
  return (
    <div className="organization-logo-container">
      <Pin height={500} />

      <Card {...rest} />
    </div>
  );
}

export default Logo;
