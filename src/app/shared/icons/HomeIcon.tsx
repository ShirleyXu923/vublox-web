import React, { SVGProps } from 'react';

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.01331 2.39312L2.41998 5.19312C1.81998 5.65978 1.33331 6.65312 1.33331 7.40645V12.3464C1.33331 13.8931 2.59331 15.1598 4.13998 15.1598H11.86C13.4066 15.1598 14.6666 13.8931 14.6666 12.3531V7.49978C14.6666 6.69312 14.1266 5.65978 13.4666 5.19978L9.34665 2.31312C8.41331 1.65978 6.91331 1.69312 6.01331 2.39312Z" stroke="var(--bs-secondary-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12.4932V10.4932" stroke="var(--bs-secondary-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default HomeIcon;
