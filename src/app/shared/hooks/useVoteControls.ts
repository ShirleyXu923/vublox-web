import { addVoteRequest } from '@reducers/post/PostAction';
import { getFormData } from '@shared/helpers';

export interface VoteControls {
  upVote: () => void;
  downVote: () => void;
}

interface VoteParams {
  votable_id: string;
  votable_type: string;
}

export function useVoteControls({ votable_id, votable_type }: VoteParams) {
  const voteControls = {
    upVote: addVoteRequest(getFormData({
      vote: 'up',
      votable_id,
      votable_type,
    })),
    downVote: addVoteRequest(getFormData({
      vote: 'down',
      votable_id,
      votable_type,
    })),
  };

  return { voteControls };
}
