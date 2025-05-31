import React, { SVGProps } from 'react';

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.21517 14C11.713 14 14.5485 11.1645 14.5485 7.66671C14.5485 4.1689 11.713 1.33337 8.21517 1.33337C4.71737 1.33337 1.88184 4.1689 1.88184 7.66671C1.88184 11.1645 4.71737 14 8.21517 14Z" stroke="var(--bs-secondary-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.2152 14.6667L13.8818 13.3334" stroke="var(--bs-secondary-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default SearchIcon;
