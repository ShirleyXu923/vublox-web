import React from 'react';

import './ImagePlaceholder.scss';
import useAppTheme from '@shared/hooks/useAppTheme';

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  className?: string | undefined;
}

function ImagePlaceholder({ width = '60%', height = '100%', className = '' }: ImagePlaceholderProps) {
  const { logo } = useAppTheme();
  return (
    <div
      className={`image-placeholder ${className}`}
    >
      <img src={logo} width={width} height={height} alt="Event" />
    </div>
  );
}

export default ImagePlaceholder;
