/* eslint-disable react/destructuring-assignment */
import React, { SVGProps } from 'react';

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.5 2C5.3675 2 2 5.3675 2 9.5C2 13.6325 5.3675 17 9.5 17C13.6325 17 17 13.6325 17 9.5C17 5.3675 13.6325 2 9.5 2ZM12.7625 12.1775C12.6575 12.3575 12.47 12.455 12.275 12.455C12.1775 12.455 12.08 12.4325 11.99 12.3725L9.665 10.985C9.0875 10.64 8.66 9.8825 8.66 9.215V6.14C8.66 5.8325 8.915 5.5775 9.2225 5.5775C9.53 5.5775 9.785 5.8325 9.785 6.14V9.215C9.785 9.485 10.01 9.8825 10.2425 10.0175L12.5675 11.405C12.8375 11.5625 12.9275 11.9075 12.7625 12.1775Z" fill="var(--bs-secondary-text)" />
    </svg>
  );
}

export default ClockIcon;
