import React, { SVGProps } from 'react';

function TimelineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" height={props?.height || 14} width={props?.width || 14}>
      <path d="M11.3051 9.84795V10.4546C11.3051 11.3821 10.9551 11.7555 10.0684 11.7555H3.13843V8.54712H10.0684C10.9551 8.54712 11.3051 8.92045 11.3051 9.84795Z" fill="var(--bs-primary)" />
      <path d="M8.38843 4.88964V5.49631C8.38843 6.42381 8.03259 6.79714 7.15176 6.79714H3.13843V3.58881H7.15176C8.03259 3.58881 8.38843 3.96214 8.38843 4.88964Z" fill="var(--bs-primary)" />
      <path d="M3.13831 13.3597C2.89914 13.3597 2.70081 13.1613 2.70081 12.9222V2.13049C2.69498 1.88549 2.89331 1.69299 3.13831 1.69299C3.38331 1.69299 3.57581 1.89133 3.57581 2.13049V12.9222C3.56998 13.1613 3.37748 13.3597 3.13831 13.3597Z" fill="var(--bs-primary)" />
    </svg>

  );
}

export default TimelineIcon;
