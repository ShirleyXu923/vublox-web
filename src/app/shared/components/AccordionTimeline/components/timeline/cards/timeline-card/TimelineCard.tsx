// NOTE: Dependency cycle are needed for the children components to work in the timeline component.
/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

import './TimelineCard.scss';
import { ImageType, LocationType } from 'types';

import Card from './Card';
import CardItem from '../../components/CardItem';
import { Pin } from '../../components/pin';

interface TimelineCardProps {
  id: string;
  name?: string;
  description?: string;
  cover_image: ImageType;
  location: LocationType;
  started_at: Date;
  hasExtender: boolean;
  children?: []
}

function TimelineCard({
  id,
  children,
  hasExtender,
  ...rest
}: TimelineCardProps) {
  const ref = useRef<any>(null);
  const [ open, setOpen ] = useState('');
  const [ height, setHeight ] = useState(400);
  const toggle = () => {
    if (open !== id) {
      setOpen(id);
    } else {
      setOpen('');
    }
  };

  useEffect(() => {
    setHeight(ref?.current?.clientHeight);
  }, [ open ]);

  return (
    <Accordion
      toggle={toggle}
      open={open}
    >
      <AccordionItem>
        <AccordionHeader targetId={id}>
          <div className="timeline-card-container">
            <Pin withExtender={hasExtender} height={height} />
            {/* Add the Accordion Here */}
            <div style={{ width: '100%' }} ref={ref}>
              <Card id={id} {...rest} />
            </div>
          </div>
        </AccordionHeader>
        <AccordionBody accordionId={id}>
          {Array.isArray(children) && (
            <div className="children">
              {children?.map((child: any, index: number) => (
                <CardItem
                  open={open}
                  key={child?.key}
                  item={child}
                  list={children}
                  currentIndex={index}
                />
              ))}
            </div>
          )}
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

export default TimelineCard;
