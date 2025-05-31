// NOTE: Dependency cycle are needed for the children components to work in the timeline component.
/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from 'react';

import './GroupCard.scss';
import Card from './components/card/Card';
import { Pin } from '../../components/pin';

interface GroupCardProps {
  id: string;
  title: string;
  items: any[];
  hasExtender?: boolean;
  onChangeVisibleItems?: ((isVisible: boolean, items: any[]) => void);
  onClick: (item: any) => void;
}

function GroupCard({ hasExtender, ...rest }: GroupCardProps, open: any) {
  const cardRef = useRef<any>(null);
  const [ height, setHeight ] = useState<number>(1200);

  useEffect(() => {
    setHeight(cardRef.current?.clientHeight);
  }, [ open ]);

  return (
    <div className="group-card-container">
      <Pin withExtender={hasExtender} height={height} />

      <div ref={cardRef} className="card-wrap">
        <Card {...rest} />
      </div>
    </div>
  );
}

export default GroupCard;
