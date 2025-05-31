import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap';

import { followOrganizationRequest, unfollowOrganizationRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import Avatar from '@shared/utils/Avatar/Avatar';

function FollowSelectionItem({ item }: { item: any }) {
  const i18n = useTranslation('onboarding');
  const [ following, setFollowing ] = useState<boolean>(item.is_following);
  const dispatch = useDispatch<any>();

  const handleFollow = async () => {
    const request = following ? unfollowOrganizationRequest : followOrganizationRequest;
    try {
      setFollowing(s => !s);
      await dispatch(request(item.id)).$promise;
    } catch (err) {
      handleError(err);
      setFollowing(s => !s);
    }
  };

  return (
    <div className="d-flex align-items-center w-100 gap-4">
      <div className="flex-fill d-flex align-items-center gap-2 col-9">
        <Avatar
          user={item}
        />
        <h6 className="fw-normal mb-0 b1 follow-selection-item-name">{item.name}</h6>
      </div>
      <Button
        size="sm"
        outline={!following}
        color="primary follow-selection-item-button col-3"
        onClick={handleFollow}
      >
        {following ? i18n.button.following : i18n.button.follow}
      </Button>
    </div>
  );
}

export default FollowSelectionItem;
