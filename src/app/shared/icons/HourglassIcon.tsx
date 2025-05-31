import React, { SVGProps } from 'react';

function HourglassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.9165 12.8333H11.0832" stroke="#41434D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.9165 1.16669H11.0832" stroke="#41434D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.91683 12.8333V10.3997C9.91676 10.0903 9.7938 9.79357 9.575 9.57483L7.00016 7L4.42533 9.57483C4.20652 9.79357 4.08356 10.0903 4.0835 10.3997V12.8333" stroke="#41434D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.0835 1.16669V3.60035C4.08356 3.90975 4.20652 4.20645 4.42533 4.42519L7.00016 7.00002L9.575 4.42519C9.7938 4.20645 9.91676 3.90975 9.91683 3.60035V1.16669" stroke="#41434D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  );
}

export default HourglassIcon;
