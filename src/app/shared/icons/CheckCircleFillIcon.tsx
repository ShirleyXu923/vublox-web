import React, { SVGProps } from 'react';

function CheckCircleFillIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="6" cy="6.40105" r="5" fill="var(--bs-success)" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6 11.401C8.76142 11.401 11 9.16247 11 6.40105C11 3.63962 8.76142 1.40105 6 1.40105C3.23858 1.40105 1 3.63962 1 6.40105C1 9.16247 3.23858 11.401 6 11.401ZM6 11.401C8.755 11.401 11 9.15605 11 6.40105C11 3.64605 8.755 1.40105 6 1.40105C3.245 1.40105 1 3.64605 1 6.40105C1 9.15605 3.245 11.401 6 11.401ZM5.555 8.08605L8.39 5.25105C8.535 5.10105 8.535 4.86605 8.39 4.72105C8.245 4.57605 8.005 4.57605 7.86 4.72105L5.29 7.29105L4.14 6.14105C3.995 5.99605 3.755 5.99605 3.61 6.14105C3.465 6.28605 3.465 6.52605 3.61 6.67105L5.025 8.08605C5.095 8.15605 5.19 8.19605 5.29 8.19605C5.39 8.19605 5.485 8.15605 5.555 8.08605Z" fill="var(--bs-body-color)" />
    </svg>
  );
}

export default CheckCircleFillIcon;
