import React, { SVGProps } from 'react';

function TimelinePinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="38" height="39" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#filter0_f_402_66540)">
        <circle cx="19" cy="19.5263" r="15" fill="var(--bs-primary)" fillOpacity="0.2" />
      </g>
      <circle cx="19" cy="19.5263" r="10" fill="var(--bs-primary)" />
      <defs>
        <filter id="filter0_f_402_66540" x="0" y="0.526306" width="38" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_402_66540" />
        </filter>
      </defs>
    </svg>
  );
}

export default TimelinePinIcon;
