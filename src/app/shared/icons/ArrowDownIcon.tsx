import React, { SVGProps } from 'react';

function ArrowDownIcon({ width = 20, height = 20, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13.28 6.60693L8.9333 10.9536C8.41997 11.4669 7.57997 11.4669 7.06664 10.9536L2.71997 6.60693" stroke={props.stroke ? props.stroke : 'var(--bs-primary)'} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default ArrowDownIcon;
