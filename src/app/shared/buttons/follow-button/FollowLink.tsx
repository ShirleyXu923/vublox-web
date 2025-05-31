import React from 'react';
import { Button } from 'reactstrap';

import useFollow from './useFollow';

interface FollowLinkProps {
  isFollowing?: boolean;
  followId: string;
  followType: 'Client' | 'Event' | 'Organization' | 'Timeline' | 'Location';
  sufix?: string;
}

function FollowLink({
  isFollowing,
  followId,
  followType,
  sufix,
}: FollowLinkProps) {
  const { following, handleClick } = useFollow(followId, followType, isFollowing);

  return (
    <Button color="link" className="caption2" onClick={handleClick}>{`${following ? 'Unfollow' : 'Follow'} ${sufix || ''}`}</Button>
  );
}

export default FollowLink;
