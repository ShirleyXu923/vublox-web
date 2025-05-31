import React from 'react';

import useTranslation from '@shared/hooks/useTranslation';

import useFollow from './useFollow';
import { Button } from '../Button';

interface FollowButtonProps {
  isFollowing?: boolean;
  isFollower?: boolean;
  followId: string;
  followType: 'Client' | 'Event' | 'Organization' | 'Timeline' | 'Location';
}

function FollowButton({
  isFollowing, followId, followType, isFollower,
}: FollowButtonProps) {
  const i18n = useTranslation('profilePage');
  const { following, handleClick } = useFollow(followId, followType, isFollowing);

  const getButtonLabel = () => {
    if (following) {
      return i18n.label.unfollow;
    }
    if (isFollower) {
      return i18n.label.followBack;
    }
    return i18n.label.follow;
  };

  return (
    <Button
      color="primary"
      outline={following}
      label={getButtonLabel()}
      onClick={handleClick}
    />
  );
}

export default FollowButton;
