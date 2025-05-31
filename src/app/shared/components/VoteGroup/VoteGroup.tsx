import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Label } from 'reactstrap';

import { IRootState } from '@app/store';
import {
  DownvoteIcon, UpvoteIcon,
  UpvoteFilledIcon, DownvoteFilledIcon,
} from '@shared/icons';

import './VoteGroup.scss';

function VoteGroup({
  item,
  disabled = false,
  upvoteRequest,
  downvoteRequest,
  zeroWord = '0',
}: {
  item: any;
  disabled?: boolean;
  upvoteRequest: () => void;
  downvoteRequest: () => void;
  zeroWord?: string;
}) {
  const isLoggedIn = useSelector((state: IRootState) => !!state.Auth.accessToken);
  const [ prevItem, setPrevItem ] = useState<any>({});
  const navigate = useNavigate();

  const upVoteCount = parseInt(prevItem.upvote_count) || 0;
  const downVoteCount = parseInt(prevItem.downvote_count) || 0;
  const userVote = prevItem.user_vote || '';
  const voteCount = upVoteCount - downVoteCount;

  const dispatch = useDispatch<any>();

  if (prevItem.id !== item.id) {
    setPrevItem({
      ...item,
      upvote_count: item.upvote_count || 0,
      downvote_count: item.downvote_count || 0,
      user_vote: item.user_vote || '',
      upvote_status: item.user_vote === 'up',
      downvote_status: item.user_vote === 'down',
    });
  }

  const handleUpVote = () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
    const previousUpVoteCount = prevItem.upvote_count;
    const previousUserVote = prevItem.user_vote;
    const previousDownVoteCount = prevItem.downvote_count;

    let newUpVoteCount = prevItem.upvote_count;
    let newDownVoteCount = prevItem.downvote_count;
    let newUserVote = prevItem.user_vote;

    if (!prevItem.upvote_status) {
      newUpVoteCount = upVoteCount + 1;
      newUserVote = 'up';
      if (prevItem.downvote_status) {
        newDownVoteCount = downVoteCount - 1;
      }
    } else {
      newUpVoteCount = upVoteCount as number - 1;
      newUserVote = '';
    }

    setPrevItem({
      ...prevItem,
      upvote_count: newUpVoteCount,
      downvote_count: newDownVoteCount,
      user_vote: newUserVote,
      upvote_status: newUserVote === 'up',
      downvote_status: newUserVote === 'down',
    });

    dispatch(upvoteRequest()).$promise
      .catch(() => {
        // revert changes
        setPrevItem({
          ...prevItem,
          upvote_count: previousUpVoteCount,
          downvote_count: previousDownVoteCount,
          user_vote: previousUserVote,
          upvote_status: previousUserVote === 'up',
          downvote_status: previousUserVote === 'down',
        });
      });
  };

  const handleDownVote = () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }

    const previousUpVoteCount = prevItem.upvote_count;
    const previousUserVote = prevItem.user_vote;
    const previousDownVoteCount = prevItem.downvote_count;

    let newUpVoteCount = prevItem.upvote_count;
    let newDownVoteCount = prevItem.downvote_count;
    let newUserVote = prevItem.user_vote;

    if (!prevItem.downvote_status) {
      newDownVoteCount = downVoteCount + 1;
      newUserVote = 'down';
      if (prevItem.upvote_status) {
        newUpVoteCount = upVoteCount - 1;
      }
    } else {
      newDownVoteCount = downVoteCount - 1;
      newUserVote = '';
    }

    setPrevItem({
      ...prevItem,
      upvote_count: newUpVoteCount,
      downvote_count: newDownVoteCount,
      user_vote: newUserVote,
      upvote_status: newUserVote === 'up',
      downvote_status: newUserVote === 'down',
    });

    dispatch(downvoteRequest()).$promise
      .catch(() => {
        // revert changes
        setPrevItem({
          ...prevItem,
          upvote_count: previousUpVoteCount,
          downvote_count: previousDownVoteCount,
          user_vote: previousUserVote,
          upvote_status: previousUserVote === 'up',
          downvote_status: previousUserVote === 'down',
        });
      });
  };

  return (
    <div className="d-flex align-items-center justify-content-start vote">
      <div className="d-flex align-items-center justify-content-start">
        <Button color="link" className="d-flex p-0" onClick={() => !disabled && handleUpVote()}>
          {userVote === 'up' ? <UpvoteFilledIcon /> : <UpvoteIcon />}
        </Button>
        <Label className="mb-0 b5">{voteCount > 0 ? voteCount : zeroWord}</Label>
      </div>
      <div className="vote-divider" />
      <div className="d-flex align-items-center justify-content-start">
        <Button color="link" className="d-flex p-0 down" onClick={() => !disabled && handleDownVote()}>
          {userVote === 'down' ? <DownvoteFilledIcon /> : <DownvoteIcon />}
        </Button>
        <Label className="mb-0 small" />
      </div>
    </div>
  );
}

export default memo(VoteGroup);
