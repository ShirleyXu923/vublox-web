import React, { useState } from 'react';
import { Badge, Button, Card } from 'reactstrap';

import { DeleteModal } from '@shared/components/Modal/delete-modal';
import { CloseIcon } from '@shared/icons';

type LocationItemType = {
  id: string;
};

type LocationType = {
  id: string;
  name: string;
  address: string;
};

type LocationOptionItemProps = {
  location: LocationType;
  item: LocationItemType;
  onRemove: (id: string) => void;
  isCustom?: boolean;
};

function LocationOptionItem({
  location,
  item,
  onRemove,
  isCustom,
}: LocationOptionItemProps) {
  const [ isDeleting, setIsDeleting ] = useState(false);

  return (
    <Card className="organization_option_item p-3">
      <div className="d-flex justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2">
            <Badge pill className="b6 me-2">{isCustom ? 'Custom Location' : 'Location'}</Badge>
            <div className="b6 text-truncate">{location?.name}</div>
          </div>
          <div className="b5 mt-2 info text-truncate">
            <span>{location?.address}</span>
          </div>
        </div>
        <Button
          className="btn-clear"
          onClick={() => setIsDeleting(true)}
        >
          <CloseIcon fill="var(--bs-danger)" height={16} width={16} />
        </Button>
      </div>
      <DeleteModal
        isOpen={isDeleting}
        title="Delete Location"
        description={`Are you sure you want to delete the location, ${location?.name}? This action will also remove all connections associated with this location`}
        toggle={() => setIsDeleting(!isDeleting)}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={() => onRemove(item?.id)}
      />
    </Card>
  );
}

export default LocationOptionItem;
