import React from 'react';

import Verified from '@shared/icons/Verified';

import './CoverPhoto.scss';

interface CoverPhotoObject {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
}

interface CoverPhotoProps {
  verifiedAt?: Date;
  coverPhoto?: CoverPhotoObject;
}

function CoverPhoto({ coverPhoto, verifiedAt }: CoverPhotoProps) {
  const getCoverPhoto = () => {
    const width = window.innerWidth;

    if (width >= 320) {
      return coverPhoto?.xs;
    }

    if (width >= 520) {
      return coverPhoto?.sm;
    }

    if (width >= 1200) {
      return coverPhoto?.md;
    }

    if (width < 1200) {
      return coverPhoto?.lg;
    }

    return undefined;
  };

  return (
    <div className="cover-photo">
      <img height={182} src={getCoverPhoto()} alt="" className="image" />

      {verifiedAt !== null && <Verified />}
    </div>
  );
}

export default CoverPhoto;
