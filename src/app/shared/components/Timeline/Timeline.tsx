import React, { useState } from 'react';
import { Container } from 'reactstrap';

import './Timeline.scss';
import TimeBlock from './TimeBlock';
import { AddTimeblock } from './TimeBlock/add-timeblock';

interface TimelineProps {
  timeBlocks: any[]
}

function Timeline({ timeBlocks }: TimelineProps) {
  const [ selectedTimeblock, setSelectedTimeblock ] = useState('');

  const handleSelectTimeblock = (id: string) => {
    setSelectedTimeblock(id);
  };

  return (
    <Container className="timeline-container">
      {timeBlocks.length && (
        <>
          {timeBlocks.map((timeBlock: any, index: number) => (
            <TimeBlock
              onSelectTimeblock={handleSelectTimeblock}
              selectedTimeblock={selectedTimeblock}
              isLast={(index === timeBlocks.length - 1)}
              key={timeBlock?.id}
              timeBlock={timeBlock}
            />
          ))}
          {!selectedTimeblock && (
            <div className="mt-3" style={{ marginLeft: '32px' }}>
              <AddTimeblock />
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default Timeline;
