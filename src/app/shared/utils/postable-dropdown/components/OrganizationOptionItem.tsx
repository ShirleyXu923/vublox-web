import './OrganizationOptionItem.scss';
import React, { useState } from 'react';
import { Badge, Button, Card } from 'reactstrap';

import LocaleService from '@services/LocaleService';
import { DeleteModal } from '@shared/components/Modal/delete-modal';
import { dateToCalendar, shortNumberFormat } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { CloseIcon } from '@shared/icons';

type OrganizationItemType = {
  id: string;
};

type LocationType = {
  name: string;
  address: string;
};

type OrganizationType = {
  id?: string;
  name?: string;
  followers_count: number;
  started_at: Date;
  location?: LocationType;
};

type OrganizationOptionItemProps = {
  organization: OrganizationType;
  item: OrganizationItemType;
  onRemove: (id: string) => void;
};

function OrganizationOptionItem({ organization, item, onRemove }: OrganizationOptionItemProps) {
  const i18n = useTranslation('createEvent');
  const [ isDeleting, setIsDeleting ] = useState(false);

  return (
    <Card className="organization_option_item p-3">
      <div className="d-flex justify-content-between">
        <div>
          <div className="d-flex align-items-center gap-2">
            <Badge pill className="b6 me-2">{i18n.label.organization}</Badge>
            <div className="b6 text-truncate">{organization?.name}</div>
          </div>
          <div className="b5 mt-2 info text-truncate">
            <span>{`
              ${shortNumberFormat(organization?.followers_count)}
              ${LocaleService.getPluralizedTranslation(i18n.label.followers, organization?.followers_count || 0, false)}
            `}
            </span>
            <span> • EST. {dateToCalendar(organization?.started_at)}</span>
            {organization?.location && <span> • {organization?.location?.name}</span>}
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
        title="Delete Organization"
        description={`Are you sure you want to delete the organization, ${organization?.name}? This action will also remove all connections associated with this organization`}
        toggle={() => setIsDeleting(!isDeleting)}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={() => onRemove(item?.id)}
      />
    </Card>
  );
}

export default OrganizationOptionItem;
