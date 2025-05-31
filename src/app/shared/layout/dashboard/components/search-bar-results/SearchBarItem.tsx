import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DropdownItem } from 'reactstrap';

import { clearKeywordRequest } from '@reducers/search/SearchAction';
import { BadgeType } from '@shared/components/AccordionTimeline/components/timeline/components/badge-type';
import { dateToCalendar, dateToTime } from '@shared/helpers';
import useThumbnail from '@shared/hooks/useThumbnail';
import Avatar from '@shared/utils/Avatar/Avatar';

function SearchBarItem({ item, selectedFilter }: { item: any; selectedFilter: string[] }) {
  const { thumbnail } = useThumbnail(item);
  const navigate = useNavigate();
  // const { logo } = useAppTheme();
  const dispatch = useDispatch<any>();

  const handleSelectItem = async () => {
    dispatch(clearKeywordRequest());
    navigate(item?.redirect || '#');
  };

  const getThumbnail = () => {
    if (item.image?.sm) {
      return (
        <div
          className={classNames({
            'search-item-image me-2': true,
            [`${item.type}-image`]: true,
            blank: !item.image,
          })}
          style={{ backgroundImage: `url(${encodeURI(item.image?.sm)})`, aspectRatio: '1' }}
        />
      );
    }

    if (item.type === 'profile' || item.type === 'organization') {
      return (
        <Avatar user={item.entity} size="sm" className="me-2" />
      );
    }

    return (
      <div className="thumbnail search-item-image me-2">
        {thumbnail}
      </div>
    );
  };

  return (
    <DropdownItem
      key={`item-${item.type}-${item.id}-${selectedFilter || ''}`}
      className="search-item"
      onClick={() => handleSelectItem()}
    >
      {getThumbnail()}
      <div className="search-item-info d-flex flex-column flex-fill">
        <div className="d-flex align-items-center mb-1">
          {selectedFilter.length > 1 && (
            <BadgeType label={item.type} />
          )}
          <p className="label mb-0 text-truncate">{item.title}</p>
        </div>
        {item.description && (
          <p className="description mb-1 text-truncate">{item.description}</p>
        )}
        {item.date && (
          <span className="caption1">
            {`${dateToCalendar(item.date)}, ${dateToTime(item.date)}`}
          </span>
        )}
      </div>
    </DropdownItem>
  );
}

export default SearchBarItem;
