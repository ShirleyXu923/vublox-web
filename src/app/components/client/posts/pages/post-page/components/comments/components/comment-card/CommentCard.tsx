import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import './CommentCard.scss';

import VoteGroup from '@shared/components/VoteGroup/VoteGroup';
import { useVoteControls } from '@shared/hooks/useVoteControls';
import Avatar from '@shared/utils/Avatar/Avatar';

interface CommentCardProps {
  data: {
    id: string;
    comment: string;
    owner: any;
    created_at: Date;
    vote_count: number;
    upvote_count: number;
    downvote_count: number;
    user_vote: string | null;
  }
}

function CommentCard({ data }: CommentCardProps) {
  const { voteControls } = useVoteControls({ votable_id: data.id, votable_type: 'PostComment' });

  const getOwnerRedirectionLink = () => {
    if (!data.owner) return '#';

    return data.owner.name ? `/organizations/${data.owner.id}` : `/profile/${data.owner.id}`;
  };

  const getCommentDate = () => {
    const dateCommented = moment(data.created_at).fromNow();

    return dateCommented
      .replace('a minute', '1 min')
      .replace('minutes', 'mins')
      .replace('a few seconds ago', 'Just now');
  };

  return (
    <div className="comment-card">
      {/* <!-- Avatar --> */}
      <Link to={getOwnerRedirectionLink()}>
        <Avatar user={data?.owner} />
      </Link>
      {/* <!-- Information --> */}
      <div className="info">
        <Link to={getOwnerRedirectionLink()} className="b3 text-body">{data?.owner?.name || data?.owner?.display_name}</Link>
        <div className="caption1">{getCommentDate()}</div>
        <div className="b5 text-body text-wrap comment">{data?.comment}</div>
        <div className="vote">
          <VoteGroup
            item={data}
            upvoteRequest={() => voteControls.upVote}
            downvoteRequest={() => voteControls.downVote}
            zeroWord="Vote"
          />
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
