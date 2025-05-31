import React from 'react';

function TimelinePin() {
  return (
    <svg className="pin-circle" width="38" height="39" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_f_5427_2275)">
        <circle cx="19" cy="19.6458" r="15" fill="var(--bs-primary)" fillOpacity="0.2" />
      </g>
      <circle cx="19" cy="19.6458" r="10" fill="var(--bs-primary)" />
      <defs>
        <filter id="filter0_f_5427_2275" x="0" y="0.645752" width="38" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_5427_2275" />
        </filter>
      </defs>
    </svg>

  );
}

export default TimelinePin;
