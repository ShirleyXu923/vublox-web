import React, { useEffect, useRef, useState } from 'react';

import CardImage from '@assets/img/CardImage.png';
import OrgLogo from '@assets/img/OrgLogo.png';
import {
  CommentIcon,
  DownvoteIcon,
  VerifiedIcon,
} from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';
import SocialShare from '@shared/icons/SocialShare';
import UpvoteIcon from '@shared/icons/UpvoteIcon';

import Pin from '../components/Pin';
import Verified from '../components/Verified';

interface ChildCardProps {
  open?: string;
}

function ChildCard({ open }: ChildCardProps) {
  const ref = useRef<any>(null);
  const [ height, setHeight ] = useState<number>(0);

  useEffect(() => {
    setHeight(ref.current?.clientHeight);
  }, [ open ]);

  return (
    <div className="timeline-item">
      <Pin withExtender height={height} />
      <div className="child-card" ref={ref}>
        <div className="content">
          <div className="image">
            <img height={249} src={CardImage} alt="" />
            <Verified />
          </div>
          {/* Contents here should be dynamic once the posts module is finished */}
          <div className="informative">
            <div className="b2">Chelsea vs. Aston Villa: Summer Showdown at Stamford Bridge</div>
            <div className="b5 description">Kick off the pre-season with an exciting friendly match be...</div>
            <div className="organization">
              <img src={OrgLogo} alt="" />
              <div className="info">
                <div className="name">
                  <div className="b3">Chelsea Football Club</div>
                  <VerifiedIcon />
                </div>
                <div className="date">
                  <div className="tab">24 Dec 2024, 1:00 pm</div>
                  <Ellipse />
                  <div className="tab">Stamford Bridge, London</div>
                </div>
              </div>
            </div>
            <div className="social">
              <div className="vote">
                <div className="upvote">
                  <UpvoteIcon />
                  <span>1,234</span>
                </div>
                <div className="line" />
                <div className="downvote">
                  <DownvoteIcon />
                </div>
              </div>
              <div className="interaction">
                <div className="comment">
                  <CommentIcon />
                  <span className="b5">10</span>
                </div>
                <div className="share">
                  <SocialShare />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildCard;
