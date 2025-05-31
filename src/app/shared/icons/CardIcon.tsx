import React, { SVGProps } from 'react';

function CardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.25 13.19H8.75C9.71833 13.19 10.5 12.4084 10.5 11.44V3.27338C10.5 2.30504 9.71833 1.52338 8.75 1.52338H5.25C4.28167 1.52338 3.5 2.30504 3.5 3.27338V11.44C3.5 12.4084 4.28167 13.19 5.25 13.19Z" fill="var(--bs-yellow)" />
    </svg>
  );
}

export default CardIcon;
