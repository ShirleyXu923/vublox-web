import React, { useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

import AccordionCard from './AccordionCard';
import TimelineItem from './TimelineItem';

interface TimelineGroupProps {
  year: string;
  timeblocks: any;
  isLast: boolean;
}

function TimelineGroup({
  timeblocks,
  year,
  isLast,
}: TimelineGroupProps) {
  const [ showTimelines, setShowTimelines ] = useState(false);
  const [ open, setOpen ] = useState('');
  const toggle = () => {
    if (open !== year) {
      setOpen(year);
    } else {
      setOpen('');
    }
  };

  return (
    <Accordion
      toggle={toggle}
      open={open}
    >
      <AccordionItem>
        {/* This is year accordion */}
        <AccordionHeader targetId={year}>
          <TimelineItem year={year} onClick={() => setShowTimelines(!showTimelines)} />
        </AccordionHeader>

        {/* This is for the timeline card accordion */}
        <AccordionBody accordionId={year}>
          <>
            {timeblocks.map((timeblock: any) => (
              <AccordionCard
                isLast={isLast}
                key={timeblock?.id}
                timeblock={timeblock}
              />
            ))}
          </>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

export default TimelineGroup;
