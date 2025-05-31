import React from 'react';

import Verified from '@shared/icons/Verified';

interface BioProps {
  bio?: string;
  verifiedAt?: Date;
}

function Bio({ bio, verifiedAt }: BioProps) {
  return (
    <div className="d-flex align-items-center bio">
      <p className="b6">{ bio }</p>
      {verifiedAt !== null && <Verified />}
    </div>
  );
}

export default Bio;
