import classNames from 'classnames';
// import mime from 'mime';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from 'reactstrap';

import { useMediaPreviewModal } from '@app/providers/share-provider/ShareProvider';
import useAppTheme from '@shared/hooks/useAppTheme';
import { PlayIcon } from '@shared/icons';

import './PreviewMedia.scss';

interface PreviewMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  mediaType: string;
  previewImage?: {
    sm: string;
    md: string;
    lg: string;
  };
  videoSrc?: string;
}

function PreviewMedia(props: PreviewMediaProps) {
  const {
    previewImage, videoSrc, className, mediaType, width, height,
  } = props;
  const { toggle, setData } = useMediaPreviewModal();
  const { logo } = useAppTheme();
  const isLgScreen = useMediaQuery({ query: '(min-width: 1200px)' });
  const img = isLgScreen ? previewImage?.md : previewImage?.sm;

  const handlePlay = () => {
    setData({
      media_url: videoSrc,
      media_type: mediaType,
    });
    toggle(true);
  };

  return (
    <div className="h-100 w-100 preview-media-container">
      {mediaType?.startsWith?.('video') && videoSrc && (
        <div className="btn-play-container">
          <Button onClick={() => handlePlay()} className="bg-transparent">
            <PlayIcon
              width={+(width || 160) / 2}
              height={+(height || 160) / 2}
              className="icon-play"
            />
          </Button>
        </div>
      )}

      <img
        src={img || logo}
        alt="Preview"
        className={classNames(className, {
          'preview-logo': !previewImage,
        })}
      />
    </div>
  );
}

export default PreviewMedia;
