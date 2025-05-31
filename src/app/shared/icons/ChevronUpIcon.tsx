import React, { SVGProps } from 'react';

function ChevronUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16.5999 12.5417L11.1666 7.10833C10.5249 6.46666 9.4749 6.46666 8.83324 7.10833L3.3999 12.5417" stroke="var(--bs-body-color)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default ChevronUpIcon;
