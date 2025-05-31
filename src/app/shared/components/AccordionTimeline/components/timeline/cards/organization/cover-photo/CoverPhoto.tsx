import React from 'react';

import { ImageType } from 'types';

import Card from './Card';
import { Pin } from '../../../components/pin';

import './CoverPhoto.scss';

interface CoverPhotoProps {
  cover_photo?: ImageType;
  started_at: Date;
  ended_at: Date;
}

function CoverPhoto({ ...rest }: CoverPhotoProps) {
  return (
    <div className="organization-cover-photo-container">
      <Pin height={500} />

      <Card {...rest} />
    </div>
  );
}

export default CoverPhoto;
