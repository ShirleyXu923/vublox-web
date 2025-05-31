import React from 'react';

import Verified from '@shared/icons/Verified';

interface TitleProps {
  name?: string;
  verifiedAt?: Date;
}

function Title({ name, verifiedAt }: TitleProps) {
  return (
    <div className="d-flex align-items-center title">
      <span className="b2">{ name }</span>
      {verifiedAt !== null && <Verified />}
    </div>
  );
}

export default Title;
