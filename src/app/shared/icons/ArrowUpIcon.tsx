import React, { SVGProps } from 'react';

function ArrowUpIcon({ width = 15, height = 15, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16.5999 12.5418L11.1666 7.10845C10.5249 6.46678 9.4749 6.46678 8.83324 7.10845L3.3999 12.5418" stroke={props.stroke ? props.stroke : 'var(--bs-primary)'} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default ArrowUpIcon;
