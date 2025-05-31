/* eslint-disable react/destructuring-assignment */
import React, { SVGProps } from 'react';

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9 1.90105C7.035 1.90105 5.4375 3.49855 5.4375 5.46355C5.4375 7.39105 6.945 8.95105 8.91 9.01855C8.97 9.01105 9.03 9.01105 9.075 9.01855C9.09 9.01855 9.0975 9.01855 9.1125 9.01855C9.12 9.01855 9.12 9.01855 9.1275 9.01855C11.0475 8.95105 12.555 7.39105 12.5625 5.46355C12.5625 3.49855 10.965 1.90105 9 1.90105Z" fill={props.fill || 'var(--bs-secondary-text)'} />
      <path d="M12.81 11.0136C10.7175 9.61855 7.305 9.61855 5.1975 11.0136C4.245 11.6511 3.72 12.5135 3.72 13.436C3.72 14.3585 4.245 15.2136 5.19 15.8436C6.24 16.5486 7.62 16.9011 9 16.9011C10.38 16.9011 11.76 16.5486 12.81 15.8436C13.755 15.2061 14.28 14.3511 14.28 13.4211C14.2725 12.4986 13.755 11.6436 12.81 11.0136Z" fill={props.fill || 'var(--bs-secondary-text)'} />
    </svg>
  );
}

export default UserIcon;
