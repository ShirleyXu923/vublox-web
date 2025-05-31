import React from 'react';

import useTranslation from '@shared/hooks/useTranslation';

import useFollow from './useFollow';
import { Button } from '../Button';

interface FollowButtonProps {
  isFollowing?: boolean;
  followId: string;
  followType: 'Client' | 'Event' | 'Organization' | 'Timeline' | 'Location';
  followBack?: boolean;
}

function FollowModalButton({
  isFollowing, followId, followType, followBack,
}: FollowButtonProps) {
  const i18n = useTranslation('profilePage');
  const { following, handleClick } = useFollow(followId, followType, isFollowing);
  const followText = followBack ? i18n.label.followBack : i18n.label.follow;

  return (
    <Button
      color={following ? 'danger' : 'primary'}
      outline
      size="sm"
      label={following ? i18n.label.unfollow : followText}
      onClick={handleClick}
      className="follow-button"
    />
  );
}

export default FollowModalButton;
