import classNames from 'classnames';
import React, { useState } from 'react';
import './Comments.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Spinner } from 'reactstrap';

import { IRootState } from '@app/store';
import { createCommentRequest, getPostRequest } from '@reducers/post/PostAction';
import { handleError } from '@services/ErrorHandler';
import { getFormData } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import Avatar from '@shared/utils/Avatar/Avatar';

import CommentCard from './components/comment-card/CommentCard';

function Comment() {
  const i18n = useTranslation('postPage');
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(({ Auth }) => !!Auth.accessToken);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const post = useSelector((state: IRootState) => state.Post.post);
  const [ isCommenting, setIsCommenting ] = useState(false);
  const [ commentSubmitting, setCommentSubmitting ] = useState(false);
  const [ form, setForm ] = useState({
    comment: '',
  });

  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return null;
    }
    setCommentSubmitting(true);
    const data = {
      comment: form.comment,
      commentor_type: account?.type === 'user' ? 'Client' : 'Organization',
      commentor_id: account?.id,
      post_id: post?.id,
    };

    const formData = getFormData(data);
    try {
      await dispatch(createCommentRequest(formData)).$promise;
      setForm({
        ...form,
        comment: '',
      });
      await dispatch(getPostRequest(post?.id)).$promise;
      setCommentSubmitting(false);
    } catch (error: any) {
      handleError(error);
      setCommentSubmitting(false);
    }

    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSubmitComment();
    }
  };

  return (
    <Col className="post-comments-tab">
      {isLoggedIn && (
        <div className={classNames({
          'comment-form': true,
          active: isCommenting,
        })}
        >
          <div className="input">
            <Avatar user={account} size="sm" />
            <input
              className="b3 comment-input"
              value={form?.comment}
              onKeyDown={handleKeyDown}
              onChange={(e) => setForm({
                ...form,
                comment: e.target.value,
              })}
              type="text"
              placeholder={i18n.label.shareYourThoughts}
              onFocus={() => setIsCommenting(true)}
            />
          </div>
          {isCommenting && (
            <div className="actions">
              <Button
                disabled={commentSubmitting}
                color="secondary"
                className="b6"
                onClick={() => {
                  setForm({
                    ...form,
                    comment: '',
                  });

                  setIsCommenting(false);
                }}
              >
                {i18n.label.cancel}
              </Button>
              <Button color="primary" className="b6" onClick={handleSubmitComment}>
                {commentSubmitting && <Spinner size="sm" className="mx-2" />}
                {i18n.label.comment}
              </Button>
            </div>
          )}
        </div>
      )}
      <div className="comments">
        {post?.comments?.map((comment: any) => (
          <CommentCard key={comment?.id} data={comment} />
        ))}
      </div>
    </Col>
  );
}

export default Comment;
