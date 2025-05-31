import React, { SVGProps } from 'react';

function RouteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M17.195 3.81748L13.7724 14.8457C12.9534 17.4639 9.28216 17.5078 8.4192 14.9043L7.39536 11.8766C7.11746 11.0429 6.45927 10.3701 5.62557 10.1068L2.58329 9.08296C-0.00557292 8.22 0.038305 4.51955 2.65642 3.72973L13.6847 0.292529C15.8494 -0.365657 17.8825 1.66741 17.195 3.81748Z" fill="var(--bs-white)" />
    </svg>
  );
}

export default RouteIcon;
