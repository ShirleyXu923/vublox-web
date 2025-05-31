import React, { SVGProps } from 'react';

function RadioSelectedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1.50008" y="1.49996" width="15" height="15" rx="7.5" fill="var(--bs-secondary)" />
      <rect x="1.50008" y="1.49996" width="15" height="15" rx="7.5" stroke="var(--bs-primary)" strokeWidth="1.66667" />
      <circle cx="8.99992" cy="8.99992" r="4.16667" fill="var(--bs-primary)" />
    </svg>
  );
}

export default RadioSelectedIcon;
