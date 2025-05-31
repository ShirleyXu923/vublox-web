import React, { SVGProps } from 'react';

function FrenchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 0H32V24H0V0Z" fill="black" />
      <path fillRule="evenodd" clipRule="evenodd" d="M22 0H32V24H22V0Z" fill="#F50100" />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0H12V24H0V0Z" fill="#2E42A5" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10 0H22V24H10V0Z" fill="#F7FCFF" />
    </svg>
  );
}

export default FrenchIcon;
