/* eslint-disable react/destructuring-assignment */
import React, { SVGProps } from 'react';

function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.16748 18.26L14.1441 12.2833C14.85 11.5775 14.85 10.4225 14.1441 9.71666L8.16748 3.73999" stroke={props.stroke || 'var(--bs-primary)'} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default ChevronRightIcon;
