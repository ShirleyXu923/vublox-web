import React, { SVGProps } from 'react';

function SocialTwitterIcon({ fill, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18.2522 15.9211L11.5998 6.61292H8.05176L16.2923 18.1426L17.3296 19.593L24.383 29.4703H27.9311L19.2851 17.3715L18.2522 15.9211Z" fill={fill || 'var(--bs-secondary-text)'} />
      <path d="M32.9887 0H3.01125C1.34812 0 0 1.34812 0 3.01125V32.9887C0 34.6519 1.34812 36 3.01125 36H32.9887C34.6519 36 36 34.6519 36 32.9887V3.01125C36 1.34812 34.6519 0 32.9887 0ZM23.2942 31.0909L16.1555 20.9242L7.21872 31.0909H4.90909L15.1313 19.4651L4.90909 4.90909H12.7058L19.4642 14.5341L27.932 4.90909H30.2416L20.4938 15.9965L31.0909 31.0909H23.2942Z" fill={fill || 'var(--bs-secondary-text)'} />
    </svg>
  );
}

export default SocialTwitterIcon;
