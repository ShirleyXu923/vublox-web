import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { followPageRequest, unfollowPageRequest } from '@reducers/follow/FollowAction';
import { handleError } from '@services/ErrorHandler';
import { getFormData } from '@shared/helpers';

function useFollow(
  followId: string,
  followType: 'Client' | 'Event' | 'Organization' | 'Timeline' | 'Location',
  isFollowing?: boolean,
) {
  const dispatch = useDispatch<any>();

  const [ following, setFollowing ] = useState<any>(false);

  const toggle = () => setFollowing(!following);

  const follow = async () => {
    try {
      const formData = getFormData({
        followable_id: followId,
        followable_type: followType,
      });
      toggle();
      await dispatch(followPageRequest(formData)).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const unfollow = async () => {
    try {
      const formData = getFormData({
        followable_id: followId,
        followable_type: followType,
      });
      toggle();
      await dispatch(unfollowPageRequest(formData)).$promise;
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleClick = () => {
    if (following) {
      unfollow();
    } else {
      follow();
    }
  };

  useEffect(() => {
    setFollowing(isFollowing);
  }, [ isFollowing ]);

  return {
    following,
    handleClick,
  };
}

export default useFollow;
