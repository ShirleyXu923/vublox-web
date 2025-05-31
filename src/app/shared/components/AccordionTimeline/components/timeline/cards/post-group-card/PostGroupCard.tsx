// NOTE: Dependency cycle are needed for the children components to work in the timeline component.
/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from 'react';

import './PostGroupCard.scss';
import { Card } from './components/card';
import { Pin } from '../../components/pin';

interface PostGroupCardProps {
  title: string;
  posts: any[];
  hasExtender?: boolean;
}

function PostGroupCard({ hasExtender, ...rest }: PostGroupCardProps, open: any) {
  const cardRef = useRef<any>(null);
  const [ height, setHeight ] = useState<number>(1200);

  useEffect(() => {
    setHeight(cardRef.current?.clientHeight);
  }, [ open ]);

  return (
    <div className="post-group-card-container">
      <Pin withExtender={hasExtender} height={height} />

      <div ref={cardRef} className="card-wrap">
        <Card {...rest} />
      </div>
    </div>
  );
}

export default PostGroupCard;
