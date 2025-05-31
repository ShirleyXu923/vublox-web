import React, { useEffect, useRef, useState } from 'react';

import OrgLogo from '@assets/img/OrgLogo.png';
import {
  CommentIcon, DownvoteIcon, UpvoteIcon, VerifiedIcon,
} from '@shared/icons';
import Ellipse from '@shared/icons/Ellipse';
import SocialShare from '@shared/icons/SocialShare';

import Pin from '../components/Pin';

interface DescriptiveCardProps {
  open?: string;
}

function DescriptiveCard({ open }: DescriptiveCardProps) {
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
          {/* Contents in here should be dynamic once the posts module finished */}
          <div className="informative">
            <div className="b2">Manchester United vs. AC Milan: International Friendly at Old Trafford</div>
            <div className="b5 description">In a highly anticipated international friendly at Old Trafford, Manchester United clashed with AC Milan in a thrilling encounter. The stadium buzzed with excitement as fans eagerly awaited the kickoff, with both teams fielding strong lineups for the pre-season fixture. From the first whistle, the match showcased a display of fast-paced football, with Manchester United dominating possession in the early stages. However, AC Milan fought back with determination, launching swift counterattacks and testing the Manchester United defense. In the end, it was Manchester United who emerged victorious, securing a hard-fought win against their Italian opponents in front of a raucous home crowd.</div>

            <div className="organization">
              <img src={OrgLogo} alt="" />
              <div className="info">
                <div className="name">
                  <div className="b3">Manchester United F.C.</div>
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

export default DescriptiveCard;
