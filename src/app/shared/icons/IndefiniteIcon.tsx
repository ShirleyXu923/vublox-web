/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { SVGProps } from 'react';

function IndefiniteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.89 15.67L13.85 12H11.14L7.09998 15.67C5.96998 16.69 5.59998 18.26 6.14998 19.68C6.69998 21.09 8.03998 22 9.54998 22H15.44C16.96 22 18.29 21.09 18.84 19.68C19.39 18.26 19.02 16.69 17.89 15.67ZM14.32 18.14H10.68C10.3 18.14 9.99998 17.83 9.99998 17.46C9.99998 17.09 10.31 16.78 10.68 16.78H14.32C14.7 16.78 15 17.09 15 17.46C15 17.83 14.69 18.14 14.32 18.14Z" fill="var(--bs-secondary-text)" />
      <path d="M18.8502 4.32C18.3002 2.91 16.9602 2 15.4502 2H9.55016C8.04016 2 6.70016 2.91 6.15016 4.32C5.61016 5.74 5.98016 7.31 7.11016 8.33L11.1502 12H13.8602L17.9002 8.33C19.0202 7.31 19.3902 5.74 18.8502 4.32ZM14.3202 7.23H10.6802C10.3002 7.23 10.0002 6.92 10.0002 6.55C10.0002 6.18 10.3102 5.87 10.6802 5.87H14.3202C14.7002 5.87 15.0002 6.18 15.0002 6.55C15.0002 6.92 14.6902 7.23 14.3202 7.23Z" fill="var(--bs-secondary-text)" />
    </svg>
  );
}

export default IndefiniteIcon;
