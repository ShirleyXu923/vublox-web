import React, { useState } from 'react';
import { Badge, Button, Card } from 'reactstrap';

import './TimelineOptionItem.scss';
import LocaleService from '@services/LocaleService';
import { DeleteModal } from '@shared/components/Modal/delete-modal';
import { shortNumberFormat } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { CloseIcon } from '@shared/icons';

type TimelineItemType = {
  id: string;
};

type LocationType = {
  name: string;
  address: string;
};

type TimelineType = {
  name?: string;
  posts_count: number;
  location?: LocationType;
};

type TimelineOptionItemProps = {
  timeline: TimelineType;
  item: TimelineItemType;
  onRemove: (id: string) => void;
};

function TimelineOptionItem({ timeline, item, onRemove }: TimelineOptionItemProps) {
  const i18n = useTranslation('createEvent');
  const [ isDeleting, setIsDeleting ] = useState(false);

  return (
    <Card className="timeline_option_item p-3">
      <div className="d-flex justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2">
            <Badge pill className="b6 me-2">{i18n.label.timeline}</Badge>
            <div className="b6 text-truncate">{timeline?.name}</div>
          </div>
          <div className="b5 mt-2 info text-truncate">
            <span>
              {`
                ${shortNumberFormat(timeline?.posts_count)}
                ${LocaleService.getPluralizedTranslation(i18n.label.posts, timeline?.posts_count || 0, false)} •
              `}
            </span>
            <span>{timeline?.location?.name}</span>
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
        title="Delete Timeline"
        description={`Are you sure you want to delete the timeline, ${timeline?.name}? This action will also remove all connections associated with this timeline`}
        toggle={() => setIsDeleting(!isDeleting)}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={() => onRemove(item?.id)}
      />
    </Card>
  );
}

export default TimelineOptionItem;
