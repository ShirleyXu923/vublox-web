import React, { SVGProps } from 'react';

function SocialFacebookIcon({ fill, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M34.2547 17.1274C34.2547 7.66818 26.5866 0 17.1274 0C7.66818 0 0 7.66818 0 17.1274C0 25.676 6.2632 32.7618 14.4512 34.0467V22.0783H10.1025V17.1274H14.4512V13.354C14.4512 9.06145 17.0083 6.69038 20.9205 6.69038C22.7938 6.69038 24.7544 7.0249 24.7544 7.0249V11.2398H22.5947C20.4672 11.2398 19.8035 12.5602 19.8035 13.916V17.1274H24.5537L23.7943 22.0783H19.8035V34.0467C27.9915 32.7618 34.2547 25.676 34.2547 17.1274Z" fill={fill || 'var(--bs-secondary-text)'} />
    </svg>
  );
}

export default SocialFacebookIcon;
