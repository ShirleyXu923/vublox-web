import React, { useEffect, useRef, useState } from 'react';

import { ImageType, LocationType } from 'types';

import Card from './Card';
import { Pin } from '../../components/pin';

import './PostCard.scss';

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  preview_image_urls: ImageType;
  created_at: Date;
  location: LocationType;
  owner: any;
  hasExtender: boolean;
  upvote_count: number;
  comment_count: number;
}

function PostCard({ hasExtender, ...rest }: PostCardProps) {
  const ref = useRef<any>(null);
  const [ height, setHeight ] = useState(500);

  useEffect(() => {
    setHeight(ref.current?.clientHeight);
  }, []);

  return (
    <div className="post-card-container">
      <Pin withExtender={hasExtender} height={height} />

      <Card {...rest} />
    </div>
  );
}

export default PostCard;
