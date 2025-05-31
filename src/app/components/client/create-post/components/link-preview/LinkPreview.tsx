import React from 'react';
import {
  Button,
  Card, CardBody, CardImg, CardTitle,
} from 'reactstrap';

import { CloseIcon, PlayIcon } from '@shared/icons';
import './LinkPreview.scss';

interface LinkPreviewProps {
  metadata: any;
  onRemove?: () => void;
}

function LinkPreview({ metadata, onRemove }: LinkPreviewProps) {
  return metadata ? (
    <div className="link-preview">
      {onRemove && (
        <Button
          color="danger"
          size="sm"
          onClick={onRemove}
        >
          <CloseIcon height="18" width="18" />
        </Button>
      )}
      <Card>
        {metadata['og:image'] && (
          <div className="position-relative">
            <CardImg
              src={metadata['og:image']}
              top
            />
            {metadata['og:type']?.startsWith('video') && (
              <div className="play-icon">
                <PlayIcon width="70" height="70" />
              </div>
            )}
          </div>
        )}
        <CardBody>
          <small className="text-muted text-uppercase">
            {metadata.domain}
          </small>
          <CardTitle className="mb-0">
            {metadata.title}
          </CardTitle>
        </CardBody>
      </Card>
    </div>
  ) : null;
}

export default LinkPreview;
