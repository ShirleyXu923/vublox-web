import React from 'react';

import Verified from '@shared/icons/Verified';

interface LogoObject {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
}

interface ILogo {
  logo?: LogoObject;
  verifiedAt?: Date;
}

function Logo({ logo, verifiedAt }: ILogo) {
  const getLogo = () => {
    const width = window.innerWidth;

    if (width >= 320) {
      return logo?.xs;
    }

    if (width >= 520) {
      return logo?.sm;
    }

    if (width >= 1200) {
      return logo?.md;
    }

    if (width < 1200) {
      return logo?.lg;
    }

    return undefined;
  };

  return (
    <div className="logo">
      <img height={150} width={150} src={getLogo()} alt="" className="image" />
      {verifiedAt !== null && <Verified />}
    </div>
  );
}

export default Logo;
