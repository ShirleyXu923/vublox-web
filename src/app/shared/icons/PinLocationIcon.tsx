import React, { SVGProps } from 'react';

function PinLocationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="37" height="42" viewBox="0 0 37 42" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#filter0_d_251_208763)">
        <path d="M31.43 14.675C29.855 7.745 23.81 4.625 18.5 4.625C18.5 4.625 18.5 4.625 18.485 4.625C13.19 4.625 7.13002 7.73 5.55502 14.66C3.80002 22.4 8.54002 28.955 12.83 33.08C14.42 34.61 16.46 35.375 18.5 35.375C20.54 35.375 22.58 34.61 24.155 33.08C28.445 28.955 33.185 22.415 31.43 14.675ZM18.5 22.19C15.89 22.19 13.775 20.075 13.775 17.465C13.775 14.855 15.89 12.74 18.5 12.74C21.11 12.74 23.225 14.855 23.225 17.465C23.225 20.075 21.11 22.19 18.5 22.19Z" fill="var(--bs-primary)" />
      </g>
      <defs>
        <filter id="filter0_d_251_208763" x="0.280054" y="0.725" width="36.4249" height="40.55" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="2.45" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_251_208763" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_251_208763" result="shape" />
        </filter>
      </defs>
    </svg>

  );
}

export default PinLocationIcon;
