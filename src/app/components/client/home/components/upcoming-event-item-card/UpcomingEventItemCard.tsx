import moment from 'moment';
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Badge, Button, Card, CardBody,
} from 'reactstrap';

import './UpcomingEventItemCard.scss';

import LocaleService from '@services/LocaleService';
import { getProfileLink } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { NotificationIcon, TagIcon } from '@shared/icons';
import SocialShare from '@shared/icons/SocialShare';
import Avatar from '@shared/utils/Avatar/Avatar';

interface UpcomingEventItemCardProps {
  item: any
}

function UpcomingEventItemCard({ item }: UpcomingEventItemCardProps) {
  const i18n = useTranslation('upcoming');
  return (
    <Card className="upcoming-event-item-card">
      <NavLink to={`/events/${item.id}`} className="stretched-link" />
      <CardBody className="d-flex flex-column">
        <div className="text-primary">
          {moment(item.started_at).format('DD MMM YYYY, hh:mm a')}
          {item.location && ` • ${item.location.address}`}
        </div>

        <div className="s2 mt-2 mb-auto">
          {item.name}
        </div>

        {item.owner && (
          <div className="details mt-3">
            <NavLink to={getProfileLink(item.owner)} className="link">
              <Avatar
                size="md"
                user={item.owner || {}}
              />
            </NavLink>
            <div className="ms-2">
              <NavLink to={getProfileLink(item.owner)} className="link">
                {item.owner?.display_name || item.owner?.name}<br />
              </NavLink>
              {item.coCreators?.length > 0 && (
                <small>
                  {LocaleService.parseTranslation(i18n.label.coCreated)}
                  {item.coCreators.map((c: any, index: number) => (
                    <>
                      <NavLink key={c?.creator?.id} to={c?.creator?.link} className="link">
                        {c?.creator?.name}
                      </NavLink>
                      {index < item.coCreators.length - 1 && ', '}
                    </>
                  ))}
                </small>
              )}
            </div>
          </div>
        )}

        {item.tags?.length > 0 && (
          <div className="tags mt-2">
            <TagIcon />
            {item.tags.map((tag: any) => (
              <Badge pill key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        <div className="buttons mt-3">
          <Button
            outline
            color="primary"
            block
          >
            <NotificationIcon className="me-2" />
            {i18n.button.notifyMe}
          </Button>
          <Button
            outline
            color="primary"
          >
            <SocialShare width={20} height={20} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default UpcomingEventItemCard;
