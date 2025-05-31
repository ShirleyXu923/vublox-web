import React, { SVGProps } from 'react';

function ArabicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_5024_178769)">
        <path d="M32 0H0V8H32V0Z" fill="black" />
        <path d="M32 8H0V16H32V8Z" fill="#007A3D" />
        <path d="M32 16H0V24H32V16Z" fill="white" />
        <path d="M0 0L12 12L0 24V0Z" fill="#CE1126" />
      </g>
      <defs>
        <clipPath id="clip0_5024_178769">
          <rect width="32" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default ArabicIcon;
