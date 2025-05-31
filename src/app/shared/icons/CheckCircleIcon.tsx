import React, { SVGProps } from 'react';

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 11.401C8.75 11.401 11 9.15105 11 6.40105C11 3.65105 8.75 1.40105 6 1.40105C3.25 1.40105 1 3.65105 1 6.40105C1 9.15105 3.25 11.401 6 11.401Z" stroke="var(--bs-disabled-text)" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.875 6.40105L5.29 7.81605L8.125 4.98605" stroke="var(--bs-disabled-text)" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default CheckCircleIcon;
