import moment from 'moment';
import React from 'react';
import {
  Badge,
  Card, CardBody, CardText, CardTitle,
  DropdownItem,
} from 'reactstrap';
import { v4 as uuid } from 'uuid';

import LocaleService from '@services/LocaleService';
import { dateToCalendar, dateToTimeWithSeconds } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { LocationIcon, VerifiedIcon } from '@shared/icons';

interface PostableResultsProps {
  type: 'event' | 'location' | 'organization' | 'timeline'
  onSelect: (item: any, type: 'event' | 'location' | 'organization' | 'timeline' | 'custom_location') => void;
  items?: any;
  customItems?: any;
  keyword?: string;
  loading?: boolean;
}

function PostableResults({
  type, onSelect, items = [], customItems, keyword, loading,
}: PostableResultsProps) {
  const i18n = useTranslation('createPost');

  const getPluralizedPosts = (item: any) => (
    LocaleService.getPluralizedTranslation(
      i18n.label.posts, parseInt(item?.posts_count || 0), false)
  );

  const getPluralizedFollowers = (item: any) => (
    LocaleService.getPluralizedTranslation(
      i18n.label.followers, item?.followers_count as number || 0, false)
  );

  return !loading && (
    <div>
      {((items?.length === 0 && type !== 'location') || (customItems?.length === 0 && type === 'location')) && type !== 'location' && (
        <div className="mt-2">
          {i18n.label.emptyResults}
        </div>
      )}
      {items.map((item: any) => (
        <DropdownItem key={item.id} className="w-100 px-0" onClick={() => onSelect(item, type)}>
          <Card className="w-100">
            <CardBody>
              <CardTitle className="fw-bold mb-1 b6">
                <h5 className="d-flex align-items-center gap-1">
                  {item.name || item.title}
                  {item.is_suggested && (
                    <Badge pill className="d-flex align-items-center">
                      <LocationIcon />
                      <span className="badge_text mx-1">{i18n.label.suggested}</span>
                    </Badge>
                  )}
                  {item?.verified_at && (
                    <VerifiedIcon className="ms-1" />
                  )}
                </h5>
              </CardTitle>
              {type === 'event' && (
                <CardText className="mb-1">
                  {item.description}
                </CardText>
              )}

              <small className="text-placeholder text-wrap">
                {type === 'event' && item?.started_at
                  && `${dateToCalendar(item?.started_at)}, ${dateToTimeWithSeconds(item?.started_at)} (${moment.tz(item?.timezone).zoneAbbr()})`}
                {type === 'organization' && `${item?.followers_count} ${getPluralizedFollowers(item)} • Est. ${moment(item?.started_at).format('DD MMM YYYY')}`}
                {type === 'timeline' && `${item?.posts_count} ${getPluralizedPosts(item)}`}
                {(item?.location || item?.address) && `${item?.location ? ' • ' : ''}${item?.location?.name || item?.address}`}
              </small>

              {item?.coCreators?.length > 0 && (
                <div>
                  <small className="text-placeholder">
                    {i18n.label.organizedBy}&nbsp;

                    {item?.coCreators.map((c: any) => c?.organization?.name).join(', ')}
                  </small>
                </div>
              )}
            </CardBody>
          </Card>
        </DropdownItem>
      ))}
      {customItems?.length > 0 && type === 'location' && (
        <React.Fragment>
          {customItems.map((place: any) => (
            <DropdownItem key={place.name} className="w-100 px-0" onClick={() => onSelect(place, 'custom_location')}>
              <Card className="w-100">
                <CardBody>
                  <CardTitle className="fw-bold mb-1 b6">
                    <div className="d-flex align-items-start gap-2">
                      <h5>{place.name}</h5>
                      <Badge pill>
                        <LocationIcon />
                        <span className="badge_text mx-1">{i18n.label.custom_location}</span>
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardText className="mb-1 text-placeholder text-wrap">
                    {place.address}
                  </CardText>
                </CardBody>
              </Card>
            </DropdownItem>
          ))}
        </React.Fragment>
      )}
      {type === 'location' && keyword !== '' && (
        <DropdownItem
          key={0}
          className="w-100 px-0"
          onClick={() => onSelect({
            id: uuid(),
            name: keyword,
            address: keyword,
            latitude: 0,
            longitude: 0,
            country_code: localStorage.getItem('COUNTRY_CODE') || 'CN',
          }, 'custom_location')}
        >
          <Card className="w-100">
            <CardBody>
              <CardTitle className="fw-bold b6">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{keyword}</h5>
                  <Badge pill className="mt-1">
                    <LocationIcon />
                    <span className="badge_text mx-1">{i18n.label.custom_location}</span>
                  </Badge>
                </div>
              </CardTitle>
            </CardBody>
          </Card>
        </DropdownItem>
      )}
    </div>
  );
}

export default PostableResults;
