import React, { SVGProps } from 'react';

function LanguageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.99999 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 9.99999 1.66667C5.39762 1.66667 1.66666 5.39763 1.66666 10C1.66666 14.6024 5.39762 18.3333 9.99999 18.3333Z" fill="var(--bs-body-color)" stroke="var(--bs-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.66667 2.5H7.5C5.875 7.36667 5.875 12.6333 7.5 17.5H6.66667" fill="var(--bs-body-color)" />
      <path d="M6.66667 2.5H7.5C5.875 7.36667 5.875 12.6333 7.5 17.5H6.66667" stroke="var(--bs-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 2.5C14.125 7.36667 14.125 12.6333 12.5 17.5" stroke="var(--bs-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 13.3333V12.5C7.36667 14.125 12.6333 14.125 17.5 12.5V13.3333" stroke="var(--bs-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 7.5C7.36667 5.875 12.6333 5.875 17.5 7.5" stroke="var(--bs-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default LanguageIcon;
