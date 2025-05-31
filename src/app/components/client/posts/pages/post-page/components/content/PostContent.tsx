/* eslint-disable react/no-danger */
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown,
} from 'reactstrap';

import { useShareLinkModal } from '@app/providers/share-provider/ShareProvider';
import { IRootState } from '@app/store';
import appConfig from '@config/app';
import { getPostRequest } from '@reducers/post/PostAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import FollowLink from '@shared/buttons/follow-button/FollowLink';
import VoteGroup from '@shared/components/VoteGroup/VoteGroup';
import {
  dateToCalendar,
  dateToTime,
  shortNumberFormat,
} from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { useVoteControls } from '@shared/hooks/useVoteControls';
import MoreIcon from '@shared/icons/MoreIcon';
import PlayIcon from '@shared/icons/PlayIcon';
import SocialShare from '@shared/icons/SocialShare';
import Avatar from '@shared/utils/Avatar/Avatar';

import PostPagePlaceholder from '../../PostPagePlaceholder';
import { Comment } from '../comments';
import { Details } from '../details';

import '../../PostPage.scss';

function PostContent({ id, preview, defaultPost }: { id: string; preview?: boolean;
  defaultPost?: any }) {
  const i18n = useTranslation('postPage');
  const params = useParams();
  const location = useLocation();
  const { hash } = location;
  const dispatch = useDispatch<any>();
  const [ isDescriptionExpanded, setIsDescriptionExpanded ] = useState(false);
  const [ activeTab, setActiveTab ] = useState(preview ? 'comments' : 'details');
  const detailsRef = useRef<any>(null);
  const commentsRef = useRef<any>(null);
  const { voteControls } = useVoteControls({ votable_id: params.id ?? '', votable_type: 'Post' });
  const { toggle: toggleShare, setLink, setShareData } = useShareLinkModal();
  const [ isLoading, setIsLoading ] = useState(true);
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const navigate = useNavigate();
  const [ isPlaying, setIsPlaying ] = useState(preview);
  const account = useSelector((state: IRootState) => state.Auth.account);

  const p = useSelector((state: IRootState) => state.Post.post);
  const [ post, setPost ] = useState(defaultPost || p);

  const ref = useRef<ReactPlayer>(null);

  const getOwnerRedirectionLink = () => {
    if (!post) return '#';

    return post?.owner?.name ? `/organizations/${post?.owner?.id}` : `/profile/${post?.owner?.id}`;
  };

  const getPost = async () => {
    try {
      await dispatch(getPostRequest(id)).$promise;
    } catch (error: any) {
      handleError(error, navigate);
    }
  };

  const handleShare = () => {
    setShareData({
      data_id: post?.id,
      data_type: 'Post',
      receiver_id: post?.owner?.id,
    });

    setLink(`${appConfig.baseUrl}/posts/${post?.id}`);
    toggleShare(true);
  };

  const loadPage = async () => {
    if (!defaultPost) {
      setIsLoading(true);
    }
    await getPost();
    setIsLoading(false);
  };

  useEffect(() => {
    if (hash === '#comments') {
      setActiveTab('comments');
    }

    if (hash === '#details') {
      setActiveTab('details');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location, hash ]);

  useEffect(() => {
    loadPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ id ]);

  useEffect(() => {
    if (p.is_adult_redirect) {
      navigate(p.is_adult_redirect);
      return;
    }
    setPost(p);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ p ]);

  useEffect(() => {
    const img = document.createElement('img');
    img.src = post.preview_image_urls?.lg;
    img.onload = () => {
      if (img.naturalHeight > img.naturalWidth) {
        document.getElementsByClassName('media')[0]?.classList?.add?.('portrait');
      }
    };
  }, [ post.preview_image_urls?.lg ]);

  return isLoading
    ? (
      <Row className="justify-content-center">
        <PostPagePlaceholder />
      </Row>
    )
    : (
      <Row className="justify-content-center">
        <Col md={11}>
          {(post?.media_url || post?.preview_image_urls) && (
            <div className="media">
              {!post.media_type?.startsWith?.('video') ? (
                <img
                  src={post.preview_image_urls?.lg}
                  alt="media"
                  onLoad={({ target }) => {
                    if ((target as any).naturalHeight > (target as any).naturalWidth) {
                      (target as any).classList.add('portrait');
                    }
                  }}
                  width="100%"
                  height="100%"
                />
              ) : (
                <ReactPlayer
                  ref={ref}
                  url={post.media_url?.lg}
                  light={post.preview_image_urls?.lg}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  width="100%"
                  height="100%"
                  playing
                  config={{
                    youtube: {
                      playerVars: {
                        controls: 1,
                      },
                      embedOptions: {
                        autoplay: 1,
                      },
                    },
                  }}
                  playIcon={<PlayIcon />}
                  controls={(ref.current?.getCurrentTime() || 0) > 0
                      || isPlaying}
                />
              )}
            </div>
          )}
          <div className={`title ${isSmScreen ? 's3' : 's1'}`}>{post?.title}</div>
          <div className={`description b3 ${isDescriptionExpanded ? '' : 'text-truncate'}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.description) }} />
          {post?.description?.length > 100 && (
            <div className="description-action">
              <Button
                color="link"
                className="b6 p-0"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? i18n.label.viewLess : i18n.label.viewMore}
              </Button>
            </div>
          )}
        </Col>
        <Col md={11}>
          <div className="socialize">
            <div className="owner">
              <Link to={getOwnerRedirectionLink()}>
                <Avatar user={post?.owner} />
              </Link>
              <div className="info">
                <div className="d-flex align-items-center">
                  <Link to={getOwnerRedirectionLink()} className="b1 text-body">{post?.owner?.name || post?.owner?.display_name}</Link>
                  {account?.id !== post?.owner?.id && (
                    <FollowLink isFollowing={post?.owner?.is_following} followId={post?.owner?.id} followType={post?.owner?.name ? 'Organization' : 'Client'} />
                  )}
                </div>
                <div className="date">
                  <div className="b5">
                    {LocaleService.parseTranslation(i18n.label.contributedOn, { date: `${dateToCalendar(post?.created_at)}, ${dateToTime(post?.created_at)}` })}
                  </div>
                  <div className="dot" />
                  <div className="b5">
                    {LocaleService.parseTranslation(i18n.label.happenedOn, { date: `${dateToCalendar(post?.posted_at)}, ${dateToTime(post?.posted_at)}` })}
                  </div>
                  <div className="dot" />
                  <Link to={`/locations/${post?.location?.slug}`} className="b5">{post?.location?.name}</Link>
                  <div className="dot" />
                  <div className="b5">{`${shortNumberFormat(post?.views_count)} `}{LocaleService.getPluralizedTranslation(i18n.label.views, post?.views_count, false)}</div>
                </div>
              </div>
            </div>
            {!isSmScreen && (
              <div className="vote-share">
                <div className="pill">
                  <VoteGroup
                    item={post}
                    upvoteRequest={() => voteControls.upVote}
                    downvoteRequest={() => voteControls.downVote}
                  />
                </div>
                <div className="pill" style={{ cursor: 'pointer' }} onClick={handleShare}>
                  <SocialShare />
                  <div className="b5 text-body">{i18n.label.share}</div>
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col md={11}>
          <Nav pills>
            <NavItem onClick={() => setActiveTab('details')}>
              <NavLink
                id="details-tab"
                ref={detailsRef}
                active={activeTab === 'details'}
                className={activeTab === 'details' ? 'b4' : 'b3'}
              >
                {i18n.label.details}
              </NavLink>
            </NavItem>
            <NavItem onClick={() => setActiveTab('comments')}>
              <NavLink
                id="comments-tab"
                ref={commentsRef}
                active={activeTab === 'comments'}
                className={activeTab === 'comments' ? 'b4' : 'b3'}
              >
                <div>{i18n.label.comments}</div>
                <div className="badge caption1">{post?.comments_count}</div>
              </NavLink>
            </NavItem>
            {isSmScreen && (
              <NavItem className="vote-nav">
                <div className="vote-share">
                  <div className="pill">
                    <VoteGroup
                      item={post}
                      upvoteRequest={() => voteControls.upVote}
                      downvoteRequest={() => voteControls.downVote}
                    />
                  </div>
                  {/* Share or Report dropdown */}
                  <UncontrolledDropdown>
                    <DropdownToggle>
                      <div>
                        <MoreIcon />
                      </div>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem onClick={handleShare}>
                        <div className="b5 text-body">{i18n.label.share}</div>
                      </DropdownItem>
                      <DropdownItem>
                        <div className="b5 text-danger">{i18n.label.report}</div>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </NavItem>
            )}
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane id="details" tabId="details">
              <Details />
            </TabPane>
            <TabPane id="comments" tabId="comments">
              <Comment />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    );
}

export default PostContent;
