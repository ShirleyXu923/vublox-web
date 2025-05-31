import React, { useState } from 'react';
import { Badge, Button, Card } from 'reactstrap';
import './EventOptionItem.scss';

import { DeleteModal } from '@shared/components/Modal/delete-modal';
import { dateToCalendar, dateToTime } from '@shared/helpers';
import { CloseIcon } from '@shared/icons';

type EventItemType = {
  id: string;
};

type LocationType = {
  name: string;
  address: string;
};

type OwnerType = {
  name?: string;
  display_name?: string;
};

type CoCreatorType = {
  creator?: {
    name: string;
  }
};

type EventType = {
  id: string;
  name: string;
  description: string;
  started_at: Date;
  location?: LocationType;
  owner?: OwnerType;
  coCreators?: CoCreatorType[];
};

type EventOptionItemProps = {
  item: EventItemType;
  event: EventType;
  onRemove: (id: string) => void;
};

function EventOptionItem({ event, item, onRemove }: EventOptionItemProps) {
  const [ isDeleting, setIsDeleting ] = useState(false);

  function renderCoCreators(): string | null {
    if (!event?.coCreators?.length) return null;
    return event.coCreators
      .map(coCreator => coCreator?.creator?.name)
      .filter(Boolean)
      .join(', ');
  }

  return (
    <Card className="event_option_item p-3">
      <div className="d-flex justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2">
            <Badge pill className="b6 me-2">Event</Badge>
            <div className="b6 text-truncate">{event?.name}</div>
          </div>
          <div className="b5 text-truncate">{event?.description}</div>
          <div className="b5 mt-2 info text-truncate">
            {event?.location && <span>{event?.location?.name} • </span>}
            <span>{dateToCalendar(event?.started_at)}, {dateToTime(event?.started_at)}</span>
            <span> • Organized By: {`${event?.owner?.name || event?.owner?.display_name}${renderCoCreators()}`}</span>
          </div>
        </div>
        <Button
          className="btn-clear"
          onClick={() => {
            setIsDeleting(true);
          }}
        >
          <CloseIcon fill="var(--bs-danger)" height={16} width={16} />
        </Button>
      </div>
      <DeleteModal
        isOpen={isDeleting}
        title="Delete Event"
        description={`Are you sure you want to delete the event, ${event?.name}? This action will also remove all connections associated with this event`}
        toggle={() => setIsDeleting(!isDeleting)}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={() => onRemove(item?.id)}
      />
    </Card>
  );
}

export default EventOptionItem;
