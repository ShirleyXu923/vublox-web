import React from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from 'reactstrap';

import FollowModalButton from '@shared/buttons/follow-button/FollowModalButton';
import Verified from '@shared/icons/Verified';
import Avatar from '@shared/utils/Avatar/Avatar';

function FollowingItem({ item, account }: { item: any, account: any }) {
  return (
    <div className="item">
      <div className="item">
        <NavLink to={`${item.path}/${item.id}`} target="_blank">
          <Avatar
            user={item}
          />
        </NavLink>
        <NavLink to={`${item.path}/${item.id}`} className="link flex-fill" target="_blank">
          <span className="b1">
            {item.name || item.display_name}&nbsp;
            {item.verified_at && (
              <Verified />
            )}
            {item.id === account?.id && (
              <Badge className="badge ms-1">You</Badge>
            )}
          </span>
        </NavLink>
      </div>

      {item.id !== account?.id && (
        <FollowModalButton
          followId={item.id}
          followType={item.type}
          isFollowing={item.is_following}
        />
      )}
    </div>
  );
}

export default FollowingItem;
